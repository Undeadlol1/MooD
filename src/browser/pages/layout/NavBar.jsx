import React, { Component, PropTypes } from 'react'
import { AppBar, Avatar } from 'material-ui'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { injectProps } from 'relpers'

@connect(
    ({ user }, ownProps) => ({ user, ...ownProps })
    // state => console.log(state)
)
class NavBar extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    }
    
    @injectProps
    render({ user }) {
        const titleLink = <Link to="/" style={{color: 'rgb(48, 48, 48)'}}>MooD</Link>
        const loginButton = user.id
                            ? <Avatar src={user.image} />
                            : <Link to="/login">Login</Link>
        
        return  <AppBar title={titleLink} iconElementRight={loginButton} />
    }
}

export default NavBar