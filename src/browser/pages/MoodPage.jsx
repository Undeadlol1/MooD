import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux';
import Loading from 'components/Loading'
import NodesInsert from 'components/NodesInsert'
import Decision from 'components/Decision.jsx'
import Video from 'components/Video.jsx'
import { fetchMood } from '../redux/actions/MoodActions'
import { fetchNode } from '../redux/actions/NodeActions'
// import { fetchMoodContent } from '../redux/main'

@connect(
	({ node, mood }, ownProps) => ({ mood, node: node.Node, ...ownProps}), // TODO rework "node" state because it is store in 'mood' now
	(dispatch, ownProps) => ({
		fetchMood(slug) {
			dispatch(fetchMood(slug))
		},
	    fetchNode(slug) {
			dispatch(fetchNode(slug))
		}
    })
)
class MoodPage extends Component {

	componentWillMount() {
		this.props.fetchMood(this.props.params.moodSlug) // TODO get curernt mood out of moods array or fetch it
		this.props.fetchNode(this.props.params.moodSlug)
	}

	// @injectProps
	render() {
		const {
			slug, mood, node, decision, location, params, // data
			videoCallback, decisionOnChange, // functions
			...rest
		} = this.props
		// console.log('mood', mood);
		console.log('node', node);
		console.log('node && node.Decision', node && node.Decision);
		// console.log('node.contenId', node.contentId);
		// console.log(mood.Nodes[0]);

		if (!mood.id) return 	<div>
									<h1>Currently zero content here</h1>
									<NodesInsert moodSlug={params.moodSlug} />
								</div>
		else return 	<section className='MoodPage'>
							<h1>{node && node.rating}</h1>
							<NodesInsert moodSlug={params.moodSlug} />			
							<Video contentId={node && node.contentId} className='MoodPage__video'>
								{/*<NodesInsert moodSlug={params.moodSlug} />*/}
								<Row>
									<Col lg={12}>
										<Decision content={node && node.Decision} className='MoodPage__decision' />
									</Col>
								</Row>
							</Video>
						</section>
	}
}

MoodPage.propTypes = {
	mood: PropTypes.object,
	node: PropTypes.object,
	decision: PropTypes.object,
	// fetchMood: PropTypes.func.isRequred,
	// fetchNode: PropTypes.func.isRequred,		
}

export default MoodPage