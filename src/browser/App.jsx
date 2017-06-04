/* POLYFILLS */
import 'es6-promise/auto'
import 'isomorphic-fetch' // TODO move to server? or to webpack?
// material-ui dependency
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin(); 
// supply userAgent for material-ui prefixer in ssr
// http://stackoverflow.com/a/38100609
darkBaseTheme.userAgent = navigator.userAgent

/* DEPENDENCIES */
import { Router, Route, browserHistory, IndexRoute, RouterContext } from 'react-router';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import rootReducer from './redux/reducers/RootReducer'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import store from './redux/store'
import ReduxToastr from 'react-redux-toastr'
import routesConfig from './routes'
import Translator from './containers/Translator'

// STYLES
if (process.env.BROWSER) require('./styles.scss');

class App extends Component {
  render() {
    return  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <ReduxProvider store={store}>
                <Translator>
                    {
                      process.env.BROWSER
                      ? <Router history={browserHistory} routes={routesConfig} />
                      : <RouterContext {...this.props} />
                    }
                    <ReduxToastr position="top-left" progressBar />
                </Translator>
              </ReduxProvider>
            </MuiThemeProvider>
  }
}

if (process.env.BROWSER) ReactDOM.render(<App />, document.getElementById('react-root'));

export default App