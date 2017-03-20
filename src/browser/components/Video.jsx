import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux';
// import { Meteor } from 'meteor/meteor'
// import { $ } from 'meteor/jquery'
// import { FlowRouter } from 'meteor/kadira:flow-router'
import YouTube from 'react-youtube'
import { toggleState } from '../components/Utils'
import { fetchMoodContent } from '../redux/main'
// import { requestNewVideo } from '../redux/main'
import { fetchMood } from '../redux/actions/MoodActions'

const { object, string } = PropTypes

@connect(
	(state, ownProps) => {
		// console.log('state', state)
		const {content, rating} = state
		// const slug = FlowRouter.getParam('moodSlug')
		const slug = ''
		return ({content, slug, rating, ...ownProps})
	},
	(dispatch, ownProps) => ({
		fetchMoodContent(...params) {
			dispatch(fetchMoodContent(...params))
		},
		requestNewVideo(params) {//
			console.log('params', params)
			console.info('IMPLEMENT requestNewVideo()!');
			// dispatch(requestNewVideo(params))
			dispatch(fetchMood())
		}
    })
)
export default class Video extends Component {

	static propTypes = { contentId: string.isRequired }

	state = { hidden: true }

	// componentWillMount() {this.props.fetchMoodContent()}

	toggleDecision = hidden => this.setState({hidden})

	render() {
		const 	{contentId, slug, rating, fetchMoodContent, requestNewVideo, className, ...rest} = this.props,
				{props, state} = this,
				opts = {
					height: '100%',
					width: '100%',
					// https://developers.google.com/youtube/player_parameters
					playerVars: {autoplay: 1, controls: 1}
				},
				// userId = Meteor.userId()
				userId = '' // TODO remove this
		
		return 	<section
					{...rest}
					className={"Video " + className}
					onMouseOver={this.toggleDecision.bind(this, false)}
					onMouseLeave={this.toggleDecision.bind(this, true)}
				>
					<YouTube
						opts={opts}
						videoId={contentId}
						onEnd={requestNewVideo.bind(this, {rating, contentId, slug, userId})}
						onError={requestNewVideo.bind(this, {rating, contentId, slug, userId})}
						/>
					<div
						hidden={state.hidden}
						className="Video__decision"
						onMouseOver={this.toggleState}
					>
	    				{props.children}
					</div>
				</section>
	}
}
