import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { PING_BATTLE_URL, PING_CONNECT_URL } from "../Constants";
import useToken from "./SignIn/useToken";
/*
This is the component that will handle the heart beat between the user and the server
The 
*/
const heart = (setPage: React.Dispatch<React.SetStateAction<string>>) => {
	// Timer IDs
	const heartbeatConnectId = useRef<number | null>(null);
	const heartbeatBatttleId = useRef<number | null>(null);

	const [connectRunning, setConnectRunning] = useState(false);
	const [battleRunning, setBattleRunning] = useState(false);

	const [userId, setUserId] = useState<string>("");
	const [battleId, setBattleId] = useState<string>("");

	const { removeUserToken } = useToken();

	// Constant to turn off the heart beat if needed
	const running = true;

	// Time between heartbeats (in seconds)
	const connectTime = 60;
	const battleTime = 30;

	useEffect(() => {
		return () => {
			stopConnectBeating();
			stopBattleBeating();
		};
	}, []);

	useEffect(() => {
		if (connectRunning) {
			heartbeatConnectId.current = window.setInterval(
				sendPingToConnect,
				1000 * connectTime
			);
		} else {
			if (heartbeatConnectId.current) {
				// console.log("Clearing Connect Interval");
				window.clearInterval(heartbeatConnectId.current);
				heartbeatConnectId.current = null;
			} else {
				// console.log("No Connect Interval to clear");
			}
		}
	}, [connectRunning]);

	useEffect(() => {
		if (battleRunning) {
			heartbeatBatttleId.current = window.setInterval(
				sendPingToBattle,
				1000 * battleTime
			);
		} else {
			if (heartbeatBatttleId.current) {
				// console.log("Clearing Battle Interval");
				window.clearInterval(heartbeatBatttleId.current);
				heartbeatBatttleId.current = null;
			} else {
				// console.log("No Battle Interval to clear");
			}
		}
	}, [battleRunning]);

	const startConnectBeating = (new_userId: string) => {
		setUserId(new_userId);
		setConnectRunning(true);
	};

	const checkConnectHeartBeating = () => {
		if (!running) {
			// console.log("Heart beat stopped");
			return false;
		}
		return heartbeatConnectId ? true : false;
	};

	const stopConnectBeating = () => {
		if (!running) {
			// console.log("Heart beat stopped");
			return;
		} else if (!heartbeatConnectId) {
			// console.log("No Connect Interval ID to clear");
			return;
		}
		// console.log("Stopping Connect Beating", heartbeatConnectId.current);
		setConnectRunning(false);
	};

	// Send A ping to the battle controller every one second
	const startBattleBeating = (new_battleId: string, new_userId: string) => {
		if (!running) {
			// console.log("Heart beat stopped");
			return;
		}
		setBattleId(new_battleId);
		setUserId(new_userId);

		setBattleRunning(true);
	};

	const stopBattleBeating = () => {
		if (!running) {
			// console.log("Heart beat stopped");
			return;
		} else if (!heartbeatBatttleId) {
			// console.log("No Battle Interval ID to clear");
			return;
		}
		// console.log("Stopping Battle Beating", heartbeatBatttleId.current);
		setBattleRunning(false);
	};

	const halt = () => {
		removeUserToken();
		// console.log("Halting");
		stopBattleBeating();
		stopConnectBeating();
	};

	const sendPingToConnect = async () => {
		// If the heartbeat is not running then do nothing
		if (!heartbeatConnectId.current) {
			// console.log("Heart beat stopped for connect (sendPingToConnect)");
			return;
		}
		await axios
			.post(PING_CONNECT_URL, JSON.stringify({ userId }), {
				headers: { "Content-Type": "application/json" },
			})
			.then(() => {
				// console.log("Connect Ping: ", res.data); // Debugging
			})
			.catch((error) => {
				//If there is an error (status code > 2xx)
				if (error.response) {
					if (error.response.status == 422) {
						// Empty input
						halt();
						// This means that the ping is not valid
						// Therefore the user must be logged out
						setPage("Login");
					} else if (error.response.status == 401) {
						// Unauthorized

						halt();
						// This means that the user is no longer connected to the API
						// Therefore they but be logged out
						setPage("Login");
					} else if (error.response.status == 500) {
						// Something else went wrong (500)
						console.log("Internal Server Error: ", error.response.data);
					} else {
						// Something else went wrong
						console.error("Error in response status", error.response);
					}
				} else if (error.request) {
					//If there is no response from the server
					if (error.message.includes("Network Error")) {
						halt();
						// console.log("Network Error");
						// setTimeout(() => {}, 1000);
						// console.log("Removing");
						setPage("Login");
					}
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log("Error", error.message);
				}
			});
	};

	const sendPingToBattle = async () => {
		// console.log("Pinging Battle User: ", userId, " Battle: ", battleId);
		await axios
			.post(PING_BATTLE_URL, JSON.stringify({ userId, battleId }), {
				headers: { "Content-Type": "application/json" },
			})
			.then((res) => {
				if (res.status == 200) {
					// console.log("Battle Ping: ", res.data); // Debugging
				} else if (res.status == 202) {
					// There is no battle to ping
					halt();
					// This means that the ping is not valid
					// Therefore the user must sent back to the main page
					setPage("Main");
				}
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status == 422) {
						// Unprocessable Entity
						stopBattleBeating();
						// This means that the ping is not valid
						// Therefore the user must be logged out of the battle
						setPage("Main");
					} else if (error.response.status == 400) {
						// Bad Request // Wrong battleId
						stopBattleBeating();
						// This means that the ping is not valid
						// Therefore the user must be logged out of the battle
						setPage("Main");
					} else if (error.response.status == 401) {
						// Unauthorized // Not possible
					} else if (error.response.status == 500) {
						// Something else went wrong with the server
						console.log("Error in the server: ", error.response.data);
						// Therefore the user must be logged out of the battle
						stopBattleBeating();
						setPage("Main");
					}
				} else if (error.request) {
					//If there is no response from the server
					if (error.message === "Network Error") {
						// The user is no longer connected to the server so they must be logged out
						halt();
						setPage("Login");
					}
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log("Error", error.message);
				}
			});
	};

	return {
		startConnectBeating,
		checkConnectHeartBeating,
		stopConnectBeating,
		halt,
		startBattleBeating,
		stopBattleBeating,
	};
};

export default heart;
