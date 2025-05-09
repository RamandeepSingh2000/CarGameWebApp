// components/Leaderboard.jsx
import React from "react";
import { useQuery, gql } from "@apollo/client";
import "./leaderboard.css";

const GET_LEADERBOARD = gql`
	query GetLeaderboard {
		leaderboard {
			id
			username
			experiencePoints
			score
		}
	}
`;

function Leaderboard() {
	const { loading, error, data } = useQuery(GET_LEADERBOARD);

	if (loading) return <p className="leaderboard-loading">Loading...</p>;
	if (error) return <p className="leaderboard-error">Error: {error.message}</p>;

	console.log(data);

	return (
		<div className="leaderboard-container">
			<h3 className="leaderboard-title">Leaderboard</h3>
			<table className="leaderboard-table">
				<thead>
					<tr>
						<th className="leaderboard-header">Rank</th>
						<th className="leaderboard-header">Username</th>
						<th className="leaderboard-header">Score</th>
						<th className="leaderboard-header">XP</th>
					</tr>
				</thead>
				<tbody>
					{data.leaderboard.map((ranking, index) => (
						<tr
							key={ranking.id}
							className={`leaderboard-row rank-${index + 1}`}
						>
							<td className="leaderboard-cell">{index + 1}</td>
							<td className="leaderboard-cell">{ranking.username}</td>
							<td className="leaderboard-cell">{ranking.score}</td>
							<td className="leaderboard-cell">{ranking.experiencePoints}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Leaderboard;
