import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import InteractionArea from "./InteractionArea";
import TextLog from "./TextLog";
import useBattleid from "../useBattleId";
import useToken from "../SignIn/useToken";
import axios from "axios";
import useInteractionHandler from "./useInteractionHandler";
import MonsterDisplayBox from "../Fight/MonsterDisplayBox";

interface NewFightWindowProps {
	setWindow: React.Dispatch<React.SetStateAction<string>>;
}

const NewFightWindow = ({ setWindow }: NewFightWindowProps) => {
	const { getuserToken } = useToken();
	const { getBattleId } = useBattleid();
	const [battleInfo, setBattleInfo] = useState<battlefieldInfo>();

	const [teamArray, setTeamArray] = useState<monsterInfo[][]>([]);
	const [interactionState, setInteractionState] = useState<string>("Move"); // The state of the interaction area // "Move", "Monster", "Wait", "Undefined"
	// InteractionState starts at "Move" because the player will always start by picking a move

	// Get the functions from the useInteractionHandler hook, which will handle the logic of the interaction between the player and the game
	const {
		activeMonsterMovesR,
		setActivePlayerMonster,
		setSelectedMonsterMoveIndex,
		setPickedMovesR,
		setPickedOpponentMonstersR,
		setActiveOpponentMonster,
		selectedMonsterSwapIndex,
		setSelectedMonsterSwapIndex,
		isMovePicked,
		isMonsterSelected,
		verifyPicks,
		submitPicks,
		submitSwap,
	} = useInteractionHandler(battleInfo, interactionState);

	// When the fight window is mounted and if/when ___ updates, Get an updated T.I.P.
	useEffect(() => {
		// Make the controller
		const controller = new AbortController();
		// Send the Request
		requestTIP(controller)
			// When the request is done, set the battleInfo
			.then((res) => {
				if (res) {
					setBattleInfo(res);
				} else {
					if (controller.signal.aborted) {
						// console.log("Request Aborted"); // Debugging
					} else {
						// console.error("Request Failed"); // Debugging
					}
				}
			});

		return () => {
			// console.log("Unmounting Fight Window");
			controller.abort();
		};
	}, []);

	useEffect(() => {
		// If the interaction state is set to Monster or Move, Update the BattleInfo by a request to the server
		if (interactionState == "Monster" || interactionState == "Move") {
			// Make the controller
			const controller = new AbortController();
			// Send the Request
			requestTIP(controller).then((res) => {
				if (res) {
					// When the request is done, set the battleInfo
					setBattleInfo(res);
					// also reset the chosen moves and monsters
					setPickedMovesR([]);
					setPickedOpponentMonstersR([]);
				} else {
					if (controller.signal.aborted) {
						// console.log("Request Aborted"); // Debugging
					} else {
						// console.error("Request Failed"); // Debugging
					}
				}
			});

			return () => {
				// console.log("Unmounting Fight Window");
				controller.abort();
			};
		}
	}, [interactionState]);

	// When the battleInfo Changes update the teamArray
	useEffect(() => {
		// Ensure the battleInfo is set
		if (!battleInfo) return;

		//Get the list of monsters to display
		var newTeamArray: monsterInfo[][] = [];
		//For each Team
		for (let index = 0; index < battleInfo.teamCount; index++) {
			//Get The active monsters in the array
			var innerTeamArray: monsterInfo[] = [];
			for (let i = 0; i < battleInfo.activeMon; i++) {
				//Build the active array
				const monster = battleInfo.monsters[index * battleInfo.monInTeam + i];
				innerTeamArray.push(monster);
			}
			//Build the team array
			newTeamArray.push(innerTeamArray);
		}

		// Set the team array
		setTeamArray(newTeamArray);
	}, [battleInfo]);

	const requestTIP = async (controller: AbortController) => {
		const userId = getuserToken();
		const battleId = getBattleId();

		return await axios
			.post(
				"http://localhost:8080/api/battle/retrieveTIP",
				JSON.stringify({ userId, battleId }),
				{
					headers: { "Content-Type": "application/json" },
					signal: controller.signal,
				}
			)
			.then((res) => {
				return res.data as battlefieldInfo;
			})
			.catch((error) => {
				if (error.response) {
					console.error(error.response);
				}
			});
	};

	const handleMonsterClick = (teamIndex: number, monsterIndex: number) => {
		// If the monster is dead, do nothing
		if (
			battleInfo?.monsters[teamIndex * battleInfo.monInTeam + monsterIndex]
				.isDead
		) {
			if (interactionState != "Monster") {
				// Monster is dead here so nothing should happen
				return;
			} else {
				// If the player is picking a monster, set the active monster
				// console.log("Picking Dead Monster");
				setActivePlayerMonster(monsterIndex);
				return;
			}
		}

		switch (interactionState) {
			// If the player is picking a move
			case "Move":
				// If the player is picking their monster set the active monster
				if (teamIndex == 0) {
					setActivePlayerMonster(monsterIndex);
				} else if (teamIndex == 1) {
					// If the player is picking the opponent's monster set the active Opponent Monster
					if (isMonsterSelected(1, monsterIndex, interactionState)) {
						setActiveOpponentMonster(undefined);
					} else {
						setActiveOpponentMonster(monsterIndex);
					}
				} else {
					// If the player is picking an invalid team, log an error
					console.error("Invalid Team Index", teamIndex);
				}
				break;
			// If the player is picking an alive monster
			case "Monster":
				// If the player is picking their monster set the active monster
				if (teamIndex == 0 || teamIndex == 1) {
					// Do nothing as an alive monster is not the correct choice
					break;
				} else {
					// If the player is picking an invalid team, log an error
					console.error("Invalid Team Index", teamIndex);
				}
				break;
			// If the player is waiting
			case "Wait":
				// Do nothing
				break;
			// If we are in an undefined state
			default:
				// Log an error
				console.error("Invalid Interaction State", interactionState);
				break;
		}
	};

	// If the battleInfo is not set, return a loading screen
	if (!battleInfo) return <div>Loading...</div>; // TODO: Add a better loading state
	// So I might do the nothing approach, we'll see

	const handleSubmitPicksMoves = () => {
		// If the picks are not verified, log an error
		if (!verifyPicks(battleInfo)) {
			console.error("Picks not verified");
			// TODO add a onscreen error message
		}
		const controller = new AbortController();
		// Submit the picks
		submitPicks(battleInfo, controller)
			.then((res) => {
				if (!res) {
					// console.error("Submit Picks Failed"); // This should not happen as the verifyPicks should catch this
					return;
				}
				// console.log("Picks Submitted"); // Debugging
				// If the picks are verified, start the inquiry cycle
				// Define the inquiry cycle
				const inquiryCycle = async () => {
					// console.log("Starting Inquiry Cycle"); // Debugging
					// Send the Inquiry
					const repeat = await sendInquiry(controller);
					// If the inquiry should repeat, repeat the inquiry cycle
					if (repeat) {
						// console.log("Repeating Inquiry"); // Debugging
						// Wait for 1 second before sending the next inquiry
						setTimeout(() => inquiryCycle(), 2000);
					} else {
						// console.log("Inquiry Cycle Complete"); // Debugging
					}
				};
				// Start the inquiry cycle
				inquiryCycle();

				setInteractionState("Wait");
			})
			.catch((error) => {
				if (error.response) {
					// console.log("Submit Picks Failed"); // Debugging
					controller.abort();
					console.error(error.response);
				}
			});

		//
	};

	const handleSubmitPicksMonsters = () => {
		// If verify the picks
		if (selectedMonsterSwapIndex == undefined) {
			console.error("No Monster Selected"); // TODO: add an onscreen error message
			return;
		}
		const controller = new AbortController();

		// Submit the picks
		submitSwap(battleInfo, controller)
			.then((res) => {
				if (!res) {
					console.error("Submit Picks Failed"); // This should not happen as the verifyPicks should catch this
					return;
				}
				// console.log("Picks Submitted"); // Debugging
				// If the picks are verified, start the inquiry cycle
				// Define the inquiry cycle
				const inquiryCycle = async () => {
					// console.log("Starting Inquiry Cycle"); // Debugging
					// Send the Inquiry
					const repeat = await sendInquiry(controller);
					// If the inquiry should repeat, repeat the inquiry cycle
					if (repeat) {
						// console.log("Repeating Inquiry"); // Debugging
						// Wait for 1 second before sending the next inquiry
						setTimeout(() => inquiryCycle(), 2000);
					} else {
						// console.log("Inquiry Cycle Complete"); // Debugging
					}
				};
				// Start the inquiry cycle
				inquiryCycle();
				setInteractionState("Wait");
			})
			.catch((error) => {
				if (error.response) {
					// console.log("Submit Picks Failed"); // Debugging
					controller.abort();
					console.error(error.response);
				}
			});

		//
	};

	/**
	 * Send an Inquiry to the server
	 * @param controller The AbortController to cancel the request
	 * @returns returns if the Inquiry should repeat
	 */
	const sendInquiry = async (controller: AbortController) => {
		const userId = getuserToken();
		const battleId = getBattleId();

		// console.log("Sending Inquiry"); // Debugging

		return await axios
			.post(
				"http://localhost:8080/api/battle/inquire",
				JSON.stringify({ userId, battleId }),
				{
					headers: { "Content-Type": "application/json" },
					signal: controller.signal,
				}
			)
			.then((res) => {
				// Read the data as a string
				const info = res.data as String;

				// On a 202 response (Paused)
				if (res.status == 202) {
					switch (info) {
						case "TIP: Paused (Self)": // The user has a dead monster
							// When it's paused by the user, we should be in the monster state
							if (interactionState != "Monster") {
								console.log("Paused (Self) and setting to Monster");
								setInteractionState("Monster");
							}
							return false;
						case "TIP: Paused": // The AI has a dead monster so we need to wait for the AI to make a move
							// console.log("Paused");
							// When it's paused by the AI, we should be in the wait state
							if (interactionState != "Wait") {
								console.log("Paused and setting to Wait");
								setInteractionState("Wait");

								// when the AI is paused, we need to update the battleInfo to the current state
								// We only need to do this once so only do this when we move to the wait state
								const newController = new AbortController();
								requestTIP(newController)
									.then((res) => {
										if (res) {
											console.log("Paused and updating battleInfo");
											setBattleInfo(res);
										}
									})
									.catch((error) => {
										if (error.response) {
											newController.abort();
											console.error(error.response);
										}
									});
							}

							return true;
						default:
							console.error("Unexpected Response from inquiry: (" + info + ")");
							return false;
					}
				} else if (res.status == 200) {
					switch (info) {
						case "TIP: New":
							// console.log("New"); // Something has gone wrong as this should not be returned
							// When it's new, we should be in the move state
							if (interactionState != "Move") {
								console.log("New and setting to Move");
								setInteractionState("Move");
							}
							return false;
						case "TIP: Simulating":
							console.log("Simulating");
						// When it's simulating, we should be in the wait state
						case "TIP: Waiting":
							console.log("Waiting");
						// When it's waiting, we should be in the wait state
						case "TIP: Resume":
							// When it's resume, we should be in the wait state
							if (interactionState != "Wait") {
								console.log("Resume and setting to Wait");
								setInteractionState("Wait");
							}
							return true;
						case "TIP: Complete":
							console.log("Complete");
							// When it is complete we should go to the move state
							setInteractionState("Move");
							return false;
						case "TIP: End":
							console.log("End");
							// When it is the end we should set the window to the results window
							setWindow("Results");
							return false;
						// TODO Might want to add a delay for the results window either a timer or a button
						default:
							console.error("Unexpected Response from inquiry: ", info);
							break;
					}
				} else {
					console.error("Unexpected Status from inquiry: ", res);
				}
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status == 422) {
						console.error("Invalid data sent to server"); // Debugging
						return false;
					}
					console.error(error.response);
					return false;
				}
			});
	};

	const handleIsValid = (teamIndex: number, monsterIndex: number) => {
		// If the interaction state is monster, invert isValid for the player's team
		if (interactionState == "Monster") {
			if (teamIndex == 0) return battleInfo.monsters[monsterIndex].isDead;
		}
		// Otherwise, return the normal isValid
		return !battleInfo.monsters[teamIndex * battleInfo.monInTeam + monsterIndex]
			.isDead;
	};

	// Otherwise, return the fight window
	return (
		<div className="d-flex flex-row">
			<div style={{ width: "140%" }}>
				<BattleField battleInfo={battleInfo} background="">
					<div
						className="d-flex flex-column-reverse justify-content-around"
						style={{ height: "55vh" }}
					>
						{/* ActiveMonsters */}
						{teamArray.map((team, teamIndex) => (
							<div
								className="team d-flex flex-row justify-content-around"
								key={teamIndex}
							>
								{teamIndex == 0 && "self ->"}
								{team.map((monster, monsterIndex) => (
									<MonsterDisplayBox
										monster={monster}
										isValid={handleIsValid(teamIndex, monsterIndex)}
										key={monsterIndex}
										isSelected={isMonsterSelected(
											teamIndex,
											monsterIndex,
											interactionState
										)}
										onClick={() => {
											handleMonsterClick(teamIndex, monsterIndex);
										}}
									/>
								))}
								{teamIndex != 0 && "<- opponent"}
							</div>
						))}
					</div>
				</BattleField>
				<InteractionArea
					interaction={interactionState}
					battleInfo={battleInfo}
					isMovePicked={isMovePicked}
					activeMonsterMovesR={activeMonsterMovesR}
					setSelectedMonsterMoveIndex={setSelectedMonsterMoveIndex}
					selectedMonsterSwapIndex={selectedMonsterSwapIndex}
					setSelectedMonsterSwapIndex={setSelectedMonsterSwapIndex}
					submitPicks={handleSubmitPicksMoves}
					submitSwap={handleSubmitPicksMonsters}
				/>
			</div>
			<TextLog />
		</div>
	);
};

export default NewFightWindow;
