import { useState } from "react";
import SignInWindow from "../components/SignIn/SignInWindow";
import SignUpWindow from "../components/SignIn/SignUpWindow";

interface LoginProps {
	setUserToken: (userToken: { userId: string }) => void;
	setPage: React.Dispatch<React.SetStateAction<string>>;
	setUsername: (username: string) => void;
	setPassword: (password: string) => void;
}

const Login = ({
	setUserToken,
	setPage,
	setUsername: setUserName,
	setPassword,
}: LoginProps) => {
	const [window, setWindow] = useState("SignIn");
	return (
		<div
			className="container d-flex justify-content-center align-items-center"
			style={{ height: "100vh" }}
		>
			<div
				className="border border-dark rounded text-center p-2"
				style={{ backgroundColor: "lightgrey" }}
			>
				{window == "SignIn" && (
					<SignInWindow
						setUserToken={setUserToken}
						setWindow={setWindow}
						setPage={setPage}
						setUserName={setUserName}
						setPassword={setPassword}
					/>
				)}
				{window == "SignUp" && (
					<SignUpWindow
						setUserToken={setUserToken}
						setWindow={setWindow}
						setPage={setPage}
						setuserName={setUserName}
						setPassword={setPassword}
					/>
				)}
			</div>
		</div>
	);
};

export default Login;
