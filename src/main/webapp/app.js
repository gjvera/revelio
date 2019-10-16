import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from '@connexta/ace/react-hot-loader'
import Routes from './routes'
import { Provider } from 'react-redux'
import createStore from './store'
import { createClient } from './intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'

const store = createStore()

const render = (Routes, client) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <Routes />
        </ApolloProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Routes, createClient())

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept('./routes', () => {
    render(require('./routes').default, createClient())
  })
  module.hot.accept('./store', () => {
    const { rootReducer } = require('./store')
    store.replaceReducer(rootReducer)
  })
  module.hot.accept('./intrigue-api/graphql', () => {
    const { createClient } = require('./intrigue-api/graphql')
    render(require('./routes').default, createClient())
  })
}
