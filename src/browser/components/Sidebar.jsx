import { Link } from 'react-router'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import React, { Component } from 'react'
import LoginLogoutButton from './LoginLogoutButton'
import { actions } from '../redux/actions/GlobalActions'
import { translate } from 'browser/containers/Translator'

@connect(
	({ user, global }, ownProps) => ({
		user,
		...ownProps,
		sidebarIsOpen: global.get('sidebarIsOpen'),
	}),
    (dispatch, ownProps) => ({
        toggleSidebar() {
            dispatch(actions.toggleSidebar())
        }
    })
)
export default class Sidebar extends Component {
	render() {
		const { user, sidebarIsOpen, toggleSidebar } = this.props
		const username = user.get('username')
		return 	<Drawer className="Sidebar" docked={false} open={sidebarIsOpen} onRequestChange={toggleSidebar}>
					{
						username
						?	<div>
								<MenuItem onClick={toggleSidebar}><LoginLogoutButton inline /></MenuItem>
								<MenuItem>
									<Link onClick={toggleSidebar} to={`users/${username}`}>{translate("profile")}</Link>
								</MenuItem>
							</div>
						: 	null
					}
					<MenuItem><Link onClick={toggleSidebar} to="search">{translate("search")}</Link></MenuItem>
					{/*<MenuItem><Link onClick={toggleSidebar} to="about">{translate("about")}</Link></MenuItem>*/}
				</Drawer>
	}
}
