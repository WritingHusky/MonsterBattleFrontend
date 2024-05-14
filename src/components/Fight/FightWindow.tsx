import { useEffect, useState } from "react";
import MonsterDisplay from "./MonsterDisplay";
import axios from "axios";
import BattleWaitDisplay from "./BattleWaitDisplay";
import BattleDisplayDisplay from "./BattleDisplayDisplay";
import BattleResultsDisplay from "./BattleResultsDisplay";
import MonsterChoiceWindow from "./MonsterChoiceWindow";

interface FightWindowProps {
	userId: any;
	battleId: any;
}

const FightWindow = ({ userId, battleId }: FightWindowProps) => {
	const [battlefieldInfo, setBattlefieldInfo] = useState<battlefieldInfo>();
	const [state, setState] = useState("Empty");
	/*
    Fight logic here
  */
	// If the state is set to Display, then request the battle info from the server
	useEffect(() => {
		if (state == "Display") {
			requestTIP();
		}
	}, [state]);

	// Request the TIP from the server
	const requestTIP = async () => {
		return await axios
			.post(
				"http://localhost:8080/api/battle/retrieveTIP",
				JSON.stringify({ userId, battleId }),
				{ headers: { "Content-Type": "application/json" } }
			)
			.then((res) => {
				// res = JSON.parse(res.data);
				// console.log(res.data);
				const data = res.data as battlefieldInfo;
				// console.log("data: ", data);
				setBattlefieldInfo(data);
			}) //If every thing is good
			// Looking to recieve a JSON object of the format: { "userID": "..."}
			.catch((error) => {
				if (error.response) {
					console.error(error.response);
					//If there is an error (status code > 2xx)
					if (error.response.status == 401) {
						//Handle the 401 (Unauthorized)
					}
				}
			});
	};

	useEffect(() => {
		if (state == "Empty") {
			requestTIP();
			setState("Ready");
		} else if (state == "Repeat") {
			requestTIP();
			// When the state is set to Repeat, send the user to the correct state based on the battlefieldInfo.state
			switch (battlefieldInfo?.state) {
				case "Complete":
					setState("Ready");
					break;
				case "Resume":
					setState("Waiting");
					break;
				case "Paused":
					// Check if the user is the one who paused the game
					for (let i = 0; i < battlefieldInfo.activeMon; i++) {
						// If the user has a dead monster, they need to choose a new one
						if (battlefieldInfo.monsters[i].isDead) {
							setState("MonsterChoice");
							return;
						}
					}
					// If the user has no dead monsters, they need to wait for the opponent to make a choice
					setState("Waiting Pasused");
					break;
				case "Waiting":
				case "Simulating":
					setState("Waiting");
					break;
				case "End":
					setState("Results");
					break;
				default:
					console.error(
						"Unexpected Response from inquiry: ",
						battlefieldInfo?.state
					);
					break;
			}
		} else if (state == "Display") {
			requestTIP();
		}
	}, [state]);

	if (battlefieldInfo == undefined || state == "Repeat") {
		return <div>Loading...</div>; //TODO Build out a loading version of the MonsterDisplayWindow
	}

	return (
		<>
			{/* Where MoveChoice is made */}
			{state == "Ready" && (
				<MonsterDisplay battleInfo={battlefieldInfo} setState={setState} />
			)}
			{/* Default loading //TODO ? Prerender the monsterDisplay Window ? */}
			{state == "Empty" && <h1>Loading...</h1>}
			{/* Waiting for the opponent to make a move */}
			{(state == "Waiting" || state == "Waiting Pasused") && (
				<BattleWaitDisplay
					battleInfo={battlefieldInfo}
					setState={setState}
					state={state}
				/>
			)}
			{/* Display the results of the turn */}
			{state == "Display" && (
				<BattleDisplayDisplay
					battleInfo={battlefieldInfo}
					setBattleInfo={setBattlefieldInfo}
					setState={setState}
				/>
			)}
			{state == "Results" && (
				<BattleResultsDisplay battleInfo={battlefieldInfo} />
			)}
			{state == "MonsterChoice" && (
				<MonsterChoiceWindow battleInfo={battlefieldInfo} setState={setState} />
			)}
		</>
	);
};

export default FightWindow;
