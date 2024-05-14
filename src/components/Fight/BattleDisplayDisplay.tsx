import { useEffect, useState } from "react";
import MonsterDisplayWindow from "./MonsterDisplayWindow";

interface BattleDisplayDisplayProps {
	battleInfo: battlefieldInfo;
	setBattleInfo: React.Dispatch<
		React.SetStateAction<battlefieldInfo | undefined>
	>;
	setState: React.Dispatch<React.SetStateAction<string>>;
}

const BattleDisplayDisplay = ({
	battleInfo,
	setBattleInfo,
	setState,
}: BattleDisplayDisplayProps) => {
	const [activeText, setActiveText] = useState<{
		slot: string;
		text: string;
	}>();
	const [activeElement, setActiveElement] = useState<DisplayElement>();
	const [activeElementIndex, setActiveElementIndex] = useState<number>();

	const displayQ = battleInfo.turnDisplayList.displayQ;
	// On load set the activeElement to the first element in the list
	// console.log(battleInfo);

	useEffect(() => {
		// console.log("Battle Reloading");
		if (battleInfo.turnDisplayList.displayQ[0] == undefined) {
			// console.log("Battle Display is empty");
		} else {
			setActiveElementIndex(0);
		}
	}, [battleInfo]);

	// When the activeElementIndex changes, update the activeElement
	useEffect(() => {
		if (activeElementIndex == undefined) {
			return;
		}
		if (displayQ[activeElementIndex] == undefined) {
			// console.log("Undefined DisplayQ at: ", activeElementIndex);
			if (activeElementIndex >= displayQ.length) {
				// console.log("End of DisplayQ");
				let newBattleInfo = battleInfo;
				newBattleInfo.turnDisplayList.displayQ = [];
				setState("Repeat");
				setBattleInfo(newBattleInfo);
			}
			return;
		}

		setActiveElement(displayQ[activeElementIndex]);
	}, [activeElementIndex]);

	// When the activeElement changes, run through the elements and display them
	useEffect(() => {
		if (activeElement == undefined) {
			return;
		}
		// console.log(activeElement);
		switch (activeElement.msgCode) {
			// One day this is where animations can be added / handled
			case 6: // Attack Hit
				handleNextInfo(4, true);
				break;
			case -1: // Attack Miss
				handleNextInfo(4, true);
				break;
			default:
				handleNextInfo(3, false);
				break;
		}
	}, [activeElement]);

	if (battleInfo.turnDisplayList.displayQ[0] == undefined) {
		// console.log("Battle Display is empty");
		return <div>Loading...</div>;
	}

	const handleNextInfo = (seconds: number, seperate: boolean) => {
		if (activeElement == undefined || activeElementIndex == undefined) {
			return;
		}
		if (!seperate) {
			setActiveText({
				text: activeElement.activationMsg + " " + activeElement.resultMsg,
				slot: activeElement.activationSlot,
			});
			setTimeout(() => {
				setActiveElementIndex(activeElementIndex + 1);
			}, 1000 * seconds);
		} else {
			setActiveText({
				text: activeElement.activationMsg,
				slot: activeElement.activationSlot,
			});
			setTimeout(() => {
				setActiveText({
					text: activeElement.resultMsg,
					slot: activeElement.resultSlot,
				});

				setTimeout(() => {
					setActiveElementIndex(activeElementIndex + 1);
				}, 1000 * seconds);
			}, 1000 * seconds);
		}
	};

	return (
		<>
			<div>
				<MonsterDisplayWindow
					battleInfo={battleInfo}
					isSelected={(teamIndex: number, monsterIndex: number) => {
						return (
							battleInfo.monsters[
								teamIndex * battleInfo.monInTeam + monsterIndex
							].slot == activeText?.slot
						);
					}}
					onClick={() => {}}
				/>
			</div>
			{/* Turn Display */}
			<div
				className="border border-dark d-flex flex-row justify-content-center align-items-center"
				style={{ height: "30vh" }}
			>
				{activeText?.text}
			</div>
			<button
				onClick={() => {
					setActiveElementIndex(displayQ.length);
				}}
			>
				Skip
			</button>
		</>
	);
};

export default BattleDisplayDisplay;
