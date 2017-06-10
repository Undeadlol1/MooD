import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { AppBar, Avatar } from 'material-ui'
import LoginLogoutButton from 'browser/components/LoginLogoutButton'
import { toggleControls } from 'browser/redux/actions/GlobalActions'

@connect(
    ({ user, global  }, ownProps) => {
        const username = user.get('username')
                         && user.get('username').toLowerCase()
        return { username, ...ownProps }
    }
)
class NavBar extends Component {
    render() {
        const { username, className, children, dispatch, ...rest } = this.props
        const titleLink = <Link to="/" className="NavBar__home-link">MooD</Link>
        const loginButton = username
                            ? <Link to={`/users/${username}`}>
                                <Avatar
                                    className="NavBar__avatar"
                                    src={`https://api.adorable.io/avatars/100/${username}.png`}
                                />
                              </Link>
                            : <LoginLogoutButton />

        return  <header className={'NavBar ' + className} {...rest}>
                    <AppBar
                        {...rest}
                        title={titleLink}
                        iconElementRight={loginButton}
                        onLeftIconButtonTouchTap={() => dispatch(toggleSidebar())}
                    />
                        {children}
                </header>
    }
}

NavBar.propTypes = {
    // user: PropTypes.object.isRequired,
    // toggleSidebar: PropTypes.func.isRequired
}

export default NavBar