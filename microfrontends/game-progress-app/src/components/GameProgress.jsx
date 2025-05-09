// components/GameProgress.jsx
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./gameProgress.css";

const GET_GAME_PROGRESS = gql`
	query GetGameProgress($userId: ID) {
		gameProgressByUserId(userId: $userId) {
			id
			userId
			experiencePoints
			score
			progress
			lastPlayed
		}
	}
`;

function GameProgress({ isLoggedIn, userData }) {
	const { loading, error, data } = useQuery(GET_GAME_PROGRESS, {
		skip: !isLoggedIn || !userData,
		variables: { userId: userData.id },
	});
	const navigate = useNavigate();
	if (!isLoggedIn) navigate("/");

	if (loading) return <p className="game-progress-loading">Loading...</p>;
	if (error)
		return <p className="game-progress-error">Error: {error.message}</p>;

	const gameProgress = data.gameProgressByUserId;
	console.log(gameProgress);
	if (gameProgress === null) {
		return <p className="game-progress-loading">No game progress found.</p>;
	}

	return (
		<div className="game-progress-container">
			<h3 className="game-progress-title">Game Progress</h3>
			<ul className="game-progress-list">
				<li className="game-progress-item">
					<span className="game-progress-label">Progress</span>
					<span className="game-progress-value">{gameProgress.progress}</span>
				</li>
				<li className="game-progress-item">
					<span className="game-progress-label">Experience Points</span>
					<span className="game-progress-value">
						{gameProgress.experiencePoints}
					</span>
				</li>
				<li className="game-progress-item">
					<span className="game-progress-label">Score</span>
					<span className="game-progress-value">{gameProgress.score}</span>
				</li>
				<li className="game-progress-item">
					<span className="game-progress-label">Last Played</span>
					<span className="game-progress-value">
						{new Date(gameProgress.lastPlayed).toISOString().split("T")[0]}
					</span>
				</li>
			</ul>
		</div>
	);
}

export default GameProgress;
