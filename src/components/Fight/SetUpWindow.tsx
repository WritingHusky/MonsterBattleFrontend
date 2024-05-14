import { useEffect, useState } from "react";
import OppnentPage from "./OppnentPage";
import RulesPage from "./RulesPage";
import axios from "axios";
import useToken from "../SignIn/useToken";
import heart from "../heart";
import BattleId from "../useBattleId";
import username from "../SignIn/useUsername";

interface SetUpWindowProps {
	setWindow: React.Dispatch<React.SetStateAction<string>>;
}

const SetUpWindow = ({ setWindow }: SetUpWindowProps) => {
	const { startBattleBeating } = heart();
	const { getuserToken } = useToken();
	const [view, setView] = useState("Opp");
	const [opponent, setOpponent] = useState("Default");
	const [rules, setRules] = useState<Rules>();
	const { setBattleId } = BattleId();
	const { getUsername } = username();

	const handleSetup = async () => {
		const userId = getuserToken();
		const username = getUsername();
		await axios
			.post(
				"http://localhost:8080/api/battle/connect",
				JSON.stringify({ userId, opponent, rules, username }),
				{ headers: { "Content-Type": "application/json" } }
			)
			.then((res) => {
				// console.log(res.data);

				startBattleBeating(res.data);
				setBattleId(res.data);
				setWindow("Fight");
			}) //If every thing is good
			// Looking to recieve a JSON object of the format: { "userID": "..."}
			.catch((error) => {
				if (error.response) {
					console.error(error);
					//If there is an error (status code > 2xx)
					if (error.response.status == 401) {
						//Handle the 401 (Unauthorized)
					} else if (error.response.status == 422) {
					} else if (error.response.status == 500) {
						//Handle the 500 & 422 Error (Something else went wrong)
						console.error(error.response.data); // Remove to clear console
					}
				}
			});
	};

	useEffect(() => {
		if (view == "SetUp") {
			handleSetup();
		}
	}, [view]);

	return (
		<>
			{/* Change the window as needed for setup */}
			{view == "Opp" && (
				<OppnentPage setWindow={setView} setOpponent={setOpponent} />
			)}
			{view == "Rules" && <RulesPage setWindow={setView} setRules={setRules} />}
			{view == "SetUp" && (
				<div>
					Match Is Being Set up. <br />
					This should not take long
				</div>
				// TODO: Add a better loading screen
			)}
		</>
	);
};

export default SetUpWindow;
