import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import Icon from 'browser/components/Icon'
import RaisedButton from 'material-ui/RaisedButton'
import LoginForm from 'browser/components/LoginForm'
import { translate } from 'browser/containers/Translator'
import { toggleLoginDialog } from 'browser/redux/actions/UserActions'

export class LoginDialog extends Component {

	static defaultProps = {
		loginIsOpen: false,
	}

	render() {
		const { loginIsOpen, toggleDialog } = this.props
		return <Dialog
					open={loginIsOpen}
					className="LoginDialog"
					onRequestClose={toggleDialog}
					title={translate('please_login')}
				>
					<span className="LoginDialog__icons">
						<RaisedButton
							label="vk.com"
							href="/api/auth/vkontakte"
							className="LoginDialog__icon"
							icon={<Icon name="vk" />} />
						<RaisedButton
							label="twitter.com"
							href="/api/auth/twitter"
							className="LoginDialog__icon"
							icon={<Icon name="twitter" />} />
					</span>
					<Divider />
					<LoginForm />
				</Dialog>
	}
}

LoginDialog.PropTypes = {
	loginIsOpen: PropTypes.bool.isRequired,
	toggleDialog: PropTypes.func.isRequired,
}

export const dispatchToProps = (dispatch, ownProps) => ({
	toggleDialog: () => dispatch(toggleLoginDialog()),
})

export default connect(
	({ user }) => ({ loginIsOpen: user.get('loginIsOpen') }),
	dispatchToProps
)(LoginDialog)