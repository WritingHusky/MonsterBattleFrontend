import MonsterDisplayBox from "../Fight/MonsterDisplayBox";
import MoveDisplayBox from "../Fight/MoveDisplayBox";

interface InteractionAreaProps {
	interaction: string | undefined;
	battleInfo: battlefieldInfo | undefined;
	submitPicks: (battleInfo: battlefieldInfo) => void;
	submitSwap: () => void;
	isMovePicked: (index: number) => boolean;
	setSelectedMonsterMoveIndex: (index: number | undefined) => void;
	setSelectedMonsterSwapIndex: React.Dispatch<
		React.SetStateAction<number | undefined>
	>;
	selectedMonsterSwapIndex: number | undefined;
	activeMonsterMovesR: MonsterMove[] | undefined;
}
const InteractionArea = ({
	interaction,
	battleInfo,
	submitPicks,
	submitSwap,
	isMovePicked,
	setSelectedMonsterMoveIndex,
	setSelectedMonsterSwapIndex,
	selectedMonsterSwapIndex,
	activeMonsterMovesR,
}: InteractionAreaProps) => {
	if (battleInfo == undefined) return <div>Loading...</div>; // TODO: Add a better loading state

	// Handle the click on the monster in the Monster state
	const handleMonsterClick = (index: number) => {
		// Handle some edge cases
		// If the monster is dead, do nothing
		if (battleInfo.monsters[index].isDead) return;
		// If the monster is the active player's monster, do nothing
		if (index < battleInfo.activeMon) return;
		// Set the activeOpponentMonster to the clicked monster

		// If the monster is already selected, unselect it
		if (selectedMonsterSwapIndex === index) {
			setSelectedMonsterSwapIndex(undefined); // Unselect the move
		} else {
			// Otherwise, select the monster
			setSelectedMonsterSwapIndex(index); // Select the move
		}
	};

	const handleMonsterSubmit = () => {
		// If the selectedMonsterSwapIndex is undefined, do nothing
		if (selectedMonsterSwapIndex === undefined) return;
		// Otherwise, sumbit the move
		submitSwap();
	};

	const isValid = (index: number) => {
		return !battleInfo.monsters[index].isDead && index >= battleInfo.activeMon;
	};

	switch (interaction) {
		case "Move": // This is the state where the player is picking a move
			return (
				<div
					className="border d-flex flex-row justify-content-center align-items-center flex-shrink-1"
					style={{ height: "35vh" }}
				>
					{activeMonsterMovesR?.map(
						(move, index) =>
							/* Only show the first 4 moves (i.e. hidde the swap move) */
							index < 4 && (
								<MoveDisplayBox
									move={move}
									key={index}
									isSelected={isMovePicked(index)}
									onClick={() => {
										if (isMovePicked(index)) {
											setSelectedMonsterMoveIndex(undefined); // Unselect the move
										} else {
											setSelectedMonsterMoveIndex(index); // Select the move
										}
									}}
								/>
							)
					)}
					<div
						className="btn btn-secondary"
						onClick={() => submitPicks(battleInfo)}
					>
						Submit
					</div>
				</div>
			);
		case "Monster": // This is the state where the player is picking a monster
			// Build the array of the monster on the player's team
			return (
				<div
					className="border d-flex flex-column justify-content-start align-items-center gap-2"
					style={{ height: "35vh" }}
				>
					<div className="d-flex flex-row justify-content-center">
						Please select a monster to switch out of the battle
					</div>
					<div className="d-flex flex-row justify-content-center align-items-center flex-shrink-1 flex-wrap">
						{battleInfo.monsters.map(
							(monster, index) =>
								index < battleInfo.monInTeam &&
								index >= battleInfo.activeMon && (
									<MonsterDisplayBox
										monster={monster}
										key={index}
										isValid={isValid(index)}
										isSelected={selectedMonsterSwapIndex === index}
										onClick={() => {
											if (isValid(index)) {
												handleMonsterClick(index);
											}
										}}
									/>
								)
						)}
					</div>
					<button
						className="btn btn-secondary w-50 mt-2"
						onClick={handleMonsterSubmit}
					>
						submit
					</button>
				</div>
			);
		case "Wait": // This is the state where the player is waiting for whatever reason
			return (
				<div
					className="border d-flex flex-column justify-content-center align-items-center gap-2"
					style={{ height: "35vh" }}
				>
					Waiting
				</div>
			);
		case undefined: // Semi error state where no interaction is defined. This should never happen
			console.log("InteractionArea.tsx: interaction is undefined");
			return <div>Undefined</div>;
		default:
			console.error(
				"InteractionArea.tsx: InteractionArea in Unexpected state: ",
				interaction
			);
			return <div>Interaction Area in Unexpected state: {interaction}</div>;
	}
};

export default InteractionArea;
