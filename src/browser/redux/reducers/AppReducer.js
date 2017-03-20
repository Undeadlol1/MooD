// TODO this is a mess, reworking needed
const initialState =	{
                            error: '',
                            loading: true,
                        }

export default (state = initialState, action) => {
	let newState = state
	
	switch(action.type) {
		case 'INSERT_MOOD_SUCCES':
			newState = Object.assign({}, state, {
				moods: [...state.moods, action.mood],
				loading: false
			})
			break
		case 'CHANGE_RATING':
			newState = Object.assign({}, state, {rating: action.rating})
			break
		case 'RECIEVE_MOOD_CONTENT':
			newState = Object.assign({}, state, {
				mood: action.mood,
				content: action.content,
				// decision: action.decision,
				loading: false
			})
			break
	}

	return newState
}