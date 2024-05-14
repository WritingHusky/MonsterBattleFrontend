import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import TeamMonBar from "../components/Team/TeamMonBar";
import axios from "axios";

interface teamBuilderProps {
	setPage: React.Dispatch<React.SetStateAction<string>>;
	username: string;
}

/*
Things this needs to do:
- try to request the team information
  - if it fails create a team
  - Then request and get an empty team (maybe defaults?)
- Allow for editing of teams
  - send team data back to the server for validation and storage

Team displayed by sending the data for each mon into a 
*/

const TeamBuilder = ({
	setPage: setPage,
	username: username,
}: teamBuilderProps) => {
	// Get the team info
	const [team, setTeam] = useState<number[]>([]);
	const [monCount, setMonCount] = useState(0);

	const handleCreateNewTeam = async () => {
		await axios
			.post(
				"http://localhost:8080/api/team/create",
				{ username: username },
				{
					headers: { "Content-Type": "application/json" },
				}
			)
			.then((res) => {
				console.log("create data: " + res.data);
				setTeam(res.data.Monster);
			})
			.catch((error) => {
				if (!error.response) {
					return;
				}
				if (error.response.status === 401) {
					console.log(
						"Team is already created. This should only be reachable if the team doesn't exist"
					);
				} else {
					console.log(error.response?.data || error.message);
				}
			});
	};

	const requestData = async () => {
		await axios
			.post(
				"http://localhost:8080/api/team/request",
				{ username: username }, // Pass just the inner object
				{
					headers: { "Content-Type": "application/json" },
				}
			)
			.then((res) => {
				setTeam(res.data.Monsters);
			})
			.catch(async (error) => {
				if (!error.response) {
					return;
				}
				if (error.response.status === 401) {
					// Unauthorized error. Team has already been created
					await handleCreateNewTeam();
				} else {
					console.error(error.response?.data || error.message);
				}
			});
	};

	const updateTeam = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = { username, team };
		// Must build out team
		await axios
			.post("http://localhost:8080/api/team/update", JSON.stringify(data), {
				headers: { "Content-Type": "application/json" },
			})
			.then((res) => {
				console.log("Update post:" + res.data);
				setTeam(res.data);
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status === 401) {
					} else {
						console.error(error.response?.data || error.message);
					}
				}
			});
	};

	//Get the moncount when the builder page mounts
	useEffect(() => {
		requestData();
		// Must build out team
		axios
			.get("http://localhost:8080/api/monster/count", {
				headers: { "Content-Type": "application/json" },
			})
			.then((res) => {
				// Might want to chagne this as this happens every reload
				setMonCount(res.data);
			})
			.catch((error) => {
				if (error.response) {
					console.log(error.response?.data || error.message);
				}
			});
	}, []);
	// team ? console.log(1) : console.log(2); // Debugging
	return (
		<div>
			<NavBar setPage={setPage} pages={["LogOut", "Main", "Battle"]} />
			<ol>
				{team ? (
					// Test if this reloads the whole team when one thing changes
					team.map((monster, index) => (
						<li key={index}>
							<TeamMonBar dexId={monster} updateTeam={updateTeam} />
							<button className="btn" id={"Update-Monster-" + index}></button>
						</li>
					))
				) : (
					<p>
						Team loading: If team doesn't load soon make sure that the server is
						running
					</p>
				)}
			</ol>
			<p style={{ marginLeft: "20px" }}>
				Total mon in database: {monCount.toString()}
			</p>
		</div>
	);
};

export default TeamBuilder;
