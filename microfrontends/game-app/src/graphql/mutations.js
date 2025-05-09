import { gql } from "@apollo/client";

export const UPDATE_GAME_PROGRESS = gql`
	mutation UpdateGameProgress(
		$userId: ID!
		$experiencePoints: Int
		$score: Int
		$progress: String
		$lastPlayed: String
		$achievements: [String]
	) {
		updateGameProgress(
			userId: $userId
			experiencePoints: $experiencePoints
			score: $score
			progress: $progress
			lastPlayed: $lastPlayed
			achievements: $achievements
		) {
			id
			userId
			experiencePoints
			score
			progress
			lastPlayed
			achievements
		}
	}
`;
