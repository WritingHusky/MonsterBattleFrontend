import { useState } from "react";
import NavBar from "../components/NavBar";
import SetUpWindow from "../components/Fight/SetUpWindow";
import FightWindow from "../components/Fight/FightWindow";
import BattleId from "../components/useBattleId";
import useToken from "../components/SignIn/useToken";
import NewFightWindow from "../components/NewFightComponents/NewFightWindow";

interface BattlerProps {
	setPage: React.Dispatch<React.SetStateAction<string>>;
}
/*
Order:
- Build out the battle
- Build Battle in API server
- Begin battle
  - Get all relevent info
    - All of users mons and opponents monsters
*/

const BattlePage = ({ setPage: setPage }: BattlerProps) => {
	//Get them to pick an opponent
	const [window, setWindow] = useState("Setup");
	const { getBattleId } = BattleId();
	const { getuserToken } = useToken();

	// List of information that is need to build match

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
			{window == "Setup" && <SetUpWindow setWindow={setWindow} />}
			{window == "Fight" && <NewFightWindow setWindow={setWindow} />}
			{/* {window == "Fight" && (
				<FightWindow userId={getuserToken()} battleId={getBattleId()} />
			)} */}
			{window == "Results" && <div>Results</div>}
		</>
	);
};

export default BattlePage;
