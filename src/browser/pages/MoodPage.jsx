import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-styled-flexboxgrid'
import { connect } from 'react-redux';
import Loading from '../components/Loading'
import NodesInsert from '../containers/NodesInsertContainer'
import Decision from '../components/Decision.jsx'
import Video from '../components/Video.jsx'
import NavBar from '../components/NavBar'
import { fetchMood, unloadMood } from '../redux/actions/MoodActions'
import { fetchNode, actions as nodeActions } from '../redux/actions/NodeActions'
import { actions as globalActions } from '../redux/actions/GlobalActions'
import { translate as t } from 'browser/containers/Translator'
import PageWrapper from 'browser/components/PageWrapper'

@connect(
	({ node, mood }, ownProps) => {
		return {
			contentNotFound: node.contentNotFound,
			isLoading: mood.get('loading') || !node.finishedLoading,
			...ownProps
		}
	},
	(dispatch, ownProps) => ({ // TODO remove this and use dispatch directly?
		fetchMood: (slug) => dispatch(fetchMood(slug)),
	    fetchNode: (slug) => dispatch(fetchNode(slug)),
	    unloadMood: () => dispatch(unloadMood()),
	    unloadNode: () => dispatch(nodeActions.unloadNode()),
		toggleHeader: (boolean) => dispatch(globalActions.toggleHeader(boolean))
    })
)
class MoodPage extends Component {

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
		const { contentNotFound, isLoading, location, params, ...rest } = this.props
		return 	<PageWrapper
					loading={isLoading}
					className="MoodPage"
				>
					{/* TODO remove h1 (use css instead) */}
					<h1 hidden={!contentNotFound} className="MoodPage__header">{t("currently_zero_content_here")}</h1>
					<Video className='MoodPage__video'>
						<NavBar className='NavBar--sticky' />
						{!contentNotFound && <Decision className='MoodPage__decision' />}
						<NodesInsert moodSlug={params.moodSlug} /> {/* TODO rework passing of moodSlug */}
					</Video>
				</PageWrapper>
	}
}

MoodPage.propTypes = {
	mood: PropTypes.object,
	node: PropTypes.object,
	// fetchMood: PropTypes.func.isRequred,
	// fetchNode: PropTypes.func.isRequred,
	// unloadMood: PropTypes.func.isRequred,
	// unloadNode: PropTypes.func.isRequred,
	// toggleHeader: PropTypes.func.isRequred,
}

export default MoodPage