import { useEffect, useState } from "react";
import useToken from "../SignIn/useToken";
import useBatelId from "../useBattleId";
import axios from "axios";
/*
Note: ___R variables are variables that are updated in response to changes in other variables.
*/

// This hook will handle the interaction between the player and the game in terms of move and monster choices
const useInteractionHandler = (
	battlefieldInfo: battlefieldInfo | undefined
) => {
	const { getuserToken } = useToken();
	const { getBattleId } = useBatelId();

	//#region Player Monster Choice

	// Player choice state
	const [activePlayerMonster, setActivePlayerMonster] = useState<number>(0); // The index of the monster the actvive player is using
	const [activeMonsterMovesR, setActiveMonsterMovesR] =
		useState<MonsterMove[]>();

	// When the activePlayerMonster or the battlefield changes, update the activeMonsterMoves
	useEffect(() => {
		// If the battlefieldInfo is undefined, do nothing
		if (battlefieldInfo == undefined) return;
		// Get the active monster from the battlefieldInfo
		const activeMonster = battlefieldInfo.monsters[activePlayerMonster];
		// Set the activeMonsterMoves
		setActiveMonsterMovesR(activeMonster.moves);
	}, [activePlayerMonster, battlefieldInfo]);

	// When the activePlayerMonster changes, check if the monster has a chosen move and if it does, set the selectedMonsterMoveIndex to that move
	useEffect(() => {
		if (pickedMovesR[activePlayerMonster] != undefined) {
			setSelectedMonsterMoveIndex(pickedMovesR[activePlayerMonster] as number);
		}
		if (pickedOpponentMonstersR[activePlayerMonster] != undefined) {
			setActiveOpponentMonster(
				pickedOpponentMonstersR[activePlayerMonster] as number
			);
		}
	}, [activePlayerMonster]);

	//#endregion

	//#region Opponent Monster Choice

	// Opponent choice state
	const [activeOpponentMonster, setActiveOpponentMonster] = useState<number>(); // The index of the monster the opponent is using
	const [pickedOpponentMonstersR, setPickedOpponentMonstersR] = useState<
		(number | undefined)[]
	>([]); // The monsters the opponent has picked

	// When the activeOpponentMonster changes, update the pickedOpponentMonsters to save the picked monster
	useEffect(() => {
		// Copy over the pickedOpponentMonsters
		let newPickedOpponentMonsters = [...pickedOpponentMonstersR];

		// Check if the selected monster is undefined set that monster to undefined in the pickedOpponentMonsters
		if (activeOpponentMonster == undefined) {
			// If it is, remove it
			newPickedOpponentMonsters[activePlayerMonster] = undefined;
		} else {
			// If it's not, add it
			newPickedOpponentMonsters[activePlayerMonster] = activeOpponentMonster;
		}

		setPickedOpponentMonstersR(newPickedOpponentMonsters);
	}, [activeOpponentMonster]);
	//#endregion

	//#region Monster Move Choice

	// The index of the move the active player hase chosen
	const [selectedMonsterMoveIndex, setSelectedMonsterMoveIndex] =
		useState<number>();

	// The moves the active player has picked
	const [pickedMovesR, setPickedMovesR] = useState<(number | undefined)[]>([]);

	// When the activeMonsterMoveIndex changes, update the pickedMoves to save the picked move
	useEffect(() => {
		// Copy over the pickedMoves
		let newPickedMoves = [...pickedMovesR];

		// Check if the selected move is already picked or is set to undefined
		if (selectedMonsterMoveIndex == undefined) {
			// If it is, remove it
			newPickedMoves[activePlayerMonster] = undefined;
		} else {
			// If it's not, add it
			newPickedMoves[activePlayerMonster] = selectedMonsterMoveIndex;
		}

		setPickedMovesR(newPickedMoves);
	}, [selectedMonsterMoveIndex]);
	//#endregion

	//#region Monster Swap Choice
	const [selectedMonsterSwapIndex, setSelectedMonsterSwapIndex] =
		useState<number>();
	const [pickedSwapR, setPickedSwapR] = useState<(number | undefined)[]>([]);

	// When the selectedMonsterSwapIndex changes, update the pickedSwap to save the picked swap
	useEffect(() => {
		let newPickedSwap = [...pickedSwapR];

		if (selectedMonsterSwapIndex == undefined) {
			newPickedSwap[activePlayerMonster] = undefined;
		} else {
			newPickedSwap[activePlayerMonster] = selectedMonsterSwapIndex;
		}

		setPickedSwapR(newPickedSwap);
	}, [selectedMonsterSwapIndex]);

	//#region Relevent Functions
	// This function will return if move is picked or not
	const isMovePicked = (moveIndex: number) => {
		// console.log(
		// 	"isMovePicked",
		// 	pickedMovesR[activePlayerMonster],
		// 	moveIndex,
		// 	pickedMovesR[activePlayerMonster] === moveIndex
		// );
		return pickedMovesR[activePlayerMonster] === moveIndex;
	};

	const isMonsterSelected = (teamIndex: number, monsterIndex: number) => {
		switch (teamIndex) {
			case 0:
				return monsterIndex == activePlayerMonster;
			case 1:
				return pickedOpponentMonstersR[activePlayerMonster] === monsterIndex;
			default:
				console.error(
					"Unexpected call to the isMonsterSelected function with teamIndex: ",
					teamIndex,
					" and monsterIndex: ",
					monsterIndex
				);
				break;
		}
	};

	// This function will return if a move is disabled or not
	const isMoveDisabled = (
		_moveIndex: number,
		_battlefieldInfo: battlefieldInfo
	) => {
		return false; // This is a placeholder
		// currently Move disabling is not implemented or I dont know how i plan to implement it
		// TODO: Check back with better documentation set up for how that works
	};

	// Verify that each pickedMon has a pickedMove
	const verifyPicks = (battleInfo: battlefieldInfo) => {
		// For each active monster
		for (
			let monsterIndex = 0;
			monsterIndex < battleInfo.activeMon;
			monsterIndex++
		) {
			// If an opponent or move are not picked, return false
			if (
				pickedOpponentMonstersR[monsterIndex] == undefined ||
				pickedMovesR[monsterIndex] == undefined
			) {
				return false;
			}
		}
		// If all monsters have an opponent and move picked, return true
		return true;
	};

	// Submit the picks to the server
	const submitPicks = async (
		battleInfo: battlefieldInfo,
		controller: AbortController
	) => {
		// console.log("Submitting Picks in interaction handler"); // Debugging
		// If the picks are not verified, return
		if (!verifyPicks(battleInfo)) {
			// console.error("Picks not verified in interaction handler"); // Debugging
			return false;
		}
		const userId = getuserToken();
		const battleId = getBattleId();
		// console.log("Submitting Picks");
		//Submit the picks to the server
		for (let i of Array.from({ length: battleInfo.activeMon }, (_, i) => i)) {
			const sourceSlot = battleInfo.monsters[i].slot;
			const targetSlot =
				battleInfo.monsters[
					(pickedOpponentMonstersR[i] as number) + battleInfo.monInTeam
				].slot;
			const moveIndex = pickedMovesR[i] as number; //This should be safe as the picks are verified
			// console.log("Submitting Move: ", i); // Debugging
			if (
				(await handleMoveSubmit(
					userId,
					battleId,
					sourceSlot,
					targetSlot,
					moveIndex,
					controller
				)) &&
				i != battleInfo.activeMon - 1
			) {
				console.log("Move Queue Full");
				// If the Move Queue is full and there are more moves to submit
				// return and wait for the next turn
				return true;
			}
			// console.log("Move Submitted: ", i); // Debugging
		}
		return true;
	};

	const submitSwap = async (
		battleInfo: battlefieldInfo,
		controller: AbortController
	) => {
		// If there is no selectedMonsterSwapIndex, return
		if (selectedMonsterSwapIndex === undefined) {
			return false;
		}
		const userId = getuserToken();
		const battleId = getBattleId();
		await handleMoveSubmit(
			userId,
			battleId,
			battleInfo.monsters[activePlayerMonster].slot,
			battleInfo.monsters[selectedMonsterSwapIndex].slot,
			4,
			controller
		);
		return true;
	};

	const handleMoveSubmit = async (
		userId: String,
		battleId: String,
		sourceSlot: String,
		targetSlot: String,
		moveIndex: number,
		controller: AbortController
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
					{
						headers: { "Content-Type": "application/json" },
						signal: controller.signal,
					}
				)
				.then((res) => {
					if (res.status == 202) {
						//Move Queue is now full
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
						return false;
					}
				})
		);
	};

	//#endregion

	return {
		// activePlayerMonster,
		setActivePlayerMonster, // Used when player monster is selected
		activeMonsterMovesR,
		// setActiveMonsterMovesR,
		// selectedMonsterMoveIndex,
		setSelectedMonsterMoveIndex, // Use when a move is selected
		// pickedMovesR,
		setPickedMovesR, // Used to reset the picked moves
		// activeOpponentMonster,
		setActiveOpponentMonster, // Used when opponent monster is selected
		// pickedOpponentMonstersR,
		setPickedOpponentMonstersR, // Used to reset the picked opponent monsters
		selectedMonsterSwapIndex,
		setSelectedMonsterSwapIndex, // Used when a monster swap is selected
		isMovePicked, // Used to check if a move is picked
		isMonsterSelected, // Used to check if a monster is selected
		isMoveDisabled, // Used to check if a move is disabled
		verifyPicks, // Used to verify that all picks are made
		submitPicks, // Used to submit the picks to the server
		submitSwap, // Used to submit the swap to the server
	};
};

export default useInteractionHandler;
