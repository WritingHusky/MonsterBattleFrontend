import { useEffect } from "react";
import axios from "axios";
import useBatleId from "../useBattleId";
import useToken from "../SignIn/useToken";
import MonsterDisplayWindow from "./MonsterDisplayWindow";

interface BattleWaitDisplayProps {
	battleInfo: battlefieldInfo;
	setState: React.Dispatch<React.SetStateAction<string>>;
	state: string;
}

const BattleWaitDisplay = ({
	battleInfo,
	setState,
	state,
}: BattleWaitDisplayProps) => {
	const { getuserToken } = useToken();
	const { getBattleId } = useBatleId();

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

	//When the component is mounted begin a request to the server that waits for the opponent to make a move on an interval
	useEffect(() => {
		const userId = getuserToken();
		const battleId = getBattleId();

		const fetchData = async () => {
			try {
				const res = await axios.post(
					"http://localhost:8080/api/battle/inquire",
					JSON.stringify({ userId, battleId }),
					{
						headers: { "Content-Type": "application/json" },
					}
				);
				const info = res.data as String;
				if (res.status == 202) {
					switch (info) {
						case "TIP: Paused (Self)": // The user has a dead monster
						case "TIP: Paused": // The AI has a dead monster so we need to wait for the AI to make a move
							// Monster has died so we neeed change the display
							if (state != "Waiting Pasused") setState("Display");
							// Change the state to display if we have not been paused yet
							// Schedule the next run:
							else setTimeout(fetchData, 1000); // 1 second
							break;
						default:
							console.error("Unexpected Response from inquiry: (" + info + ")");
							break;
					}
				} else if (res.status == 200) {
					switch (info) {
						case "TIP: New":
						// console.log("New"); // Something has gone wrong
						case "TIP: Simulating":
						// console.log("Simulating");
						case "TIP: Waiting":
							// console.log("Waiting");
							// Schedule the next run:
							setTimeout(fetchData, 1000); // 1 second
							break;
						case "TIP: Resume":
						// The turn is ready to resume so we now go the display the turn info
						case "TIP: Complete":
							// console.log("Complete");
							// The turn is complete so we now go the display the turn info
							setState("Display");
							break;
						case "TIP: End":
							// console.log("End");
							setState("Results");
							break;
						default:
							console.error("Unexpected Response from inquiry: ", info);
							break;
					}
				} else {
					console.error("Unexpected Status from inquiry: ", res);
				}
			} catch (error: any) {
				console.log(error.response?.data || error.message);
			}
		};

		const timer = setTimeout(fetchData, 1000); // store the timer ID

		// Cleanup function:
		return () => clearTimeout(timer); // clear the timer
	}, []);

	return (
		<>
			<MonsterDisplayWindow
				battleInfo={battleInfo}
				isSelected={() => false}
				onClick={() => {}}
			/>
			{/* Waiting for Opponent Text */}
			<div
				className="border border-dark d-flex flex-row justify-content-center align-items-center"
				style={{ height: "30vh" }}
			>
				Waiting for opponent to make a move...
			</div>
		</>
	);
};

export default BattleWaitDisplay;
