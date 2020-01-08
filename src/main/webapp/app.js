import React from 'react'
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { createClientApollo } from './intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'
import Loadable from 'react-loadable'
import { LogInModal } from './login/loginModal'

const render = async (Routes, client) => {
  // TODO: Update render to be hydrate to improve performance
  await Loadable.preloadReady()
  ReactDOM.render(
    <Application Routes={Routes} client={client} />,
    document.getElementById('root')
  )
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const App = () => {
  const [showLogin, setShowLogIn] = React.useState(true)
  const client = createClientApollo({
    onAuthentication: async done => {
      setShowLogIn(true)
      while (true) {
        await sleep(100)
        if (!showLogin) {
          break
        }
      }
      done()
    },
  })
  React.useEffect(() => {
    const ssrStyles = document.querySelector('#css-server-side')
    if (ssrStyles) {
      ssrStyles.parentNode.removeChild(ssrStyles)
    }
  }, [])
  return (
    <ApolloProvider client={client}>
      <BrowserRouter basename="/search/catalog">
        <div>
          <Routes />
          {showLogin ? (
            <LogInModal
              label="Log In"
              open={true}
              handleClose={() => setShowLogIn(false)}
            />
          ) : null}
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
