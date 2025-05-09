import { gql } from "@apollo/client";

export const GET_GAME_PROGRESS = gql`
	query GetGameProgress($userId: ID!) {
		gameProgressByUserId(userId: $userId) {
			id
			experiencePoints
			score
			progress
			lastPlayed
			achievements
		}
	}
`;
