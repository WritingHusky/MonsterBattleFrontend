import { useState } from "react";
import axios from "axios";
import { SIGN_UP_URL } from "../../Constants";

interface SignUpProps {
	setUserToken: (UserToken: { userId: string }) => void;
	setWindow: React.Dispatch<React.SetStateAction<string>>;
	setPage: React.Dispatch<React.SetStateAction<string>>;
	setuserName: (username: string) => void;
	setPassword: (password: string) => void;
}

const SignUpWindow = ({
	setWindow,
	setUserToken,
	setPage,
	setuserName: setUserName,
	setPassword: setPassWord,
}: SignUpProps) => {
	const [loginUsername, setloginUsername] = useState("");
	const [password, setPassword] = useState("");
	const [valid, setValid] = useState("Valid");

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const username = loginUsername;
		await axios
			.post(SIGN_UP_URL, JSON.stringify({ username, password }), {
				headers: { "Content-Type": "application/json" },
			})
			.then((res) => {
				setUserToken(res.data);
				setUserName(loginUsername);
				setPassWord(password);
				setPage("Main");
			})
			.catch((error) => {
				if (error.response) {
					//If there is an error (status code > 2xx)
					if (error.response.status == 401) {
						//Handle the 401 (Unauthorized)
						setValid("UnAuth");
					} else if (error.response.status == 422) {
						setValid("Empty");
					} else if (error.response.status == 500) {
						//Handle the 500 & 422 Error (Something else went wrong)
						setValid("Internal");
						console.log(error.response.data);
					}
				} else if (error.request) {
					//If there is no response from the server
					if (error.message === "Network Error") {
						setValid("ConnectionRefused");
					}
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log("Error", error.message);
				}
			});
	};
	return (
		<>
			<h1>SignUp</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					{valid === "UnAuth" && (
						<p style={{ color: "red" }}>*Username already in use</p>
					)}
					{valid === "Internal" && (
						<p style={{ color: "gray" }}>
							*Something has Happend on the server
						</p>
					)}
					{valid === "Empty" && (
						<p style={{ color: "Red" }}>*Please Enter Values</p>
					)}
					{valid === "ConnectionRefused" && (
						<p style={{ color: "red" }}>*Cannot connect to the server</p>
					)}
					<label>
						<p>Username</p>
						<input
							type="text"
							onChange={(e) => setloginUsername(e.target.value)}
						/>
					</label>
				</div>
				<div className="form-group">
					<label>
						<p>Password</p>
						<input
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</label>
				</div>
				<div
					className="d-flex flex-row-reverse justify-content-between"
					style={{ marginTop: "10px" }}
				>
					<button className="btn btn-primary" type="submit">
						SignUp
					</button>
					<button
						className="btn btn-secondary"
						onClick={(event) => {
							event.preventDefault();
							setWindow("SignIn");
						}}
					>
						Back
					</button>
				</div>
			</form>
		</>
	);
};

export default SignUpWindow;
