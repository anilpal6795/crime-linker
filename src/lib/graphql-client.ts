
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// Update this URL to point to your external backend
const httpLink = new HttpLink({
  uri: process.env.BACKEND_URL || 'http://localhost:4000/graphql', // Make sure URI ends with /graphql
});

// Add error handling and request logging
const errorLink = ApolloLink.from([
  // Log any GraphQL errors or network error
  new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
      }
      return response;
    });
  }),
]);

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
