// shell-app/src/App.jsx
// shell-app/src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import "./App.css";

const AuthApp = lazy(() => import("authApp/App"));
const GameProgressApp = lazy(() => import("gameProgressApp/App"));
const ChatbotApp = lazy(() => import("chatbotApp/App"));
const GameApp = lazy(() => import("gameApp/App"));
// GraphQL query to check the current user's authentication status
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
      role
    }
  }
`;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in microfrontend:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>{this.props.fallback}</div>;
    }
    return this.props.children;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Use Apollo's useQuery hook to perform the authentication status check on app load
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    // Listen for the custom loginSuccess event from the UserApp
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
      setUserData(event.detail.userData);
    };

    const handleLogoutSuccess = (event) => {
      setIsLoggedIn(false);
      setUserData(null);
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);

    window.addEventListener("logoutSuccess", handleLogoutSuccess);

    // Check the authentication status based on the query's result
    if (!loading && !error) {
      setIsLoggedIn(!!data.currentUser);
      setUserData(data.currentUser);
    }

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
      window.removeEventListener("logoutSuccess", handleLogoutSuccess);
    };
  }, [loading, error, data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div className="app-container">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="sidebar">
          <h2 className="sidebar-title">Game Progress App</h2>
          <nav>
            <div className="sidebar-nav">
              <ul>
                <li>
                  <a href="/leaderboard">Leaderboard</a>
                </li>
                {isLoggedIn && (
                  <>
                    <li>
                      <a href="/gameprogress">Game Progress</a>
                    </li>
                    <li>
                      <a href="/achievements">Achievements</a>
                    </li>
                    <li>
                      <a href="/game">Game</a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
          <div>
            <ErrorBoundary fallback="Player App failed to load">
              <AuthApp isLoggedIn={isLoggedIn} userData={userData} />
              <ErrorBoundary fallback="Chatbot App failed to load">
                <ChatbotApp isLoggedIn={isLoggedIn} userData={userData} />
              </ErrorBoundary>
            </ErrorBoundary>
          </div>
        </div>
        <div className="main-section">
          <GameProgressApp isLoggedIn={isLoggedIn} userData={userData} />
          <ErrorBoundary fallback="Game App failed to load">
            <GameApp isLoggedIn={isLoggedIn} userData={userData} />
          </ErrorBoundary>
        </div>
      </Suspense>
    </div>
  );
}

export default App;
