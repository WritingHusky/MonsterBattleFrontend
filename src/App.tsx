import Login from "./Pages/Login";
import BattlePage from "./Pages/BattlePage";
import MainPage from "./Pages/MainPage";
import TeamBuilderPage from "./Pages/TeamBuilderPage";
import useToken from "./components/SignIn/useToken";
import { useEffect, useState } from "react";
import ErrorPage from "./Pages/ErrorPage";
import handleLogOut from "./components/handleLogOut";
import useUsername from "./components/SignIn/useUsername";
import usePassword from "./components/SignIn/usePassword";
import heart from "./components/heart";

function App() {
	const { setUserToken, removeUserToken, getuserToken } = useToken();
	const [page, setPage] = useState("None");

	const { setUsername, removeUsername, getUsername } = useUsername();
	const { setPassword, removePassword, getPassword } = usePassword();
	const { startConnectBeating, checkConnectHeartBeating, halt } = heart();

	const login = (
		<Login
			setUserToken={setUserToken}
			setPage={setPage}
			setUsername={setUsername}
			setPassword={setPassword}
		/>
	);

	// If the user has no token then get them to sign in
	const userToken = getuserToken();
	if (!userToken) {
		return login;
	}

	//Check if userId is valid
	//  If ping fails send them to the login
	const username = getUsername();
	const password = getPassword();

	//Start heart beat
	if (!checkConnectHeartBeating()) {
		startConnectBeating(userToken);
	}

	//Now the user has a team and so send them to the main page
	switch (page) {
		case "Login":
			halt();
			return login;
		case "None": // In this case the users has a token but has not got a page to switch to
		case "Main":
			return <MainPage setPage={setPage} />;
		case "Team":
			return <TeamBuilderPage setPage={setPage} username={username} />;
		case "Battle":
			return <BattlePage setPage={setPage} />;
		case "LogOut":
			halt();
			handleLogOut({ username, password, setPage });
			removeUserToken();
			removeUsername();
			removePassword();
			return login;
		default:
			//SomeThing went wrong
			return <ErrorPage page={page} />;
	}

	// Add handling for exiting the app
}

export default App;
