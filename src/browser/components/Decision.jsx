import React, { Component, PropTypes } from 'react'
import { Button, Icon } from 'react-materialize' // TODO rework this
import Slider from 'material-ui/Slider';
import { injectProps } from 'relpers';
import { connect } from 'react-redux';
// import { changeRating } from '../redux/main';
import { changeRating } from '../redux/actions/NodeActions'
import InputRange from 'react-input-range';
import selectn from 'selectn'

// TODO rework this. This is a mess

@connect(
	// state to props
	({ node }, ownProps) => ({ decision: node.Decision, ...ownProps }),
	// dispatch to props
	(dispatch) => ({
		changeRating(payload) {
			console.log('rating', payload)
			dispatch(changeRating(payload))
		}
    })
)
class Decision extends Component {

	state = { rating: 0 } // do i need this?

	// componentWillReceiveProps(nextProps) {
	// 	this.setState({ rating: nextProps.decision ? nextProps.decision.rating : 0 })
	// }

	// TODO get rid of this?
	changeRating(event, rating) {
		// console.log('event', event)
		// const rating = event.target.value // do i need this?
		console.log('rating', rating)
		this.setState({ rating }) // do i need this?
	}

	handleSubmit() {
		const { props, state } = this
		const currentRating = selectn('decision.rating', props)
		const newRating = state.rating
		if (currentRating === newRating) return
		props.changeRating({
			rating: newRating,
			NodeId: selectn('content.NodeId', props)
		})
	}

	// @injectProps
	render() {
		const { decision,  changeRating, ...rest } = this.props
		const styles = { width: '100%' }
		// console.log(this.props);
		// console.log('content && content.rating', content && content.rating);
		/*return (
				<InputRange
					maxValue={20}
					minValue={0}
					style={styles}
					className="Decision"
					value={this.state.value}
					onChange={rating => this.setState({ rating })} />
				);*/
		return 	<Slider
					max={5}
					min={-5}
					step={1}
					style={styles}
					className="Decision"
					onChange={this.changeRating.bind(this)}
					onDragStop={this.handleSubmit.bind(this)}
					value={this.state.rating || decision && decision.rating || 0} />

		return  <p className="range-field Decision" {...rest}>
				  <input
					  max="5"
					  min="-5"
					  type="range"
					  style={styles}
					  onChange={this.changeRating.bind(this)}
					  onMouseUp={this.handleSubmit.bind(this)}
					  value={this.state.rating || decision && decision.rating || 0}
				   />
				</p>
	}
}

Decision.propTypes = {
	// content: PropTypes.object.isRequired,
	// decision: PropTypes.object.isRequired,
	// changeRating: PropTypes.func.isRequired
}

export default Decision