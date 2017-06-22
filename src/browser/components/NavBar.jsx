import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'

import LoginLogoutButton from 'browser/components/LoginLogoutButton'
import { actions } from 'browser/redux/actions/GlobalActions'

const titleStyles = { color: 'rgb(48, 48, 48)' }
const LoginLogoutButtonStyles = { marginTop: '5.5px' }

export class NavBar extends Component {
    render() {
        const { UserId, className, children, toggleSidebar, ...rest } = this.props
        const titleLink =   <Link
                                to="/"
                                style={titleStyles}
                                className="NavBar__home-link"
                            >
                                MooD
                            </Link>
        const loginOrAvatar = UserId
                            ? <Link to={`/users/${UserId}`}>
                                <Avatar
                                    className="NavBar__avatar"
                                    src={`https://api.adorable.io/avatars/100/${UserId}.png`}
                                />
                              </Link>
                            : <LoginLogoutButton style={LoginLogoutButtonStyles} />

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
        return { UserId, ...ownProps }
    },
    dispatchToProps
)(NavBar)