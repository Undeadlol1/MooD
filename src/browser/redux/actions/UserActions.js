import { checkStatus, parseJSON, headersAndBody } from'./actionHelpers'
import { createAction, createActions } from 'redux-actions'
import selectn from 'selectn'
import { API_URL } from '../../../../config'

const authUrl = API_URL + 'auth/'
const usersUrl = API_URL + 'users/'

export const actions = createActions({
	/**
	 * dispatch succesfully fetched user object
	 * @param {Object} user object
	 */
	RECIEVE_CURRENT_USER: user => user,
	REMOVE_CURRENT_USER: () => {},
	RECIEVE_FETCHED_USER: user => user,
	REMOVE_FETCHED_USER: () => {},
	FETCHING_IN_PROGRESS: () => {},
	TOGGLE_LOGIN_DIALOG: boolean => boolean,
})
const { fetchingInProgress, removeCurrentUser, recieveCurrentUser } = actions


export const fetchCurrentUser = () => dispatch => {
	dispatch(fetchingInProgress())
	fetch(authUrl + 'current_user', {credentials: 'same-origin'})
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('fetchCurrentUser failed!', err)) // TODO add client side error handling
}

export const logoutCurrentUser = () => dispatch => {
	fetch(authUrl + 'logout', {credentials: 'same-origin'})
		.then(checkStatus)
		.then(() => dispatch(actions.removeCurrentUser())) // TODO refactor without arrow function?
		.catch(err => console.error('logoutCurrentUser failed!', err))
}
/**
 * @param {Boolean} value value to set for loginIsOpen
 */
export const toggleLoginDialog = value => (dispatch, getState) => {
	dispatch(
		actions.toggleLoginDialog(
			value || !getState().user.get('loginIsOpen')
		)
	)
}

export const fetchUser = username => dispatch => {
	dispatch(fetchingInProgress())
	fetch(`${usersUrl}user/${username}`)
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveFetchedUser((user))))
		.catch(err => console.error('fetchUser failed!', err)) // TODO add client side error handling
}
/**
 * update user profile
 * @param {String} username user identifier
 * @param {Object} body profile attributes to update
 */
export const updateUser = (username, body) => dispatch => {
	// dispatch(fetchingInProgress())
	fetch(
		`${usersUrl}user/${username}`,
		headersAndBody({...body}, 'PUT')
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(user => dispatch(recieveCurrentUser((user))))
		.catch(err => console.error('updateUser failed!', err))
}