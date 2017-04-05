import { isEmpty } from 'lodash'
import { Map } from 'immutable'

const emptyUserObject = {
	id: '',
	image: '',
	username: '',
	vk_id: '',
	facebook_id: '',
	twitter_id: '',
}

const initialState = Map({
	...emptyUserObject,
	loginIsOpen: false,
	isFetching: false,
})

export default (state = initialState, { type, payload }) => {
	switch(type) {
		case 'FETCHING_IN_PROGRESS':
			return state.set('isFetching', true)
		case 'RECIEVE_CURRENT_USER':
			return state.merge({
				...payload,
				isFetching: false,
				loginIsOpen: isEmpty(payload) && state.get('isFetching') && state.get('loginIsOpen')
			})
		case 'REMOVE_CURRENT_USER':
			return state.merge(emptyUserObject)
		case 'TOGGLE_LOGIN_DIALOG':
			return state.set('loginIsOpen', payload)
		default:
			return state
	}
}