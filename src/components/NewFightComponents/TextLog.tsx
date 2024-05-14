import axios from "axios";
import useBattleid from "../useBattleId";
import useToken from "../SignIn/useToken";
import { useEffect } from "react";

interface TextLogProps {}
const TextLog = ({}: TextLogProps) => {
	const { getuserToken } = useToken();
	const { getBattleId } = useBattleid();
	// Get the Log from the server
	useEffect(() => {
		const controller = new AbortController();
		getLog(controller).then((res) => {
			if (res) console.log(res);
		});

		return () => {
			controller.abort();
		};
	}, []);

	// Get the Log from the server
	const getLog = async (controller: AbortController) => {
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
				console.log(res.data); // Debugging to find the format of the data
				return res.data;
			})
			.catch((error) => {
				if (error.response) {
					console.error(error.response);
				}
			});
	};

	return <div className="border w-100"></div>;
};

export default TextLog;
