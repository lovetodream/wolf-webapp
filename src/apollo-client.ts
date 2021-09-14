import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core';
import { getOperationAST } from 'graphql';

const cache = new InMemoryCache({
  addTypename: true
})

// Leave websocket connection out for now
// const wsLink = new WebSocketLink({
//   uri: 'wss://localhost:3333/graphql',
//   options: {
//     lazy: true,
//     reconnect: true
//   },
//   webSocketImpl: ws
// })

const httpLink = new HttpLink({
  uri: 'http://localhost:3333/graphql'
})

const link = ApolloLink.split((op) => {
  const operationAST = getOperationAST(op.query, op.operationName)
  return !!operationAST && operationAST.operation === 'subscription'
}, httpLink, httpLink)

export default new ApolloClient({
  cache,
  link,
  connectToDevTools: true
})
