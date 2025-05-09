import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./achievements.css";

const GET_GAME_PROGRESS = gql`
	query GetGameProgress($userId: ID) {
		gameProgressByUserId(userId: $userId) {
			achievements
		}
	}
`;

function Achievements({ isLoggedIn, userData }) {
	const navigate = useNavigate();
	if (!isLoggedIn) navigate("/");

	const { loading, error, data } = useQuery(GET_GAME_PROGRESS, {
		skip: !isLoggedIn || !userData,
		variables: { userId: userData.id },
	});

	if (loading) return <p className="achievements-loading">Loading...</p>;
	if (error)
		return <p className="achievements-error">Error: {error.message}</p>;

	const gameProgress = data.gameProgressByUserId;
	console.log(gameProgress);
	if (gameProgress === null) {
		return <p className="achievements-none">No game progress found.</p>;
	}

	return (
		<div className="achievements-container">
			<h3 className="achievements-title">Your Achievements</h3>
			{gameProgress.achievements.length > 0 ? (
				<ul className="achievements-list">
					{gameProgress.achievements.map((achievement, index) => (
						<li key={index} className="achievement-item">
							<span className="achievement-text">{achievement}</span>
						</li>
					))}
				</ul>
			) : (
				<p className="achievements-none">No achievements yet. Start playing!</p>
			)}
		</div>
	);
}

export default Achievements;
