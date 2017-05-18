import selectn from 'selectn'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'

const moodsUrl = process.env.API_URL + 'moods/'
const nodesUrl = process.env.API_URL + 'nodes/'
const decisionsUrl = process.env.API_URL + 'decisions/'

// // TODO add types
// export const recieveNode = createAction('RECIEVE_NODE') // , node => node

// export const fetchingInProgress = createAction('FETCHING_IN_PROGRESS')

// export const toggleDialog = createAction('TOGGLE_DIALOG')

// export const fetchingError = createAction('FETCHING_ERROR', reason => reason)

export const actions = createActions({
  TOGGLE_DIALOG: () => null,
  RECIEVE_NODE: node => node,
  FETCHING_IN_PROGRESS: () => null,
  FETCHING_ERROR: reason => reason,
  UNLOAD_NODE: () => null 
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
 * fetch node using mood slug (url friendly name)
 * @param {String} moodSLug 
 */
export const fetchNode = moodSLug => (dispatch, getState) => {
	
	dispatch(actions.fetchingInProgress())

	const state = getState()
	const slug = selectn('mood.slug', state) // rename to "moodSlug" in future and remove parameter from function
	const nodeId = selectn('node.id', state)

	fetch(
		nodesUrl + (moodSLug || slug) + '/' + nodeId, 
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