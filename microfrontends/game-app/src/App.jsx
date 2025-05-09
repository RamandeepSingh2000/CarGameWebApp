import "./App.css";
import Scene from "./components/Scene";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4002/graphql", // Set this to your actual GraphQL endpoint
  cache: new InMemoryCache(),
  credentials: "include",
});

function App({isLoggedIn, userData}) {
  const antialias = true;
  const engineOptions = {};
  const adaptToDeviceRatio = false;
  const sceneOptions = {};
  const onRender = () => {};
  const onSceneReady = () => {};
  const rest = { width: 800, height: 600 };

  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route
              path="/game"
              element={
                <Scene
                  antialias={antialias}
                  engineOptions={engineOptions}
                  adaptToDeviceRatio={adaptToDeviceRatio}
                  sceneOptions={sceneOptions}
                  onRender={onRender}
                  onSceneReady={onSceneReady}
                  userData={userData}
                  isLoggedIn={isLoggedIn}
                  {...rest}
                />
              }
            />
          </Routes>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
