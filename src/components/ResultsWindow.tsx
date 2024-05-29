import MonsterDisplayBox from "./Fight/MonsterDisplayBox";
import BattleField from "./Fight/BattleField";
import TextLog from "./Fight/TextLog";
import useBattleid from "./useBattleId";
import useToken from "./SignIn/useToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { RETRIEVE_TIP_URL } from "../Constants";

interface ResultsWindowProps {
	setPage: React.Dispatch<React.SetStateAction<string>>;
}

const ResultsWindow = ({ setPage }: ResultsWindowProps) => {
	const [battleInfo, setBattleInfo] = useState<battlefieldInfo | undefined>();
	const [moduleWindow, setModuleWindow] = useState(true);

	const { getuserToken } = useToken();
	const { getBattleId } = useBattleid();

	useEffect(() => {
		const controller = new AbortController();
		requestTIP(controller).then((data) => {
			if (data != undefined) setBattleInfo(data);
		});
		return () => controller.abort();
	}, []);

	const requestTIP = async (controller: AbortController) => {
		const userId = getuserToken();
		const battleId = getBattleId();

		return await axios
			.post(RETRIEVE_TIP_URL, JSON.stringify({ userId, battleId }), {
				headers: { "Content-Type": "application/json" },
				signal: controller.signal,
			})
			.then((res) => {
				return res.data as battlefieldInfo;
			})
			.catch((error) => {
				if (error.response) {
					console.error(error.response);
				}
			});
	};

	if (battleInfo == undefined) return <div>Loading...</div>; // TODO: Add a better loading state
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

	// Check if the player won
	let winner = false;
	// Check if any of the player's monsters are alive therefore the player won
	for (let i = 0; i < battleInfo.monInTeam; i++) {
		if (!battleInfo.monsters[i].isDead) {
			winner = true;
			break;
		}
	}

	return (
		<>
			<div className="d-flex flex-row">
				<div style={{ width: "140%" }}>
					<BattleField battleInfo={battleInfo} background="">
						<div
							className="d-flex flex-column-reverse justify-content-around"
							style={{ height: "55vh" }}
						>
							{/* ActiveMonsters */}
							{teamArray.map((team, teamIndex) => (
								<div
									className="team d-flex flex-row justify-content-around"
									key={teamIndex}
								>
									{teamIndex == 0 && "self ->"}
									{team.map((monster, monsterIndex) => (
										<MonsterDisplayBox
											monster={monster}
											isValid={true}
											key={monsterIndex}
											isSelected={false}
											onClick={() => {}}
										/>
									))}
									{teamIndex != 0 && "<- opponent"}
								</div>
							))}
						</div>
					</BattleField>
					<div
						className="border d-flex flex-column justify-content-center align-items-center gap-2"
						style={{ height: "35vh" }}
					>
						Battle is over
						<button
							onClick={() => {
								setModuleWindow(!moduleWindow);
							}}
							id="closeBtn"
							className="btn btn-secondary"
						>
							Show results
						</button>
					</div>
				</div>
				<TextLog battleInfo={battleInfo} />
			</div>
			<style>.module-window {}</style>
			<div
				id="moduleWindow"
				className="module-window"
				style={{
					display: moduleWindow ? "block" : "none",
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "400px",
					maxWidth: "90%",
					backgroundColor: "#fff",
					border: "1px solid #ccc",
					borderRadius: "5px",
					boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
					padding: "20px",
					zIndex: "9999",
				}}
			>
				<h2>Results:</h2>
				<div>Turn Count: {battleInfo.turnCount}</div>
				<div>{winner ? "You won!" : "You lost"}</div>
				<div className="d-flex flex-row justify-content-between">
					<button
						onClick={() => {
							setModuleWindow(!moduleWindow);
						}}
						id="closeBtn"
						className="btn btn-secondary"
					>
						Close
					</button>
					<button
						onClick={() => {
							setPage("Main");
						}}
						id="HomeBtn"
						className="btn btn-secondary"
					>
						Done
					</button>
				</div>
			</div>
		</>
	);
};

export default ResultsWindow;
