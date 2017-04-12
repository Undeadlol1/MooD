// DEPENDENCIES
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux' // TODO is it even used?
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import rootReducer from './redux/reducers/RootReducer'
import thunk from 'redux-thunk' // TODO is it even used?
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'; // material-ui
injectTapEventPlugin(); // material-ui // TODO reorganize polyfills
// import promise from 'es6-promise'; // isomorphic-fetch dependency
// promise.polyfill() // isomorphic-fetch dependency // TODO reorganize polyfills
import 'es6-promise/auto';
import 'isomorphic-fetch'

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import ReduxToastr from 'react-redux-toastr'

// PAGES
import Layout from './pages/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import MoodPage from './pages/MoodPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';

// STYLES
import './styles.scss'
import 'react-redux-toastr/src/styles/index.scss';

// const store = createStore(rootReducer, initialState, applyMiddleware(thunk)) // thunk, promise,
const reduxDevtools = (process.env.NODE_ENV == 'development') ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : {}
const store = createStore(rootReducer, reduxDevtools, applyMiddleware(thunk)) // thunk, promise, // TODO add dev variable to redux devtools
const history = syncHistoryWithStore(browserHistory, store) // for react-router-redux to work
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
                      <Router history={history}>
                        <Route path="/" component={Layout}>
                          <IndexRoute component={IndexPage} />
                          <Route path="login" component={LoginPage} />
                          <Route path="mood/(:moodSlug)" component={MoodPage} />
                          <Route path="search" component={SearchPage} />
                          <Route path="about" component={AboutPage} />
                          <Route path="*" component={NotFound }/>                    
                        </Route>
                      </Router>
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
 
ReactDOM.render(<App />, document.getElementById('react-root'));