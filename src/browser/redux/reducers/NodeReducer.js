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
							id: '',
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