import axios from "axios";
import useBattleid from "../useBattleId";
import useToken from "../SignIn/useToken";
import { useEffect, useRef, useState } from "react";

interface TextLogProps {
	battleInfo: battlefieldInfo;
}

const TextLog = ({ battleInfo }: TextLogProps) => {
	const { getuserToken } = useToken();
	const { getBattleId } = useBattleid();

	const [log, setLog] = useState<TurnLogEntry[]>();
	const [logLength, setLogLength] = useState<number>(0);
	const logContainerRef = useRef<HTMLDivElement>(null);

	// Get the Log from the server, when the component is mounted and when the battleInfo changes
	useEffect(() => {
		const controller = new AbortController();
		getLog(controller).then((res) => {
			if (res) {
				setLog(res);
			}
		});

		return () => {
			controller.abort();
		};
	}, [battleInfo]);

	useEffect(() => {
		if (logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
		}
	}, [log]);

	// Get the Log from the server
	const getLog = async (controller: AbortController) => {
		// Get the userId and battleId
		const userId = getuserToken();
		const battleId = getBattleId();

		return await axios
			.post(
				"http://localhost:8080/api/battle/getLog",
				JSON.stringify({ userId, battleId }),
				{
					headers: { "Content-Type": "application/json" },
					signal: controller.signal,
				}
			)
			.then((res) => {
				// Log the entire response data
				// console.log("Response data: ", res.data);

				// Log the TurnLog property of the response data
				// console.log("TurnLog: ", res.data.TurnLog);

				// Convert the data to a TurnDisplayElement[]
				return res.data.TurnLog as TurnLogEntry[];
			})
			.catch((error) => {
				if (error.name === "CanceledError") {
					// The request was canceled so do nothing
					return undefined;
				}
				if (error.response) {
					console.error("Error response: ", error);
				} else if (error.request) {
					console.error("Error request: ", error);
				} else {
					console.error("Error message: ", error);
				}
				console.error("Error config: ", error);
				return undefined;
			});
	};

	if (log == undefined) {
		return <div>Loading...</div>;
	}

	return (
		<div
			ref={logContainerRef}
			className="border w-100 d-flex flex-column p-2"
			style={{
				fontSize: "0.85rem",
				textAlign: "left",
				overflowY: "scroll",
				maxHeight: "90vh",
			}}
		>
			{log &&
				log.map((entry, index) => {
					// console.log(entry);
					switch (entry.messageType) {
						case "Turn Header":
							return (
								<div
									className="border-bottom border-secondary"
									style={{ marginTop: "0.5rem" }}
									key={index}
								>
									{entry.message}
								</div>
							);
						case "Message Header":
						case "Context Header":
						case "Move Header":
							return (
								<div key={index}>
									<br />
									{entry.message}
								</div>
							);
						case "Context":
						case "Message":
						case "Effect":
							return <div key={index}>&emsp;- {entry.message}</div>;

						case "Error":
							return (
								<div key={index} style={{ color: "red" }}>
									{entry.message}
								</div>
							);
						// When the message is none do nothing //TODO: remove this case in the clean up phase
						case "None":
							return;
						default:
							return (
								<div key={index}>
									{""}
									{entry.messageType} + {entry.message}
								</div>
							);
					}
				})}
		</div>
	);
};

export default TextLog;
