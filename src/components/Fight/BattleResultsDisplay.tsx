import MonsterDisplayWindow from "./MonsterDisplayWindow";

interface BattleResultsDisplayProps {
	battleInfo: battlefieldInfo;
}
const BattleResultsDisplay = ({ battleInfo }: BattleResultsDisplayProps) => {
	// Step 1: Figure out who won the battle

	// Convert the monsters to a 2D array of teams
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

	// Check if the player team has won
	let won = false;
	for (let index = 0; index < battleInfo.monInTeam; index++) {
		// If there is a monster that is not dead then the team has won
		if (!teamArray[0][index].isDead) {
			won = true;
			break;
		}
	}

	// Step 2: Display the results
	const result = (
		<>
			<MonsterDisplayWindow
				battleInfo={battleInfo}
				isSelected={() => false}
				onClick={() => {}}
			/>
		</>
	);
	return result;
};

export default BattleResultsDisplay;
