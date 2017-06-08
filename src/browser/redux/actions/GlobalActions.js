import { checkStatus, parseJSON } from'./actionHelpers'
import { createAction } from 'redux-actions'
import selectn from 'selectn'

// TODO rework to {actions} via redux-actions?

/**
 * toggle header
 * @param {Boolean} payload value to set for headerIsShown
 */
export const toggleHeader = payload => (dispatch, getState) => {
	dispatch({payload, type: 'TOGGLE_SIDEBAR'})
}
/**
 * toggle dialog
 * @param {Boolean} payload value to set for loginIsOpen
 */
export const toggleSidebar = payload => (dispatch, getState) => {
	dispatch({payload, type: 'TOGGLE_SIDEBAR'})
}
/**
 * toggle controls
 * @param {Boolean} payload value to set for controlsAreShown
 */
export const toggleControls = payload => (dispatch, getState) => {
	dispatch({payload, type: 'TOGGLE_CONTROLS'})
}

// TODO check if next two functions are actually used
/**
 * @param {Boolean} value value to set for controlsAreShown
 */
export const openControls = value => (dispatch, getState) => { // TODO rename to "showControls"
	dispatch({
		type: 'TOGGLE_CONTROLS',
		payload: true
	})
}
/**
 * @param {Boolean} value value to set for controlsAreShown
 */
export const closeControls = value => (dispatch, getState) => {
	dispatch({
		type: 'TOGGLE_CONTROLS',
		payload: false
	})
}

