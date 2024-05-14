import MoveDisplayBox from "../Fight/MoveDisplayBox";

interface InteractionAreaProps {
	interaction: string | undefined;
	battleInfo: battlefieldInfo | undefined;
	submitPicks: (battleInfo: battlefieldInfo) => void;
	isMovePicked: (index: number) => boolean;
	setSelectedMonsterMoveIndex: (index: number | undefined) => void;
	activeMonsterMovesR: MonsterMove[] | undefined;
}
const InteractionArea = ({
	interaction,
	battleInfo,
	submitPicks,
	isMovePicked,
	setSelectedMonsterMoveIndex,
	activeMonsterMovesR,
}: InteractionAreaProps) => {
	if (battleInfo == undefined) return <div>Loading...</div>; // TODO: Add a better loading state

	switch (interaction) {
		case "Move": // This is the state where the player is picking a move
			return (
				<div
					className="border d-flex flex-row justify-content-center align-items-center flex-shrink-1"
					style={{ height: "35vh" }}
				>
					{activeMonsterMovesR?.map((move, index) => (
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
					))}
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
			return <div>Monster</div>;
		case "Wait": // This is the state where the player is waiting for whatever reason
			return <div>Waiting</div>;
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
