const client = require('@apollo/client/core');

exports.ApolloClient = client.ApolloClient;
exports.InMemoryCache = client.InMemoryCache;
exports.createHttpLink = client.createHttpLink;
exports.gql = client.gql;
exports.fetch = require('cross-fetch');