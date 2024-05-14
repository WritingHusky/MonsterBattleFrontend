import MonsterDisplayBox from "./MonsterDisplayBox";

interface MonsterDisplayWindowProps {
	battleInfo: battlefieldInfo;
	isSelected: (teamIndex: number, monsterIndex: number) => boolean;
	onClick: (teamIndex: number, monsterIndex: number) => void;
}

const MonsterDisplayWindow = ({
	battleInfo,
	isSelected,
	onClick,
}: MonsterDisplayWindowProps) => {
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
		<div
			className="d-flex flex-column-reverse justify-content-around"
			style={{ height: "50vh" }}
		>
			{/* ActiveMonsters */}
			{teamArray.map((team, teamIndex) => (
				<div
					className="team d-flex flex-row justify-content-around "
					key={teamIndex}
				>
					{teamIndex == 0 && "self ->"}
					{team.map((monster, monsterIndex) => (
						<MonsterDisplayBox
							monster={monster}
							key={monsterIndex}
							isSelected={isSelected(teamIndex, monsterIndex)}
							onClick={() => onClick(teamIndex, monsterIndex)}
						/>
					))}
					{teamIndex != 0 && "<- opponent"}
				</div>
			))}
		</div>
	);
};

export default MonsterDisplayWindow;
