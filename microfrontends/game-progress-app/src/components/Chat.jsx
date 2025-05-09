import React, { useState } from "react";
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
//import "./Chat.css"; // Optional: Add styles

const GAME_AI_QUERY = gql`
  query GameAIQuery($input: String!) {
    gameAIQuery(input: $input) {
      text
    }
  }
`;

function Chat({ userData }) {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [getAIResponse] = useLazyQuery(GAME_AI_QUERY, {
    onCompleted: (data) => {
      setConversation((prev) => [
        ...prev,
        { role: "AI", content: data.gameAIQuery.text },
      ]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsTyping(false);
    },
  });

  const sendQuery = (inputQuery) => {
    if (!inputQuery.trim()) return;
    setConversation([...conversation, { role: "User", content: inputQuery }]);
    setQuery("");
    setIsTyping(true);
    getAIResponse({ variables: { input: inputQuery } });
  };

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h3 className="text-center">Game Chat</h3>
      <Card
        className="shadow-lg p-3"
        style={{ width: "100%", maxWidth: "600px", height: "300px" }}
      >
        <Card.Body
          style={{
            overflowY: "auto",
            height: "210px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                message.role === "User" ? "bg-primary text-white" : "bg-light text-dark"
              }`}
              style={{
                alignSelf: message.role === "User" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                borderRadius: "15px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
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
      <InputGroup className="mt-3" style={{ width: "100%", maxWidth: "600px" }}>
        <Form.Control
          type="text"
          placeholder="Ask about the game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendQuery(query)}
        />
        <Button variant="primary" onClick={() => sendQuery(query)}>
          Send
        </Button>
      </InputGroup>
    </Container>
  );
}

export default Chat;