import { checkStatus, parseJSON } from'./actionHelpers'
import { createAction } from 'redux-actions'
import selectn from 'selectn'

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
		.catch(err => console.error('fetchCurrentUser failed!', err)) // TODO add client side error handling
}

export const logoutCurrentUser = () => dispatch => {
	fetch('/auth/logout', {credentials: 'same-origin'})
		.then(() => dispatch(removeCurrentUser())) // TODO refactor without arrow function?
		.catch(err => console.error('logoutCurrentUser failed!', err))
}
/**
 * toggle dialog
 * @param {Boolean} value value to set for loginIsOpen
 */
export const toggleLoginDialog = value => (dispatch, getState) => {
	dispatch({
		type: 'TOGGLE_LOGIN_DIALOG',
		payload: !getState().user.get('loginIsOpen')
	})
}