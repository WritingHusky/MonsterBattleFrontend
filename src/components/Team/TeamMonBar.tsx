import axios from "axios";
import { useEffect, useState } from "react";
import MonsterStatBlock from "./MonsterStatBlock";
import Monster from "./monster";
import { RETRIEVE_URL } from "../../Constants";

/* 
Things to display:
- DexId
- Stats:
    - Hp
    - Atk
    - Def
    - SpA
    - SpD
    - Speed
- Moves:
*/
interface MonBarProps {
	dexId: number;
	updateTeam: (e: React.FormEvent) => Promise<void>;
}
// I hope this page doesn't re-render to many times
const TeamMonBar = ({ dexId }: MonBarProps) => {
	const [monster, setMonster] = useState<Monster>();
	var isSet = false;

	// The method to update the infomation about a monster
	const retreiveMonInfo = async () => {
		await axios
			.post(RETRIEVE_URL, JSON.stringify({ dexId }), {
				headers: { "Content-Type": "application/json" },
			})
			.then((res) => {
				// console.log(res.data);
				setMonster(res.data);
				isSet = true;
			})
			.catch((error) => {
				if (error.response) {
					console.error(error.response);
					//If there is an error (status code > 2xx)
					if (error.response.status == 401) {
						//Handle the 401 (Unauthorized)
					} else if (
						error.response.status == 500 ||
						error.response.status == 422
					) {
						//Handle the 500 & 422 Error (Something else went wrong)
						console.log(error.response.data);
					}
				}
			});
	};
	useEffect(() => {
		// console.log("Monster loading: " + dexId);
		retreiveMonInfo();
	}, []);

	// When this loads get the information
	return (
		<>
			{monster ? (
				<>
					<MonsterStatBlock monster={monster} />
					{/* <button onClick={updateTeam}>Change Monster</button> */}
				</>
			) : (
				<>asdf</>
			)}
		</>
	);
};

export default TeamMonBar;
