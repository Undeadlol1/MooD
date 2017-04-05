import { toggleLoginDialog, logoutCurrentUser } from '../redux/actions/UserActions'
import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome'

// TODO add comments

@connect(
	({ user }, ownProps) => ({
		userId: user.get('id'), ...ownProps
	}),	
    (dispatch, ownProps) => ({
        toggleDialog() {
            dispatch(toggleLoginDialog())
        },
		logout() {
			dispatch(logoutCurrentUser())
		}
    })
)
class LoginLogoutButton extends Component {
	render() {
		const { userId, logout, toggleDialog, inline, fullWidth, ...rest } = this.props
		const isLoggedIn = userId

		if (inline) return <span
								onClick={isLoggedIn ? logout : toggleDialog}
								style={{ display: 'block', textAlign: "center" }}
								{...rest}
							>
								{isLoggedIn ? "logout" : "login"}
							</span>
		
		return <RaisedButton
					label={ isLoggedIn ? "logout" : "login"}
					onClick={isLoggedIn ? logout : toggleDialog}
					{ ...rest } />
	}
}

LoginLogoutButton.propTypes = {
	fullWidth: PropTypes.bool
}

export default LoginLogoutButton