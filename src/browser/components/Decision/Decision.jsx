import selectn from 'selectn'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Icon from 'browser/components/Icon'
import React, { PureComponent } from 'react'
import { translate as t } from 'browser/containers/Translator'
import {
	vote,
	fetchNode,
	nextVideo,
	// createDecision,
	updateDecision,
	removeDecision,
} from 'browser/redux/actions/NodeActions'
import { createDecision } from '../../redux/actions/NodeActions'
// TODO change name to 'controls'?
export class Decision extends PureComponent {
	static propTypes = {
		decision: PropTypes.object,
		decisionVote: PropTypes.number,
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