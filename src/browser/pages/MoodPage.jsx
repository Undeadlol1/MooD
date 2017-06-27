import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import NavBar from 'browser/components/NavBar'
import Video from 'browser/components/Video.jsx'
import Loading from 'browser/components/Loading'
import { Row, Col } from 'react-styled-flexboxgrid'
import Decision from 'browser/components/Decision.jsx'
import PageWrapper from 'browser/components/PageWrapper'
import ShareButton from 'browser/components/ShareButton'
import { translate as t } from 'browser/containers/Translator'
import NodesInsert from 'browser/containers/NodesInsertContainer'
import { fetchMood, unloadMood } from 'browser/redux/actions/MoodActions'
import { actions as globalActions } from 'browser/redux/actions/GlobalActions'
import { fetchNode, actions as nodeActions } from 'browser/redux/actions/NodeActions'

export class MoodPage extends Component {

	componentWillMount() {
		this.props.toggleHeader(false)
		this.props.fetchMood(this.props.params.moodSlug)
		this.props.fetchNode(this.props.params.moodSlug)
	}

	componentWillUnmount() {
		this.props.unloadMood()
		this.props.unloadNode()
		this.props.toggleHeader(true)
	}

	render() {
		const { props } = this
		const { contentNotFound, isLoading, params, ...rest } = this.props
		return 	<PageWrapper
					loading={isLoading}
					className="MoodPage"
					title={t('current_mood') + props.moodName}
					image={props.videoId && `http://img.youtube.com/vi/${props.videoId}/hqdefault.jpg`}
				>
					{/* TODO remove h1 (use css instead) */}
					{contentNotFound && <h1 className="MoodPage__header">{t("currently_zero_content_here")}</h1>}
					<Video className='MoodPage__video'>
						<NavBar className='NavBar--sticky' />
						{!contentNotFound && <Decision className='MoodPage__decision' />}
						<ShareButton />
						<NodesInsert moodSlug={params.moodSlug} /> {/* TODO rework passing of moodSlug */}
					</Video>
				</PageWrapper>
	}
}

MoodPage.propTypes = {
	videoId: PropTypes.string,
	moodName: PropTypes.string,
	contentNotFound: PropTypes.bool,
	isLoading: PropTypes.bool.isRequired,
	params: PropTypes.object.isRequired,
	fetchMood: PropTypes.func.isRequired,
	fetchNode: PropTypes.func.isRequired,
	unloadMood: PropTypes.func.isRequired,
	unloadNode: PropTypes.func.isRequired,
	toggleHeader: PropTypes.func.isRequired,
}

export const stateToProps = ({ node, mood }, ownProps) => {
	return {
		videoId: node.contentId,
		moodName: mood.get('name'),
		contentNotFound: node.contentNotFound,
		isLoading: mood.get('loading') || !node.finishedLoading,
		...ownProps
	}
}

export const dispatchToProps = dispatch => ({
	fetchMood: (slug) => dispatch(fetchMood(slug)),
	fetchNode: (slug) => dispatch(fetchNode(slug)),
	unloadMood: () => dispatch(unloadMood()),
	unloadNode: () => dispatch(nodeActions.unloadNode()),
	toggleHeader: (boolean) => dispatch(globalActions.toggleHeader(boolean))
})

export default connect(stateToProps, dispatchToProps)(MoodPage)