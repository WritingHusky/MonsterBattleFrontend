import { SetStateAction, useEffect, useState } from "react";
import MoveDisplayBox from "./MoveDisplayBox";
import axios from "axios";
import useToken from "../SignIn/useToken";
import useBatelId from "../useBattleId";
import MonsterDisplayWindow from "./MonsterDisplayWindow";

interface MonsterDisplayProps {
	battleInfo: battlefieldInfo | undefined;
	setState: React.Dispatch<SetStateAction<string>>;
}

const MonsterDisplay = ({ battleInfo, setState }: MonsterDisplayProps) => {
	const { getuserToken } = useToken();
	const { getBattleId } = useBatelId();

	const [activeMoves, setActiveMoves] = useState<MonsterMove[]>();
	const [activeMon, setActiveMon] = useState<number>(0);

	const [selectedMove, setSelectedMove] = useState<number>();
	const [selectedMon, setSelectedMon] = useState<number>();

	const [pickedMoves, setPickedMoves] = useState<(number | undefined)[]>([]);
	const [pickedMons, setPickedMons] = useState<(number | undefined)[]>([]);

	// When the battleInfo or the activemon changes, update the active moves
	useEffect(() => {
		if (battleInfo != undefined) {
			const activeMonster = battleInfo.monsters[battleInfo.activeMon];
			setActiveMoves(activeMonster.moves);
		}
	}, [battleInfo, activeMon]);

	//When the selectedMove changes, update the pickedMoves to save the picked move
	useEffect(() => {
		if (selectedMove == undefined) {
			return;
		}

		let newPickedMoves = [...pickedMoves];
		newPickedMoves[activeMon] = selectedMove;
		setPickedMoves(newPickedMoves);
	}, [selectedMove]);

	//When the selectedMon changes, update the pickedMons to save the picked mon
	useEffect(() => {
		if (selectedMon == undefined) {
			return;
		}

		let newPickedMons = [...pickedMons];
		newPickedMons[activeMon] = selectedMon;
		setPickedMons(newPickedMons);
	}, [selectedMon]);

	//When the activeMon changes, update the selectedMove to show the selected move
	useEffect(() => {
		if (pickedMoves[activeMon] == undefined) {
			//If the move is not picked reset the selected move
			setSelectedMove(undefined);
		} else {
			//Else set the selected move to the previously picked move
			setSelectedMove(pickedMoves[activeMon]);
		}
		// Now update the seletedMon in the same way
		if (pickedMons[activeMon] == undefined) {
			setSelectedMon(undefined);
		} else {
			setSelectedMon(pickedMons[activeMon]);
		}
	}, [activeMon]);

	//When the component is first loaded, if the battleInfo is loaded, set the activeMoves
	useEffect(() => {
		if (battleInfo != undefined) {
			const activeMonster = battleInfo.monsters[activeMon];
			// console.log("ActiveMon: ", activeMonster);
			setActiveMoves(activeMonster.moves);
		}
	}, []);

	//If the battleInfo is not loaded, return a loading screen
	if (battleInfo == undefined) {
		return <div>Loading...</div>; //TODO add undefined handling
	}

	const handleMonsterSelect = (teamIndex: number, monsterIndex: number) => {
		if (teamIndex == 0) {
			setActiveMon(monsterIndex);
		} else {
			if (monsterIndex == pickedMons[activeMon]) {
				//If the mon is already picked, reset the mon
				let newPickedMons = [...pickedMons];
				newPickedMons[activeMon] = undefined;
				setPickedMons(newPickedMons);
				setSelectedMon(undefined);
				return;
			} else {
				setSelectedMon(monsterIndex);
			}
		}
	};

	const handleMoveSelect = (moveIndex: number) => {
		if (moveIndex == pickedMoves[activeMon]) {
			//If the move is already picked, reset the move
			let newPickedMoves = [...pickedMoves];
			newPickedMoves[activeMon] = undefined;
			setPickedMoves(newPickedMoves);
			setSelectedMove(undefined);
			return;
		}
		setSelectedMove(moveIndex);
	};

	const isSelected = (teamIndex: number, monsterIndex: number) => {
		if (teamIndex == 0) {
			return activeMon === monsterIndex;
		} else {
			return selectedMon === monsterIndex;
		}
	};

	// Verify that each pickedMon has a pickedMove
	const verifyPicks = () => {
		for (let i = 0; i < battleInfo.activeMon; i++) {
			if (pickedMons[i] == undefined || pickedMoves[i] == undefined) {
				return false;
			}
		}
		return true;
	};

	// Submit the picks to the server
	const submitPicks = async () => {
		// If the picks are not verified, return
		if (!verifyPicks()) {
			return;
		}
		// console.log("Submitting Picks");
		//Submit the picks to the server
		for (let i of Array.from({ length: battleInfo.activeMon }, (_, i) => i)) {
			const userId = getuserToken();
			const battleId = getBattleId();
			const sourceSlot = battleInfo.monsters[i].slot;
			const targetSlot =
				battleInfo.monsters[(pickedMons[i] as number) + battleInfo.monInTeam]
					.slot;
			const moveIndex = pickedMoves[i] as number; //This should be safe as the picks are verified
			// console.log("Submitting Move: ", i);
			await handleMoveSubmit(
				userId,
				battleId,
				sourceSlot,
				targetSlot,
				moveIndex
			);
			// console.log("Move Submitted: ", i);
		}
	};

	const handleMoveSubmit = async (
		userId: String,
		battleId: String,
		sourceSlot: String,
		targetSlot: String,
		moveIndex: number
	) => {
		return (
			axios
				.post(
					"http://localhost:8080/api/battle/sendMove",
					JSON.stringify({
						userId,
						battleId,
						sourceSlot,
						targetSlot,
						moveIndex,
					}),
					{ headers: { "Content-Type": "application/json" } }
				)
				.then((res) => {
					if (res.status == 202) {
						//Move Queue is now full
						setState("Waiting");
						return true;
					} else if (res.status == 200) {
						//Move was accepted
						return false;
					} else {
						//Move was not accepted but still returned a 2xx status code
						console.error("2xxx code not expected", res);
						return false;
					}
				}) //If every thing is good
				// Looking to recieve a JSON object of the format: { "userID": "..."}
				.catch((error) => {
					if (error.response) {
						console.error(error.response);
						//If there is an error (status code > 2xx)
						if (error.response.status == 401) {
							//Handle the 401 (Unauthorized)
						}
					}
				})
		);
	};

	//Get the list of monsters to display
	var teamArray: monsterInfo[][] = [];
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
		teamArray.push(innerTeamArray);
	}

	return (
		<>
			<MonsterDisplayWindow
				battleInfo={battleInfo}
				isSelected={isSelected}
				onClick={handleMonsterSelect}
			/>
			{/* Moves */}
			<div
				className="border border-dark d-flex flex-row justify-content-center"
				style={{ height: "15vh" }}
			>
				{activeMoves &&
					activeMoves.map((move, index) => (
						<MoveDisplayBox
							move={move}
							key={index}
							isSelected={selectedMove === index}
							onClick={() => handleMoveSelect(index)}
						/>
					))}
				<div className="h-100 btn btn-secondary" onClick={submitPicks}>
					Submit
				</div>
			</div>
			{/* Full Team */}
			<div className="border border-dark" style={{ height: "15vh" }}></div>
		</>
	);
};

export default MonsterDisplay;
