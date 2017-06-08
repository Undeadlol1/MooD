import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Avatar } from 'material-ui'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import LoginLogoutButton from './LoginLogoutButton'
import { toggleSidebar, toggleControls } from '../redux/actions/GlobalActions'

@connect(
    ({ user, global  }, ownProps) => {
        return {
            ...ownProps,
            headerIsShown: global.get('headerIsShown'),
            username: user.get('username') && user.get('username').toLowerCase(), // TODO this lowercase addition is ugly
        }
    },
    (dispatch, ownProps) => ({
        toggleSidebar() {
            dispatch(toggleSidebar())
        }
    })
)
class NavBar extends Component {
    render() {
        const { username, headerIsShown, className, toggleSidebar, children, ...rest } = this.props
        const titleLink = <Link to="/" className="NavBar__home-link">MooD</Link>
        const loginButton = username
                            ? <Link to={`/users/${username}`}>
                                <Avatar className="NavBar__avatar" src={`https://api.adorable.io/avatars/100/${username}.png`} />
                              </Link>
                            : <LoginLogoutButton />

        return  <header className={'NavBar ' + className} {...rest}>
                    <AppBar
                        title={titleLink}
                        iconElementRight={loginButton}
                        onLeftIconButtonTouchTap={toggleSidebar}
                        {...rest} />
                        {children}
                </header>
    }
}

NavBar.propTypes = {
    // user: PropTypes.object.isRequired,
    // toggleSidebar: PropTypes.func.isRequired
}

export default NavBar