import React from 'react';
import { Link } from 'react-router';

class SecondPage extends React.Component {
  render() {
    return  <div>
                <h1>Вторая страница</h1>
                <h2>Ты самая лучшая! 😍 </h2>
                <Link to="/">перейти на вторую страницу!</Link>
            </div>
  }
}

export default SecondPage