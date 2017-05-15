import 'es6-promise/auto';
import 'isomorphic-fetch'

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
import store from './redux/store'
import ReduxToastr from 'react-redux-toastr' // TODO do i even use this?
import routesConfig from './routes'
import Translator from './containers/Translator'
import { FormattedMessage } from 'react-intl';

// STYLES
if (process.env.BROWSER) require('./styles.scss');

const history = browserHistory
// const history = syncHistoryWithStore(browserHistory, store) // for react-router-redux to work

// supply userAgent for material ui prefixer in ssr
// http://stackoverflow.com/a/38100609
darkBaseTheme.userAgent = navigator.userAgent

class App extends Component {
  render() {
    return  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
              <ReduxProvider store={store}>
                <Translator>
                  <div>
                    <h1>
                      <FormattedMessage
                          id="test"
                          defaultMessage={`THis is a default message!`}
                      />
                    </h1>
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
                </Translator>
              </ReduxProvider>
            </MuiThemeProvider>
  }
}

if (process.env.BROWSER) ReactDOM.render(<App />, document.getElementById('react-root'));

export default App