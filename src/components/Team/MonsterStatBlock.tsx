import Monster from "./monster";

interface MonsterStatBlockProps {
	monster: Monster;
}

const MonsterStatBlock = ({ monster }: MonsterStatBlockProps) => {
	return (
		<div
			className="Monster-display-box m-3 rounded"
			data-monster-id={monster.dexId}
			style={{ backgroundColor: "white", border: "5px solid black" }}
		>
			<div className="Monster-Info-Box border d-flex flex-row">
				<div className="border w-25">
					DexId: {monster.dexId}
					<br />
					<br />
					Switching/Altering the Monsters on your team is not avalible at this
					time.
				</div>
				<div className="Monster-Info-Box-Inner w-75">
					<div className="Monster-Name">Name: {monster.name}</div>
					<div className="Stat-Table-Container d-flex flex-row">
						<table className="table">
							<colgroup>
								<col />
								<col style={{ minWidth: "1.1rem" }} />
								<col style={{ minWidth: "60px" }} />
							</colgroup>
							<tbody>
								<tr className="1">
									<th className="w-10">Hp:</th>
									<td style={{ width: "auto" }} className="stat">
										{monster.hp}
									</td>
									<td>
										<div className="progress">
											<div
												className="progress-bar bg-danger"
												role="progressbar"
												style={{ width: `${monster.hp}%` }}
											></div>
										</div>
									</td>
								</tr>
								<tr className="1">
									<th className="w-10">Atk:</th>
									<td style={{ width: "auto" }} className="stat">
										{monster.atk}
									</td>
									<td>
										<div className="progress">
											<div
												className="progress-bar bg-danger"
												role="progressbar"
												style={{ width: `${monster.atk}%` }}
											></div>
										</div>
									</td>
								</tr>
								<tr className="1">
									<th className="w-10">Def:</th>
									<td style={{ width: "auto" }} className="stat">
										{monster.def}
									</td>
									<td>
										<div className="progress">
											<div
												className="progress-bar bg-danger"
												role="progressbar"
												style={{ width: `${monster.def}%` }}
											></div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<table className="table">
							<colgroup>
								<col />
								<col style={{ minWidth: "1.1rem" }} />
								<col style={{ minWidth: "60px" }} />
							</colgroup>
							<tbody>
								<tr className="12">
									<th className="w-10">Spa:</th>
									<td style={{ width: "auto" }} className="stat">
										{monster.spa}
									</td>
									<td>
										<div className="progress">
											<div
												className="progress-bar bg-danger"
												role="progressbar"
												style={{ width: `${monster.spa}%` }}
											></div>
										</div>
									</td>
								</tr>
								<tr className="2">
									<th className="w-10">Spd:</th>
									<td style={{ width: "auto" }} className="stat">
										{monster.spd}
									</td>
									<td>
										<div className="progress">
											<div
												className="progress-bar bg-danger"
												role="progressbar"
												style={{ width: `${monster.spd}%` }}
											></div>
										</div>
									</td>
								</tr>
								<tr className="3">
									<th className="w-10">Speed:</th>
									<td style={{ width: "auto" }} className="stat">
										{monster.speed}
									</td>
									<td>
										<div className="progress">
											<div
												className="progress-bar bg-danger"
												role="progressbar"
												style={{ width: `${monster.speed}%` }}
											></div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="d-flex justify-content-between">
						<div className="Monster-Type">Type: {monster.type}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MonsterStatBlock;
