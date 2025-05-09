// App.jsx is the main entry point for the React application.

import React, { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import {
  Container,
  Card,
  Form,
  InputGroup,
  Button,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Define GraphQL Query
const GAME_AI_QUERY = gql`
  query AskQuesiton($input: String!) {
    gameAIQuery(input: $input) {
      text
    }
  }
`;

const GAME_HINT = gql`
  query GameHint($level: Int!, $numberOfDeaths: Int) {
    gameHint(level: $level, numberOfDeaths: $numberOfDeaths)
  }
`;

const Chatbot = ({ isLoggedIn }) => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [levelNumber, setLevelNumber] = useState(0);

  const [getAIResponse] = useLazyQuery(GAME_AI_QUERY, {
    onCompleted: (data) => {
      setConversation((prev) => [
        ...prev,
        {
          role: "AI",
          content: data.gameAIQuery.text,
        },
      ]);
      setIsTyping(false); // Remove typing indicator after response
    },
  });

  const [getAIHint] = useLazyQuery(GAME_HINT, {
    onCompleted: (data) => {
      setConversation((prev) => [
        ...prev,
        {
          role: "AI",
          content: data.gameHint,
        },
      ]);
      setIsTyping(false); // Remove typing indicator after response
    },
  });

  // Function to send user query
  const sendQuery = (inputQuery) => {
    if (!inputQuery.trim()) return;
    setConversation([...conversation, { role: "User", content: inputQuery }]);
    setQuery("");
    setIsTyping(true); // Show typing indicator
    getAIResponse({ variables: { input: inputQuery } });
  };

  // Function to send user query
  const requestHint = (numberOfDeaths) => {
    setIsTyping(true); // Show typing indicator
    getAIHint({
      variables: {
        level: levelNumber,
        numberOfDeaths: numberOfDeaths,
      },
    });
  };

  useEffect(() => {
    // Listen for the custom loginSuccess event from the UserApp
    const handleLevelChanged = (event) => {
      console.log("handleLevelChanged");
      setLevelNumber(event.detail.levelNumber);
    };

    const handlePlayerFailed = (event) => {
      console.log("handlePlayerFailed");
      if (event.detail.numberOfFails >= 2) {
        requestHint(event.detail.levelNumber);
      }
    };

    window.addEventListener("levelChanged", handleLevelChanged);
    window.addEventListener("playerFailed", handlePlayerFailed);

    return () => {
      window.removeEventListener("levelChanged", handleLevelChanged);
      window.removeEventListener("playerFailed", handlePlayerFailed);
    };
  });

  if (!isLoggedIn) return null; // Render nothing if user is not logged in
  
  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h4 className="text-center">Game Guide AI Chatbot</h4>

      {/* Chat Window */}
      <Card
        className="shadow-lg p-0"
        style={{ width: "100%", maxWidth: "600px", height: "200px" }}
      >
        <Card.Body
          style={{
            overflowY: "auto",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-1 square ${
                message.role === "User"
                  ? "bg-light --bs-dark-bg-subtle"
                  : "bg-secondary text-white"
              }`}
              style={{
                alignSelf: message.role === "User" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                borderRadius: "5px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
              }}
            >
              <strong>{message.role}: </strong> {message.content}
            </div>
          ))}
          {isTyping && (
            <div className="text-muted d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              AI is typing...
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Input Field */}
      <InputGroup className="mt-3" style={{ width: "100%", maxWidth: "600px" }}>
        <Form.Control
          type="text"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendQuery(query)}
        />
        <button onClick={() => sendQuery(query)}>Send</button>
      </InputGroup>
    </Container>
  );
};

export default Chatbot;
