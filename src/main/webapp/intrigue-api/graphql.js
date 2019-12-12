import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { RetryLink } from 'apollo-link-retry'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import schema from './schema'

const { resolvers, typeDefs, context } = schema

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const btoa = arg => {
  if (typeof window !== 'undefined') {
    return window.btoa(arg)
  }
  return Buffer.from(arg).toString('base64')
}

const authorization = `Basic ${btoa('admin:admin')}`

const createServerApollo = (...args) => {
  // TODO: remove this block when we get auth working
  const { req } = args[0]
  if (!req.headers.authorization) {
    req.headers.authorization = authorization
  }

  const cache = new InMemoryCache()
  return new ApolloClient({
    link: new SchemaLink({
      schema: executableSchema,
      context: context(...args),
    }),
    ssrMode: true,
    cache,
  })
}

const retryLink = new RetryLink({
  delay: { initial: 300, max: Infinity, jitter: true },
  attempts: {
    max: 1,
    retryIf: (error, _operation) => {},
  },
})
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      // if unauthenticated forward operation with new context
      // containing new headers
	return forward(graphQLErrors, operation)
    } else if (networkError) {
	return forward(networkError, operation)
    }
  }
)

const createClientApollo = () => {
  const cache = new InMemoryCache()
  cache.restore(window.__APOLLO_STATE__)
  return new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      retryLink,
      new BatchHttpLink({
        uri: '/graphql',
        credentials: 'same-origin',
        headers: { authorization },
      }),
    ]),
    cache,
  })
}

module.exports = {
  createClientApollo,
  createServerApollo,
  resolvers,
  typeDefs,
  context,
}
