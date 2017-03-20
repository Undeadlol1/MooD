import selectn from 'selectn'
import { createAction } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
// TODO add types
export const recieveNode = createAction('RECIEVE_NODE') // , node => node

export const insertNodeSuccess = createAction('INSERT_NODE_SUCCES')

export const fetchingInProgress = createAction('FETCHING_IN_PROGRESS')

export const fetchingError = createAction('FETCHING_ERROR', reason => reason)

/**
 * create a node
 * @param {Object} payload content url 
 */
export const insertNode = payload => (dispatch, getState) => {
	dispatch(fetchingInProgress())
	fetch('/api/nodes', headersAndBody(payload))
		.then(checkStatus)	
		.then(function(response) {
			// Materialize.toast('Сохранено!', 4000)
		})
		// .catch(error => {
		// 	console.warn('insertMood!!!');
		// 	console.error(error)
		// 	dispatch(fetchingError(err.reason))
		// })
}

/**
 * fetch node using mood slug (url friendly name)
 * @param {String} moodSLug 
 */
export const fetchNode = moodSLug => dispatch => {
	dispatch(fetchingInProgress())
	fetch('/api/nodes/' + moodSLug)
		.then(checkStatus)
		.then(parseJSON)
		.then(data => dispatch(recieveNode((data))))
		.catch(err => console.error('fetchNode failed!', err))
		// .catch(err => Materialize.toast(`Ошибка! ${err.reason}`, 4000)) // TODO add client side error handling
}

/**
 * change Node's Decision rating
 * @param {Object} payload DecisionId:string and rating:number
 */
export const changeRating = payload => (dispatch, getState) => {
	// if (payload.rating <= 3) dispatch(requestNewVideo()) // TODO add this
	if (!payload.NodeId) payload.NodeId = selectn('mood.Nodes[0].id', getState()) // TODO rework this
	// console.log('getState', (getState()); // 
	console.log('changeRating payload', payload);
	fetch('/api/decisions/', headersAndBody(payload))
		.then(checkStatus)
		// .then(parseJSON)
		// .then(data => {
		// 	console.log('changeRating response data', data);
		// 	dispatch(recieveNode((data)))
		// })
		.catch(err => console.error('fetchNode failed!', err))
	// 	// .catch(err => Materialize.toast(`Ошибка! ${err.reason}`, 4000)) // TODO add client side error handling
}