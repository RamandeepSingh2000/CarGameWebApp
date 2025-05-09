import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Chat from "./Chat";

const createIsolatedClient = () => {
    return new ApolloClient({
      uri: "http://localhost:4002/graphql",
      cache: new InMemoryCache(),
      credentials: "include",
    });
  };
  
  function ChatWrapper({ userData }) {
    const client = createIsolatedClient();
    return (
      <ApolloProvider client={client}>
        <Chat userData={userData} />
      </ApolloProvider>
    );
  }
  
  export default ChatWrapper;