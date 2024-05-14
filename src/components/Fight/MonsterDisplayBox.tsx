interface MonsterDisplayBoxProp {
	monster: monsterInfo;
	isSelected: boolean | undefined;
	onClick: () => void;
}
const MonsterDisplayBox = ({
	monster,
	isSelected,
	onClick,
}: MonsterDisplayBoxProp) => {
	const healthNumber = parseFloat(
		((monster.currentHp / monster.maxHp) * 100).toFixed(1)
	); // Round to 1 decimal place
	const healthPercent = healthNumber + "%";

	var healthcolor;
	if (healthNumber > 50) healthcolor = "Green";
	else if (healthNumber > 25) healthcolor = "yellow";
	else healthcolor = "red";

	const backgroundColor = "#FFD4A8";
	const selectedBackgroundColor = "#CC7F32";

	return (
		<div
			className="info-box border border-dark rounded"
			style={{
				width: "25%",
				minWidth: "120px",
				minHeight: "100px",
				maxHeight: "250px",
				fontSize: "0.8rem",
				backgroundColor: isSelected ? selectedBackgroundColor : backgroundColor,
			}}
			onClick={onClick}
		>
			<div style={{ margin: "0", padding: "0" }}>
				<div
					style={{ fontSize: "min(1.2rem, 150%)", fontWeight: "bold" }}
					className="d-flex flex-row justify-content-center"
				>
					{monster.name}{" "}
					<div
						className="d-flex flex-column justify-content-end"
						style={{
							fontSize: "0.8rem",
							fontWeight: "normal",
						}}
					>
						{monster.slot}
					</div>
				</div>
				<div className="progress m-1">
					<div
						className="progress-bar"
						role="progressbar"
						style={{
							width: healthPercent,
							backgroundColor: healthcolor,
							textShadow: " 0px 0px 2px #000",
						}}
					>
						{healthPercent}
					</div>
				</div>
				<div className="d-flex flex-row justify-content-around ">
					<div>
						HP: {monster.currentHp}/{monster.maxHp}
					</div>
					<div>Level: {monster.level}</div>
					<div>Type: {monster.type}</div>
					<div>Status: {monster.status}</div>
				</div>
			</div>
		</div>
	);
};

export default MonsterDisplayBox;
