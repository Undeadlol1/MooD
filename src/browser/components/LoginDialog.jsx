import { toggleLoginDialog } from '../redux/actions/UserActions'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome'

@connect(
	({ user }) => ({ loginIsOpen: user.get('loginIsOpen') }),
    (dispatch, ownProps) => ({
        toggleDialog() {
            dispatch(toggleLoginDialog())
        }
    })
)
export default class LoginDialog extends Component {
	render() {
		const { loginIsOpen, toggleDialog } = this.props
		const iconOptions = iconName => ({ // TODO move this in css
			size: "2x",
			name: iconName,
			style: { color: 'white' }
		})

		return <Dialog
					open={loginIsOpen}
					title="Please login"
					className="LoginDialog"
					onRequestClose={toggleDialog}
				>	
					<span className="LoginDialog__icons">
						<RaisedButton
							label="vk.com"
							href="/auth/vkontakte"
							className="LoginDialog__icon"
							icon={<FontAwesome {...iconOptions('vk')} />} />
						<RaisedButton
							label="twitter.com"
							href="/auth/twitter"
							className="LoginDialog__icon"							
							icon={<FontAwesome {...iconOptions('twitter')} />} />	
					</span>
				</Dialog>				
	}
}
