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
  TOGGLE_DIALOG: () => null,
  RECIEVE_NODE: node => node,
  RECIEVE_NODES: nodes => nodes,
  UPDATE_NODE: object => object,
  FETCHING_NODE: () => null,
  FETCHING_ERROR: reason => reason,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

// TODO comments
export const nextVideo = () => (dispatch, getState) => {
	const state = getState().node
	const nodes = state.get('nodes')
	const currentNode = nodes.find(node => {
		return node.get('id') == state.get('id')
	})
	const position = nodes.indexOf(currentNode)
	const nextNode = nodes.get(position + 1)

	if (nextNode) dispatch(actions.recieveNode(nextNode))
	else dispatch(actions.recieveNode(nodes.get(0)))
}

/**
 * create a node
 * @param {Object} payload content url
 */
export const insertNode = payload => (dispatch, getState) => {
	// dispatch(actions.fetchingNode())
	return fetch(nodesUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(function(response) {
			dispatch(actions.toggleDialog())
			const {node} = getState()
			if(!node.get('id')) return dispatch(actions.recieveNode(response))
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

	// dispatch(actions.fetchingNode())

	return fetch(
		nodesUrl + moodSlug,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			/*
				unload node before assigning new one because
				mutability does node load youtube video if node is the same
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

	// dispatch(actions.fetchingNode())

	return fetch(
		nodesUrl + moodSlug + '/' + nodeId,
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			/*
				unload node before assigning new one because
				mutability does node load youtube video if node is the same
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

/**
 * vote for node
 * @param {Boolean} boolean value to set in Decision.vote
 */
export const vote = boolean => (dispatch, getState) => {
	let payload = {}
	payload.NodeId = getState().node.id
	payload.vote = boolean
	fetch(decisionsUrl, headersAndBody(payload))
		.then(checkStatus)
		.then(parseJSON)
		.then(({vote}) => {
			dispatch(actions.updateNode({vote}))
		})
		// TODO
		// .catch(() => {
		// 	dispatch(actions.voteFailure)
		// })
}