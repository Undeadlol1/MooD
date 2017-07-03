import React, { Component } from 'react'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'browser/components/Icon'
import { vote, fetchNode, nextVideo } from 'browser/redux/actions/NodeActions'

// TODO change name to 'controls'?
@connect(
	// state to props
	({ node }, ownProps) => {
		return {
			decision: node.get('Decision'),
			decisionVote: node.getIn('Decision', 'vote'),
			...ownProps
		}
	},
	// dispatch to props
	(dispatch) => ({
		nextVideo() {
			dispatch(nextVideo())
		},
		vote(boolean) {
			dispatch(vote(boolean))
		}
    })
)
class Decision extends Component {
	render() {
		const { decision, className, decisionVote, vote, nextVideo, ...rest } = this.props
		return 	<div className={'Decision ' + className}>
					{/*<Icon
						name="thumbs-up"
						hoverIcon='thumbs-o-up'
						onClick={vote.bind(this, true)} />*/}
					<Icon
						onClick={nextVideo}
						name="step-forward" />
					{/*<Icon
						name="thumbs-down"
						hoverIcon='thumbs-o-down'
						onClick={vote.bind(this, false)} />*/}
				</div>
	}
}
// TODO
Decision.propTypes = {
	// content: PropTypes.object.isRequired,
	// decision: PropTypes.object.isRequired,
	// vote: PropTypes.func.isRequired,
}

export default Decision