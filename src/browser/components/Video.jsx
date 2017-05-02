import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux';
import YouTube from 'react-youtube'
import { toggleState } from '../components/Utils'
import { fetchNode, actions } from '../redux/actions/NodeActions'
import { toggleControls, openControls, closeControls } from '../redux/actions/GlobalActions'

const { object, string } = PropTypes

@connect(
	({node, global: {controlsAreShown}}, ownProps) => {
		return ({node, controlsAreShown, ...ownProps})
	},
	(dispatch, ownProps) => ({
		openControls() {
			dispatch(openControls())
		},
		closeControls() {
			dispatch(closeControls())
		},
		toggleControls(boolean) {
			// setTimeout(() => {
			// 	dispatch(toggleControls(boolean))
			// }, 1000);
			console.log('toggleControls', boolean);
			dispatch(toggleControls(boolean))
		},
		requestNewVideo(params) {// REMOVE THIS?
			// console.info('IMPLEMENT requestNewVideo()!');
			// dispatch(requestNewVideo(params))
			/*
				unload node before fetching new one in case
				because mutability does node load video if node is the same
			*/
			dispatch(actions.unloadNode())
			dispatch(fetchNode(ownProps.moodSlug))
		}
    })
)
export default class Video extends Component {
	render() {
		const 	{node, controlsAreShown, contentId, slug, rating, toggleControls, requestNewVideo, className, ...rest} = this.props,
				{props, state} = this,
				opts = {
					height: '100%',
					width: '100%',
					// https://developers.google.com/youtube/player_parameters
					playerVars: {autoplay: 1, controls: 1}
				}

		return 	<section
					{...rest}
					className={"Video " + className}
					// TODO add comments about iframe!!!
					// onMouseEnter={props.openContorls} // on mouseEnter?
					onMouseLeave={props.closeControls}
					onMouseOver={props.openControls}
					onMouseMove={this.test}
				>
					<YouTube
						opts={opts}
						videoId={node.contentId}
						// styles={{pointerEvents: 'none', zIndex: '-123231'}}
						// onEnd={requestNewVideo.bind(this, {rating, contentId, slug, userId})} // rework this parameters and function
						// onError={requestNewVideo.bind(this, {rating, contentId, slug, userId})} // rework this parameters  and function
						onEnd={requestNewVideo}
						onError={requestNewVideo}
						/>
					<div
						hidden={controlsAreShown}
						className="Video__controls"
						// onMouseEnter={toggleControls}						
						// onMouseOver={toggleControls.bind(this, true)}
					>
	    				{/*{controlsAreShown ? props.children : null}*/}
						<div hidden={!controlsAreShown}>{props.children}</div>
						{/* controlsAreShown */}
					</div>
				</section>
	}
}
