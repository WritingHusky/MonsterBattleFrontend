import axios from "axios";
import NavBar from "../components/NavBar";
import BattleId from "../components/useBattleId";
import useToken from "../components/SignIn/useToken";
import { REMOVE_URL } from "../Constants";

interface MainPageProps {
	setPage: React.Dispatch<React.SetStateAction<string>>;
}

const MainPage = ({ setPage }: MainPageProps) => {
	const { getBattleId, removeBattleId } = BattleId();
	const { getuserToken } = useToken();
	//Have the choice of altering team or begining battle
	//Send them to either page

	const battleId = getBattleId();
	if (battleId) {
		// console.log("Removing Battle");
		const userId = getuserToken();
		const battleId = getBattleId();
		axios
			.post(REMOVE_URL, JSON.stringify({ userId, battleId }), {
				headers: { "Content-Type": "application/json" },
			})
			.then(() => {
				// console.log("Battle Removed");
			})
			.catch((error) => {
				console.error(error.response);
				if (error.response.status == 401) {
					//Handle the 401 (Unauthorized)
				}
			});
		removeBattleId();
	}

	//TODO Only show begin battle button if the user has a team
	return (
		<>
			<NavBar setPage={setPage} pages={["LogOut"]} />
			<div className="container">
				<div
					className="d-flex flex-column justify-content-center"
					style={{ height: "90vh" }}
				>
					<div
						className="d-flex flex-row justify-content-around"
						style={{
							width: "50%",
							position: "relative",
							left: "25%",
						}}
					>
						<button
							onClick={() => {
								setPage("Team");
							}}
							className="btn btn-outline-dark"
						>
							Edit Teams
						</button>
						<button
							onClick={() => {
								setPage("Battle");
							}}
							className="btn btn-outline-dark"
						>
							Start Battle
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default MainPage;
