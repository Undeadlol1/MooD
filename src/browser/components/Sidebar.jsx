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
        toggleSidebar() {
            dispatch(toggleSidebar())
        }
    })
)
export default class Sidebar extends Component {
	render() {
		const { sidebarIsOpen, toggleSidebar } = this.props
		return 	<Drawer className="Sidebar" docked={false} open={sidebarIsOpen} onRequestChange={toggleSidebar}>
					<MenuItem onClick={toggleSidebar}><LoginLogoutButton inline fullWidth /></MenuItem>
					<MenuItem><Link onClick={toggleSidebar} to="search">search</Link></MenuItem>
					{/*<MenuItem><Link onClick={toggleSidebar} to="about">about</Link></MenuItem>*/}
				</Drawer>
	}
}
