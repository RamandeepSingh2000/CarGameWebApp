// user-app/src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Leaderboard from "./components/Leaderboard";
import GameProgress from "./components/GameProgress";
import Chat from "./components/Chat";
import ChatWrapper from "./components/ChatWrapper";
import "bootstrap/dist/css/bootstrap.min.css";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Achievements from "./components/Achievements.jsx";

const client = new ApolloClient({
  uri: "http://localhost:4002/graphql", // Set this to your actual GraphQL endpoint
  cache: new InMemoryCache(),
  credentials: "include",
});

function App({ isLoggedIn, userData }) {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            {isLoggedIn && (
              <>
                <Route
                  path="/achievements"
                  element={
                    <Achievements isLoggedIn={isLoggedIn} userData={userData} />
                  }
                />
                <Route
                  path="/gameprogress"
                  element={
                    <GameProgress isLoggedIn={isLoggedIn} userData={userData} />
                  }
                />
                <Route
                  path="/chat"
                  element={<Chat userData={userData} />}
                />
              </>
            )}
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
export { ChatWrapper as Chat };
