interface MoveDisplayBoxProps {
	move: MonsterMove;
	isSelected: boolean;
	onClick: () => void;
}

const MoveDisplayBox = ({ move, isSelected, onClick }: MoveDisplayBoxProps) => {
	if (!move) {
		return null; // or return a default component
	}
	// Assign bg color by type
	var backgroundColor;
	var selectedBackgroundColor;
	switch (move.typing.toLowerCase()) {
		case "fire":
			backgroundColor = "#FFD4A8";
			selectedBackgroundColor = "#CC7F32";
			break;
		case "water":
			backgroundColor = "#A8C1FF";
			selectedBackgroundColor = "#6389CC";
			break;
		case "electric":
			backgroundColor = "#F8FFA8";
			selectedBackgroundColor = "#CCCC32";
			break;
		case "grass":
			backgroundColor = "#B2FFA8";
			selectedBackgroundColor = "#32CC32";
			break;
		case "ice":
			backgroundColor = "#A8FFEC";
			selectedBackgroundColor = "#32CCCC";
			break;
		case "fighting":
			backgroundColor = "#FFAEA8";
			selectedBackgroundColor = "#CC3232";
			break;
		case "poison":
			backgroundColor = "#F6A8FF";
			selectedBackgroundColor = "#CC32CC";
			break;
		case "ground":
			backgroundColor = "#FFECA8";
			selectedBackgroundColor = "#CCCC32";
			break;
		case "flying":
			backgroundColor = "#A8FFDC";
			selectedBackgroundColor = "#32CCCC";
			break;
		case "psychic":
			backgroundColor = "#FFA8DC";
			selectedBackgroundColor = "#CC32CC";
			break;
		case "bug":
			backgroundColor = "#A8FFAD";
			selectedBackgroundColor = "#32CC32";
			break;
		case "rock":
			backgroundColor = "#FFF2A8";
			selectedBackgroundColor = "#CCCC32";
			break;
		case "ghost":
			backgroundColor = "#FFA8EC";
			selectedBackgroundColor = "#CC32CC";
			break;
		case "dragon":
			backgroundColor = "#B9A8FF";
			selectedBackgroundColor = "#3232CC";
			break;
		case "dark":
			backgroundColor = "#B5B5B5";
			selectedBackgroundColor = "#323232";
			break;
		case "steel":
			backgroundColor = "#CACACA";
			selectedBackgroundColor = "#646464";
			break;
		case "fairy":
			backgroundColor = "#FEAEFB";
			selectedBackgroundColor = "#CC32CC";
			break;
		case "normal":
		default:
			backgroundColor = "#E8E8E8";
			selectedBackgroundColor = "#B2B2B2";
			break;
	}
	const className = isSelected ? "selected" : "";

	return (
		<div className={className} onClick={onClick}>
			<div
				className="border border-dark rounded p-2"
				style={{
					backgroundColor: isSelected
						? selectedBackgroundColor
						: backgroundColor,
					fontSize: "70%",
					margin: "0 0.5rem",
				}}
			>
				<div>Name: {move.moveName}</div>
				<div>Type: {move.typing}</div>
				<div className="d-flex flex-row justify-content-around flex-wrap">
					<div className="m-1">Accuracy:{move.accuracy}%</div>
					<div className="m-1">Power:{move.power}</div>
				</div>
			</div>
		</div>
	);
};

export default MoveDisplayBox;
