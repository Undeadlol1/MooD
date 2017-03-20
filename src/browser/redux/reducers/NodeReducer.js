const initialState = 	{
							loading: true,
							error: '',
						}
						
export default (state = initialState, {type, payload}) => {
	let newState = state

	switch(type) {
		case 'RECIEVE_NODE':
			newState = Object.assign({}, state, payload, {
				loading: false
			})
			break
		case 'INSERT_NODE_SUCCESS':
			// newState = Object.assign({}, state, {
			// 	moods: [...state.moods, payload.mood],
			// 	loading: false
			// })
			break
		// case 'RECIEVE_MOOD_CONTENT':
		// 	newState = Object.assign({}, state, {
		// 		mood: action.mood,
		// 		content: action.content,
		// 		// decision: action.decision,
		// 		loading: false
		// 	})
		// 	break
	}

	return newState
}