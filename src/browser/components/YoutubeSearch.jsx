import { Link } from 'react-router'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import React, { Component, PropTypes } from 'react'
import LoginLogoutButton from './LoginLogoutButton'
import { toggleSidebar } from '../redux/actions/GlobalActions'
import { checkStatus, parseJSON, headersAndBody } from'../redux/actions/actionHelpers'

@connect(
	({ global: { sidebarIsOpen } }, ownProps) => ({ sidebarIsOpen, ...ownProps }),
    (dispatch, ownProps) => ({
        toggleSidebar(value) {
            dispatch(toggleSidebar(value))
        }
    })
)
export default class YoutubeSearch extends Component {
	state = {
		videos: []
	}
	componentDidMount() {
		fetch(`https://www.googleapis.com/youtube/v3/search?part=id&q="limp bizzkit"&type=video&key=${'AIzaSyAHOfkKqTfstb3V_YVOVKTzye9Gb2Sl4Tw'}`)
			.then(checkStatus)		
			.then(parseJSON)
			.then(data => {
				console.log(data)
				this.setState({ videos: data.items })
			})
			.catch(error => {
				console.error(error)
			})
	}
	render() {
		const { sidebarIsOpen, toggleSidebar } = this.props
		// remove onRequestChange ?
		return 	<div>
					<input type="text" />
					{/*`http://img.youtube.com/vi/${nodeContent}/0.jpg`*/}
					<ul>
						{
							this.state.videos.map((video, index) => <li key={index}><img src={`http://img.youtube.com/vi/${video.id.videoId}/0.jpg`} alt=""/></li>)
						}
					</ul>
				</div>
	}
}
