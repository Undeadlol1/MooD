import React from 'react';
import { Link } from 'react-router';
 
class IndexPage extends React.Component {
  render() {
    return  <div>
                <h1>Первая страница</h1>
                <h2>Ты самая лучшая! 😍 </h2>
                <Link to="/second">перейти на вторую страницу!</Link>
            </div>
  }
}

export default IndexPage