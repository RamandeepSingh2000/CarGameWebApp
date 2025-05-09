// App.jsx is the main entry point for the React application.

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Chatbot from "./components/Chatbot";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4002/graphql", // Adjust if needed
  cache: new InMemoryCache(),
  credentials: "include",
});

function App({ isLoggedIn, userData }) {
  return (
    <div>
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route
              path="/game"
              element={<Chatbot isLoggedIn={isLoggedIn} />}
            ></Route>
          </Routes>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
