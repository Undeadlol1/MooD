import selectn from 'selectn'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { API_URL } from '../../../../config'
import { stringify } from 'query-string'

const moodsUrl = API_URL + 'moods/'
const nodesUrl = API_URL + 'nodes/'
const decisionsUrl = API_URL + 'decisions/'
const externalsUrl = API_URL + 'externals/search/'

export const actions = createActions({
  TOGGLE_DIALOG: () => null,
  RECIEVE_NODE: node => node,
  FETCHING_IN_PROGRESS: () => null,
  FETCHING_ERROR: reason => reason,
  UNLOAD_NODE: () => null,
  RECIEVE_SEARCHED_VIDEOS: videos => videos,
})

/**
 * create a node
 * @param {Object} payload content url 
 */
export const insertNode = payload => (dispatch, getState) => {
	dispatch(actions.fetchingInProgress())
	fetch(nodesUrl, headersAndBody(payload))
		.then(checkStatus)	
		.then(parseJSON)		
		.then(function(response) {
			dispatch(actions.toggleDialog())
			const {node} = getState()
			if(!node.id) dispatch(actions.recieveNode(response))
		})
}

/**
 * fetch node using mood slug
 * @param {String} slug mood slug (optional)
 */
export const fetchNode = slug => (dispatch, getState) => {
	const state = getState()
	const nodeId = state.node.id
	const moodSlug = slug || state.mood.get('slug')

	dispatch(actions.fetchingInProgress())

	fetch(
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
			dispatch(actions.recieveNode((data)))
		})
		.catch(err => console.error('fetchNode failed!', err))
}

/**
 * change Node's Decision rating
 * @param {Object} payload DecisionId:string and rating:number
 */
export const changeRating = payload => (dispatch, getState) => {
	// if (payload.rating <= 3) dispatch(requestNewVideo()) // TODO add this
	if (!payload.NodeId) payload.NodeId = selectn('node.id', getState()) // TODO rework this
	fetch(decisionsUrl, headersAndBody(payload))
		.then(checkStatus)
}

/**
 * search youtube videos by string
 * @param {String} query 
 */
export const youtubeSearch = query => (dispatch, getState) => {
	fetch(externalsUrl + '?' + stringify({query}))
		.then(checkStatus)
		.then(parseJSON)
		.then(data => {
			dispatch(actions.recieveSearchedVideos(data))
		})
		.catch(err => console.error('youtubeSearch failed!', err))
}