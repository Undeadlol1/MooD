import isEmpty from 'lodash/isEmpty'
import { Map, List } from 'immutable'

const decisionStructure = Map({
								rating: '',
								UserId: '',
								NodeId: '',
								MoodId: '',
								vote: null,
								NodeRating: '',
								nextViewAt: '',
							})

const nodeStructure = 	Map({
							id: null,
							url: '',
							type: '',
							UserId: '',
							MoodId: '',
							rating: '',
							provider: '',
							contentId: '',
							Decision: decisionStructure.toJS()
						})

export const initialState = Map({
							error: '',
							nodes: List(),
							loading: false,
							finishedLoading: true,
							dialogIsOpen: false,
							contentNotFound: false,
							searchIsActive: false, // TODO do i need this?
							searchedVideos: List(),
							...nodeStructure.toJS()
						})

export default (state = initialState, {type, payload}) => {
	switch(type) {
		case 'NEXT_VIDEO':
			// Do nothing if there are no nodes to operate on.
			if (state.get('nodes').size == 0) return state
			const 	nodes = state.get('nodes'),
					currentNodeId = state.get('id'),
					firstNode = state.getIn(['nodes', 0]),
					lastNode = state.get('nodes').last(),
					isLastNode = lastNode.get('id') == currentNodeId
			// If there is no current node, select first one from "nodes" array.
			// Do the same if current node is the last one the array.
			if (!currentNodeId || isLastNode) {
				return state
					// Normalise node values just incase.
					.mergeDeep(nodeStructure)
					.mergeDeep(firstNode)
			}
			// Else find make next node in the array the active one.
			else {
				const	position = nodes.findIndex(node => node.get('id') == currentNodeId),
						nextNode = nodes.get(position + 1)
				return state
					// Normalise node values just incase.
					.mergeDeep(nodeStructure)
					.mergeDeep(nextNode)
			}
		case 'ADD_NODE':
			return  state
				.updateIn(['nodes'], arr => {
					return isEmpty(payload)
						? arr
						: arr.push(Map(payload))
				})
		case 'RECIEVE_NODE':
			return state
				// unload current node just incase
				.mergeDeep(nodeStructure)
				.mergeDeep(payload)
				.merge({
					loading: false,
					contentNotFound: isEmpty(payload),
				})
		case 'RECIEVE_NODES':
			return state
				.mergeDeep({
					...payload[0],
					nodes: payload,
					loading: false,
					contentNotFound: isEmpty(payload),
				})
		/**
		 * Update properties of current node and update node in 'nodes' array
		 */
		case 'UPDATE_NODE':
			// find node's index in nodes array to update further
			const nodeIndex = state.get('nodes').findIndex(i => i.id == payload.id)
			// if node in array was not found do not try to update it
			if (nodeIndex == -1) return state.mergeDeep(payload)
			else return state
				.mergeDeep(payload)
				.mergeDeepIn(['nodes', nodeIndex], payload)
		case 'TOGGLE_DIALOG':
			return state.set('dialogIsOpen', !state.get('dialogIsOpen'))
		case 'UNLOAD_NODES':
			return state.set({nodes: []})
		case 'UNLOAD_NODE':
			return state
				.merge(nodeStructure)
				.mergeDeep({
					loading: false,
					contentNotFound: false,
				})
		// remove node from nodes list
		case 'REMOVE_NODE':
			return state
				.merge({
					nodes: state
							.get('nodes')
							.filter(node => node.get('id') !== payload)
				})
		case 'RECIEVE_SEARCHED_VIDEOS':
			return state.merge({
				searchIsActive: false,
				searchedVideos: payload
			})
		default:
			return state
	}
}