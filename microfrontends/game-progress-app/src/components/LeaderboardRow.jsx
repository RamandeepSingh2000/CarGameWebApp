// components/Profile.jsx
import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {    
      username           
    }
  }
`;

function LeaderboardRow(props) {
  const { userId } = props;
  console.log(userId);
  const { loading, error, data } = useQuery(GET_USER,{
    variables: { id:userId }    
} );  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  console.log(data);

  return (    
    <div>Hey</div>      
    // <div className="profile">
    // 	<h3>Players</h3>

    // 	{data ? (
    // 		<table className="players-table">
    // 			<thead>
    // 				<tr>
    // 					<th>Username</th>
    // 					<th>Ranking</th>
    // 				</tr>
    // 			</thead>
    // 			<tbody>
    // 				{data.players.map((player) => (
    // 					<tr key={player.id}>
    // 						<td>{player.user ? player.user.username : "User Removed"}</td>
    // 						<td>{player.ranking}</td>
    // 					</tr>
    // 				))}
    // 			</tbody>
    // 		</table>
    // 	) : (
    // 		<p>No players found.</p>
    // 	)}
    // </div>
    // <div>Hey</div>
  );
}

export default LeaderboardRow;
