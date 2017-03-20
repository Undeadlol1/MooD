import { createAction, createActions } from 'redux-actions'
import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { toastr } from 'react-redux-toastr'

// export const { recieveMood, recieveMoods, fetchingInProgress, fetchingError } = createActions({
//   recieveMood: mood => mood, // object => object
//   recieveMoods: moods => moods,
//   fetchingInProgress: value => value,
//   fetchingError: reason => reason
// })

/**
 * @param {Array} moods
 */
export const recieveMoods = createAction('RECIEVE_MOODS')
/**
 * @param {Object} mood
 */
export const recieveMood = createAction('RECIEVE_MOOD')
/**
 * @param {Boolean} value // TODO add toggle
 */
export const fetchingInProgress = createAction('FETCHING_IN_PROGRESS')
/**
 * @param {String} reason
 */
export const fetchingError = createAction('FETCHING_ERROR', reason => reason)

export const fetchMoods = () => dispatch => {
	dispatch(fetchingInProgress())
	fetch('/api/moods')
		.then(checkStatus)		
		.then(parseJSON)
		.then(data => dispatch(recieveMoods((data))))
}
/**
 * fetch mood by slug
 * @param {String} slug 
 */
export const fetchMood = slug => dispatch => {
	dispatch(fetchingInProgress())
	fetch('/api/moods/' + slug)
		.then(checkStatus)		
		.then(parseJSON)
		// .then(mood => {
		// 	console.log('fetchMood result', mood)
		// 	return mood
		// })
		.then(mood => dispatch(recieveMood((mood))))
}
/**
 * create mood
 * @param {String} name mood name
 */
export const insertMood = name => dispatch => {
	dispatch(fetchingInProgress())
	fetch('/api/moods', headersAndBody({ name }))
		.then(checkStatus)
		.then(() => dispatch(fetchMoods()))
}