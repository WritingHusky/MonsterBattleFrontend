import { useState } from "react";
import MonsterDisplayWindow from "./MonsterDisplayWindow";

interface MonsterChoiceWindowProps {
	battleInfo: battlefieldInfo;
	setState: React.Dispatch<React.SetStateAction<string>>;
}
const MonsterChoiceWindow = ({
	battleInfo,
	setState,
}: MonsterChoiceWindowProps) => {
	const [activeMonster, setActiveMonster] = useState<number>();
	const [pickedMonsters, setPickedMonsters] = useState<number[]>([]);

	const isSelected = (teamIndex: number, monsterIndex: number) => {
		// If the monster is selected, return true
		if (activeMonster == monsterIndex && teamIndex == 0) {
			return true;
		} else {
			return false;
		}
	};

	const handleClickedMonster = (teamIndex: number, monsterIndex: number) => {
		// When the monster is clicked, set the active monster if it is on team 0 and is dead
		if (teamIndex == 0 && battleInfo.monsters[monsterIndex].isDead == true) {
			if (activeMonster === monsterIndex) {
				setActiveMonster(undefined);
			} else {
				setActiveMonster(monsterIndex);
			}
		}
	};

	return (
		<>
			{/* Active Monsters */}
			<MonsterDisplayWindow
				battleInfo={battleInfo}
				isSelected={isSelected}
				onClick={handleClickedMonster}
			/>
			{/*  */}
		</>
	);
};

export default MonsterChoiceWindow;
