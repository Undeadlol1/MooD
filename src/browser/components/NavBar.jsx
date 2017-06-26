import LoginLogoutButton from 'browser/components/LoginLogoutButton'
import { actions } from 'browser/redux/actions/GlobalActions'
import Loading from 'browser/components/Loading'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { connect } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const titleStyles = { color: 'rgb(48, 48, 48)' }
const LoginLogoutButtonStyles = { marginTop: '5.5px' }
const LoadingStyles = { marginTop: '1.5px' }

const titleLink =   <Link
                        to="/"
                        style={titleStyles}
                        className="NavBar__home-link"
                    >
                        {process.env.APP_NAME}
                    </Link>

export class NavBar extends Component {
    render() {
        const { displayName, UserId, loading, className, children, toggleSidebar, ...rest } = this.props

        let loginOrAvatar

        if (process.env.SERVER || loading) loginOrAvatar = <Loading style={LoadingStyles} color="rgb(48, 48, 48)" condition={true} />
        else {
            loginOrAvatar = UserId
                            ? <Link className="Navbar__profile-link" to={`/users/${UserId}`}>
                                <span className="Navbar__username">{displayName}</span>
                                <Avatar
                                    className="NavBar__avatar"
                                    src={`https://api.adorable.io/avatars/100/${UserId}.png`}
                                />
                              </Link>
                            : <LoginLogoutButton style={LoginLogoutButtonStyles} />
        }

        return  <header className={classNames('NavBar ', className)} {...rest}>
                    <AppBar
                        {...rest}
                        title={titleLink}
                        iconElementRight={loginOrAvatar}
                        onLeftIconButtonTouchTap={toggleSidebar}
                    />
                    {children}
                </header>
    }
}

NavBar.propTypes = {
    UserId: PropTypes.number,
    toggleSidebar: PropTypes.func.isRequired,
}

export const dispatchToProps = dispatch => ({
    toggleSidebar: () => dispatch(actions.toggleSidebar())
})

export default connect(
    ({ user, global  }, ownProps) => {
        const UserId = user.get('id')
        const loading = user.get('loading')
        const displayName = user.get('displayName')
        return { UserId, displayName, loading, ...ownProps }
    },
    dispatchToProps
)(NavBar)