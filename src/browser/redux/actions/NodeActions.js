import selectn from 'selectn'
import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'

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
	fetch('/api/nodes', headersAndBody(payload))
		.then(checkStatus)	
		.then(function(response) {
			dispatch(actions.toggleDialog())
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
		'/api/nodes/' + (moodSLug || slug) + '/' + nodeId, 
		{ credentials: 'same-origin' }
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => dispatch(actions.recieveNode((data))))
		.catch(err => console.error('fetchNode failed!', err))
}

/**
 * change Node's Decision rating
 * @param {Object} payload DecisionId:string and rating:number
 */
export const changeRating = payload => (dispatch, getState) => {
	// if (payload.rating <= 3) dispatch(requestNewVideo()) // TODO add this
	if (!payload.NodeId) payload.NodeId = selectn('node.id', getState()) // TODO rework this
	fetch('/api/decisions/', headersAndBody(payload))
		.then(checkStatus)
}