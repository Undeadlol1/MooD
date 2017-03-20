import { handleActions } from 'redux-actions'
import { toastr } from 'react-redux-toastr'
import { recieveMood, recieveMoods, fetchingInProgress
, fetchingError } from '../actions/MoodActions'

const initialState = 	{
							moods: [],
							Nodes: [],
							loading: false,
							// mood: {},
							// error: '',
							// moodName: '', // do i use this?
						}

// export default handleActions({
//   [recieveMood]: (state, action) => ({
//     // counter: state.counter + action.payload
//   }),

//   [recieveMoods]: (state, action) => ({
//     // counter: state.counter - action.payload
//   }),

//   [fetchingInProgress]: (state, action) => ({
//     // counter: state.counter + action.payload
//   })
// }, initialState);

export default (state = initialState, {type, payload}) => {
	let newState = state
// console.log('payload', payload);
	switch(type) {
		case 'RECIEVE_MOODS':
			newState = Object.assign({}, state, {
				moods: payload,
				loading: false
			})
			break
		case 'RECIEVE_MOOD':
			newState = Object.assign({}, state,
			{ ...payload },
			{ loading: false })
			break
		case 'INSERT_MOOD_SUCCES':
			newState = Object.assign({}, state, {
				moods: [...state.moods, payload.mood],
				loading: false
			})
			break
		case 'FETCHING_IN_PROGRESS':
			newState = Object.assign({}, state, {
				loading: true
			})
			break
		// case 'FETCHING_ERROR': // TODO add this
		// case 'RECIEVE_MOOD_CONTENT':
		// 	newState = Object.assign({}, state, {
		// 		mood: action.mood,
		// 		content: action.content,
		// 		// decision: action.decision,
		// 		loading: false
		// 	})
		// 	break
	}
	// console.log('newState', newState);
	return newState
}