import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SetUpWindow from "../components/Fight/SetUpWindow";
import FightWindow from "../components/Fight/FightWindow";
import ResultsWindow from "../components/ResultsWindow";

interface BattlePageProps {
	setPage: React.Dispatch<React.SetStateAction<string>>;
	halt: () => void;
	startBattleBeating: (new_battleId: string, new_userId: string) => void;
}
/*
Order:
- Build out the battle
- Build Battle in API server
- Begin battle
  - Get all relevent info
    - All of users mons and opponents monsters
*/

const BattlePage = ({ setPage, halt, startBattleBeating }: BattlePageProps) => {
	//Get them to pick an opponent
	const [window, setWindow] = useState("Setup");
	// List of information that is need to build match

	useEffect(() => {
		// If the user is on the results page, stop the heart beat
		if (window == "Results") {
			halt();
		}
	}, [window]);

	/* 
  Sub Pages / components:
  - SetUp
  - Mid Battle
  - Results
  */
	return (
		<>
			<NavBar setPage={setPage} pages={["LogOut", "Main", "Team"]} />
			{/* Change the window as needed for setup */}
			{window == "Setup" && (
				<SetUpWindow
					setWindow={setWindow}
					startBattleBeating={startBattleBeating}
				/>
			)}
			{window == "Fight" && <FightWindow setWindow={setWindow} />}
			{/* {window == "Fight" && (
				<FightWindow userId={getuserToken()} battleId={getBattleId()} />
			)} */}
			{window == "Results" && <ResultsWindow setPage={setPage} />}
		</>
	);
};

export default BattlePage;
