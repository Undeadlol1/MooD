import { Link } from 'react-router'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import React, { Component } from 'react'
import LoginLogoutButton from './LoginLogoutButton'
import { toggleSidebar } from '../redux/actions/GlobalActions'

@connect(
	({ global: { sidebarIsOpen } }, ownProps) => ({ sidebarIsOpen, ...ownProps }),
    (dispatch, ownProps) => ({
        toggleSidebar(value) {
            dispatch(toggleSidebar(value))
        }
    })
)
export default class Sidebar extends Component {
	render() {
		const { sidebarIsOpen, toggleSidebar } = this.props
		// remove onRequestChange ?
		return 	<Drawer className="Sidebar" docked={false} open={sidebarIsOpen} onRequestChange={toggleSidebar}>
					<MenuItem><LoginLogoutButton inline fullWidth /></MenuItem>
					<MenuItem><Link to="search">search</Link></MenuItem>
					<MenuItem><Link to="about">about</Link></MenuItem>
				</Drawer>
	}
}
