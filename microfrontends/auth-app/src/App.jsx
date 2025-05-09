import "./App.css";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AuthProvider } from "./AuthContext";
import PlayerLogin from "./components/playerLogin";

const client = new ApolloClient({
	uri: "http://localhost:4001/graphql", // Set this to your actual GraphQL endpoint
	cache: new InMemoryCache(),
	credentials: "include",
});

function App({ isLoggedIn, userData }) {
	/*{
		console.log("👤 userData received:", userData);
		console.log("🔒 isLoggedIn:", isLoggedIn);
	}*/
	return (
		<div className="App">
			<ApolloProvider client={client}>
				<AuthProvider>
					<PlayerLogin isLoggedIn={isLoggedIn} userData={userData} />
				</AuthProvider>
			</ApolloProvider>
		</div>
	);
}

export default App;
