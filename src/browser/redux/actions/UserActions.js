import { checkStatus, parseJSON } from'./actionHelpers'
import { createAction } from 'redux-actions'

/**
 * dispatch succesfully fetched user object
 * @param {Object} user object
 */
export const recieveCurrentUser = createAction('RECIEVE_CURRENT_USER', user => user)

export const removeCurrentUser = createAction('REMOVE_CURRENT_USER')

export const fetchingInProgress = createAction('FETCHING_IN_PROGRESS')

export const fetchingError = createAction('FETCHING_ERROR', error => error)

export const fetchCurrentUser = () => dispatch => {
	dispatch(fetchingInProgress())
	fetch('/current_user', {credentials: 'same-origin'})
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('fetchCurrentUser failed!', err))
		// .catch(err => Materialize.toast(`Ошибка! ${err.reason}`, 4000)) // TODO add client side error handling
}

export const logoutCurrentUser = () => dispatch => {
	dispatch(fetchingInProgress())	
	fetch('/auth/logout', {credentials: 'same-origin'})
		.then(() => dispatch(removeCurrentUser())) // TODO refactor without arrow function?
		.catch(err => console.error('logoutCurrentUser failed!', err))
}