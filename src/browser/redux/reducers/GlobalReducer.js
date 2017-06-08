import { fromJS } from 'immutable'
import { isBoolean } from 'lodash'
// TODO this is a mess, reworking needed
// TODO rename to UiReducer
const initialState =	fromJS({
							headerIsShown: true,
							sidebarIsOpen: false,
							controlsAreShown: false,
							// TODO delete this
							error: '', // never used atm
                            loading: true, // change to null?
                        })

export default (state = initialState, { type, payload }) => {
	/**
	 * toggle value in state
	 * @param {any} selector value to update
	 * @returns new state with updated field
	 */
	function toggleElement(selector) {
		// event could passed to this function
		const value = 	isBoolean(payload)
						? payload
						: !state.get(selector)
		return state.set(selector, value)
	}
	switch(type) {
		case 'TOGGLE_HEADER':
			return toggleElement('headerIsShown')
		case 'TOGGLE_SIDEBAR':
			return toggleElement('sidebarIsOpen')
		case 'TOGGLE_CONTROLS':
			return toggleElement('controlsAreShown')
		default:
			return state
	}
}