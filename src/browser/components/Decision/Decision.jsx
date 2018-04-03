import selectn from 'selectn'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Icon from 'browser/components/Icon'
import { translate as t } from 'browser/containers/Translator'
import {
	vote,
	nextVideo,
	updateDecision,
	removeDecision,
	createDecision,
} from 'browser/redux/actions/NodeActions'

// TODO: change name to 'controls'?

/**
 * Controls component for Video section.
 * Controls have upvote, downvote and skip video buttons.
 * Skip video just plays next node one in array.
 * Upvote/downvote makes request to decisions api with appropriate values.
 * @export
 * @class Decision
 * @extends {Component}
 */
export class Decision extends Component {
	static propTypes = {
		decision: PropTypes.object,
		// sometimes api responses return booleans or numbers
		decisionVote: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.number,
		]),
		vote: PropTypes.func.isRequired,
		nextVideo: PropTypes.func.isRequired,
	}
	render() {
		const { decisionVote, className, vote, nextVideo, decision, NodeId, ...rest } = this.props
		// sequelize returns 0 or 1 for booleans
		const isUpvote = decisionVote == true
		const isDownvote = decisionVote == false
		return 	<div className={'Decision ' + className}>
					<Icon
						name="thumbs-up"
						title={t('i_like_it')}
						hoverIcon='thumbs-o-up'
						color={isUpvote ? 'rgb(0, 151, 167)' : 'white'}
						onClick={vote.bind(this, decision, NodeId, true,)} />
					<Icon
						title={t('skip')}
						onClick={nextVideo}
						name="step-forward" />
					<Icon
						name="thumbs-down"
						hoverIcon='thumbs-o-down'
						title={t('dont_like_it_dont_show_again')}
						color={isDownvote ? 'rgb(255, 64, 129)' : 'white'}
						onClick={vote.bind(this, decision, NodeId, false)} />
				</div>
	}
}

export default connect(
	// state to props
	({ node }, ownProps) => {
		return {
			NodeId: node.get('id'),
			decision: node.get('Decision').toJS(),
			decisionVote: node.getIn(['Decision', 'vote']),
			...ownProps
		}
	},
	// dispatch to props
	(dispatch) => ({
		nextVideo() {
			dispatch(nextVideo())
		},
		// FIXME: comments
		vote(decision, NodeId, vote) {
			// i don't think this section does anything because there is always a decision
			if (!decision) dispatch(createDecision({vote, NodeId}))
			else {
				// set to null FIXME: comment
				// TODO: boolean == 1 || 0
				if (vote == decision.vote) dispatch(updateDecision(decision.id, {vote: null}))
				else dispatch(updateDecision(decision.id, {vote}))
			}
		}
    })
)(Decision)