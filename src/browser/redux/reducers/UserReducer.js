const initialState = { 
	isFetching: false,
}

export default (state = initialState, { type, payload }) => {
	let newState = state
	switch(type) {
		case 'FETCHING_IN_PROGRESS':
			newState.isFetching = true
			break
		case 'RECIEVE_CURRENT_USER':
			newState = Object.assign({},
				state,
				payload, 
				{ isFetching: false }
			)
			break
		case 'REMOVE_CURRENT_USER':
			newState = Object.assign({}, initialState)
			break
	}
	return newState
}