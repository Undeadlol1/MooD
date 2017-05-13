// DEPENDENCIES
import { Router, Route, browserHistory, IndexRoute, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux' // TODO is it even used?
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import rootReducer from './redux/reducers/RootReducer'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'; // material-ui
injectTapEventPlugin(); // material-ui // TODO reorganize polyfills
// import promise from 'es6-promise'; // isomorphic-fetch dependency
// promise.polyfill() // isomorphic-fetch dependency // TODO reorganize polyfills
import 'es6-promise/auto';
import 'isomorphic-fetch'

import store from './redux/store'
// TODO remove this
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import ReduxToastr from 'react-redux-toastr'

// ROUTES
import routesConfig from './routes'

// STYLES
if (process.env.BROWSER) require('./styles.scss'); //import './styles.scss'
// require('css-modules-require-hook/preset');
const history = browserHistory
// const history = syncHistoryWithStore(browserHistory, store) // for react-router-redux to work
// const client = new ApolloClient()
const client = new ApolloClient({
  networkInterface:   createNetworkInterface({
              uri: 'http://127.0.0.1:3000/graphql',
              opts: {
                  credentials: 'same-origin',
                  mode: 'no-cors',
              }
          })
}
);

class App extends Component {
  render() {
    return  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              {/*<ApolloProvider client={client}>*/}
                  <ReduxProvider store={store}>
                    <div>
                      {
                        process.env.BROWSER
                        ? <Router history={browserHistory} routes={routesConfig}/>
                        : <RouterContext {...this.props} />
                      }
                      <ReduxToastr
                        timeOut={4000}
                        newestOnTop={false}
                        preventDuplicates={true}
                        position="top-left"
                        transitionIn="fadeIn"
                        transitionOut="fadeOut"
                        progressBar />
                    </div>
                  </ReduxProvider>
                {/*</ApolloProvider>*/}
              </MuiThemeProvider>
  }
}

if (process.env.BROWSER) ReactDOM.render(<App />, document.getElementById('react-root'));

export default App