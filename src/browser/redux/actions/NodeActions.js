import selectn from 'selectn'
import { stringify } from 'query-string'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'

const {API_URL} = process.env
const nodesUrl = API_URL + 'nodes/'
const decisionsUrl = API_URL + 'decisions/'
const externalsUrl = API_URL + 'externals/search/'

export const actions = createActions({
  UNLOAD_NODE: () => null,
  UNLOAD_NODES: () => null,
  REMOVE_NODE: id => id,
  TOGGLE_DIALOG: () => null,
  ADD_NODE: node => node,
  RECIEVE_NODE: node => node,
  RECIEVE_NODE: node => node,
  RECIEVE_NODES: nodes => nodes,
  UPDATE_NODE: object => object,
  UPDATE_DECISION: decision => decision,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})
/**
 * Play next video.
 * This function selects next object from "nodes" array
 * or selects first if there is no more items in array
 */
export const nextVideo = () => (dispatch, getState) => {
	console.log('nextVideo is called!');
	const 	state = getState().node,
			nodes = state.get('nodes'),
			currentNode = nodes.find(node => {
				return node.get('id') == state.get('id')
			}),
			position = nodes.indexOf(currentNode),
			nextNode = nodes.get(position + 1)
	console.log('nodes: ', nodes.toJS());
	console.log('currentNode: ', currentNode && currentNode.toJS());
	console.log('nextNode: ', nextNode && nextNode.toJS());
	console.log('position: ', position);

	if (nextNode) return dispatch(actions.recieveNode(nextNode))
	else {
		// if there is only one node in array make sure it merges into state
		// and is detected by video/audio player again
		// dispatch(actions.unloadNode()) // unload
		return dispatch(actions.recieveNode(nodes.get(0))) // and load again
	}
}
/**
 * create a node
 * @param {Object} payload content url
 */
export const insertNode = payload => (dispatch, getState) => {
	return fetch(nodesUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			dispatch(actions.addNode(response))
			dispatch(actions.recieveNode(response))
		})
}
/**
 * fetch nodes using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchNodes = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	return fetch(
		nodesUrl + moodSlug,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			/*
				unload node before assigning new one because
				mutability does not load youtube video if node is the same
			*/
			dispatch(actions.unloadNode())
			return dispatch(actions.recieveNodes((data)))
		})
		.catch(err => console.error('fetchNode failed!', err))
}
/**
 * fetch node using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchNode = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	return fetch(
		nodesUrl + moodSlug + '/' + nodeId,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			/*
				unload node before assigning new one because
				mutability does not load youtube video if node is the same
			*/
			dispatch(actions.unloadNode())
			return dispatch(actions.recieveNode((data)))
		})
		.catch(err => console.error('fetchNode failed!', err))
}
/**
 * search youtube videos by string
 * @param {String} query
 */
export const youtubeSearch = query => (dispatch, getState) => {
	return fetch(
			externalsUrl + '?' + stringify({query}),
			{credentials: 'same-origin'},
		)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			return dispatch(actions.recieveSearchedVideos(data))
		})
		.catch(err => console.error('youtubeSearch failed!', err))
}

// TODO: rename function to 'createDecision'
// TODO: add 'deleteDecisions'? Or i can't really delete decisions? How do i undo the vote?
/**
 *
 * Vote for node.
 * (this means create a Decisions for it)
 * If vote value is undefined this means user decided to undo his vote
 * @param {Boolean} boolean value to set in Decision.vote
 * @export
 */
export const vote = boolean => (dispatch, getState) => {
	const { node } = getState()
	let payload = {}
	payload.NodeId = node.get('id')
	payload.id = node.getIn(['Decision', 'id'])
	payload.vote = boolean
	return
	fetch(decisionsUrl, headersAndBody(payload, payload.id ? 'PUT' : 'POST'))
	.then(checkStatus)
	.then(parseJSON)
	.then(({vote, NodeId}) => {
		if (vote) dispatch(actions.updateNode({Decision: {vote}}))
		else {
			dispatch(actions.removeNode(NodeId))
			dispatch(nextVideo())
		}
	})
	.catch(error => console.error(error))
}
/**
 * Create decision
 * @param {Object} payload POST request body
 * @param {string} payload.NodeId node id
 * @param {boolean} payload.vote upvote or downvote
 * @param {function} [callback] optional callback function
 * @export
 */
export const createDecision = (payload, callback) => (dispatch, getState) => {
	return fetch(
		decisionsUrl,
		headersAndBody(payload, 'POST')
	)
	.then(checkStatus)
	.then(parseJSON)
	.then((Decision) => {
		dispatch(actions.updateNode({Decision}))
		callback && callback(Decision)
	})
	.catch(error => console.error('createDecision failed', error))
}
/**
 * Delete decision.
 * @param {string} decisionId decision.id
 * @param {function} [callback] optional callback function
 * @export
 */
export const deleteDecision = (decisionId, callback) => (dispatch, getState) => {
	return fetch(
		decisionsUrl + decisionId,
		headersAndBody(undefined, 'DELETE')
	)
	.then(checkStatus)
	.then(() => {
		dispatch(actions.updateNode({Decision: {}}))
		callback && callback()
	})
	.catch(error => console.error('deleteDecision failed', error))
}
/**
 * Update decision.
 * Also updates 'node.Decision' in 'nodes' array.
 * @param {string} decisionId decision.id
 * @param {Object} payload fields to update
 * @param {boolean} payload.vote Decision.vote
 * @param {function} [callback] optional callback function
 * @export
 */
export const updateDecision = (decisionId, payload, callback) => (dispatch, getState) => {
	// if user disliked node remove it from nodes array and play next video
	if (payload.vote === false) {
		const NodeId = getState().node.get('id')
		// TODO: check if removeing of node is needed
		// NOTE: do we uload node in "nextVideo" function and in reducer?
		dispatch(actions.removeNode(NodeId))
		dispatch(nextVideo())
	}
	return fetch(
		decisionsUrl + decisionId,
		headersAndBody(payload, 'PUT')
	)
	.then(checkStatus)
	.then(parseJSON)
	.then(updatedDecision => {
		dispatch(actions.updateNode({Decision: updatedDecision}))
		callback && callback(updatedDecision)
	})
	.catch(error => console.error('updateDecision failed', error))
}