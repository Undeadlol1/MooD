import React from 'react';
import ReactDOM from 'react-dom';
import IndexPage from './pages/IndexPage.jsx';
import SecondPage from './pages/SecondPage.jsx';
import { Router, Route, Link, browserHistory } from 'react-router'

class Hello extends React.Component {
  render() {
    return  <div>
                <h1>Привет, Сабинка!</h1>
                <h2>Ты самая лучшая! 😍 </h2>
                <Router history={browserHistory}>
                  <Route path="/" component={IndexPage} />
                  <Route path="second" component={SecondPage} />
                    {/*<Route path="users" component={Users}>
                      <Route path="/user/:userId" component={User}/>
                    </Route>*/}
                    {/*<Route path="*" component={NoMatch}/>*/}
                </Router>
            </div>
  }
}
 
ReactDOM.render(<Hello/>, document.getElementById('react-root'));