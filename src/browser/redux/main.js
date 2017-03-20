function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

export const initialState =	{
								moods: [],
								nodes: [], // TODO rework into Content and make relations (see MoodsList.jsx)
								mood: {},
								content: {},
								decision: {},
								rating: 0,
								error: '',
								loading: true,
								moodName: '', // do i use this?
								current_user: {}
							}

export const recieveMoods = moods => ({
  type: 'RECIEVE_MOODS',
  moods
})

export const recieveMoodContent = objects => ({
  type: 'RECIEVE_MOOD_CONTENT',
  ...objects
})

export const fetchingInProgress = () => ({
  type: 'FETCHING_IN_PROGRESS'
})

export const fetchingError = reason => ({
	reason,
	type: 'FETCHING_IN_PROGRESS'
})

export const insertMoodSucces = mood => ({
	mood,
	type: 'INSERT_MOOD_SUCCES'
})

// export const insertMood = () => ({ type: INSERT_MOOD })

// export const insertContent = () => ({ type: INSERT_NODE }

export const fetchMoodContent = slug => dispatch => {
	console.log('fetchMoodContent!!!')
	dispatch(fetchingInProgress())
	$
	.get('/api', {
		type: 'getContent',
		payload: JSON.stringify({slug})
	})
	.done(contentDecision => {
		console.log('contentDecision', JSON.parse(contentDecision))
		dispatch(
			recieveMoodContent(JSON.parse(contentDecision))
		)
	})
	.fail(err => {
		console.error(err)
		dispatch(fetchingError(err.reason))
	})
}

// (rating, id, slug)
export const requestNewVideo = (...params) => dispatch => {
	console.log('requestNewVideo is called!')
	// dispatch(rateContent({...params}))
	$
	.get('/api', {
		type: 'rateContent',
		payload: JSON.stringify({...params})
	})
	.done(moodContentDecision => {
		console.log('moodContentDecision', JSON.parse(moodContentDecision))
		// dispatch(
		// 	recieveMoodContent(JSON.parse(moodContentDecision))
		// )
	})
	.fail(err => dispatch(fetchingError(err.reason)))
	// dispatch(fetchingInProgress())
	// $
	// .get('/api', {
	// 	type: 'getMoodContent',
	// 	payload: JSON.stringify({slug})
	// })
	// .done(moodContentDecision => {
	// 	console.log('moodContentDecision', JSON.parse(moodContentDecision))
	// 	dispatch(
	// 		recieveMoodContent(JSON.parse(moodContentDecision))
	// 	)
	// })
	// .fail(err => dispatch(fetchingError(err.reason)))
}

// export const changeRating = rating => dispatch => {
// 	if (rating <= 3) dispatch(requestNewVideo())
// 	dispatch({
// 		rating: rating,
// 		type: 'CHANGE_RATING'
// 	})
// }

// export const fetchMoods = () => dispatch => {
// 	dispatch(fetchingInProgress())
// 	fetch('/api/moods')
// 		.then(parseJSON)
// 		// .then(data => console.log(data, typeof data))
// 		.then(data => dispatch(recieveMoods((data))))
// 		// do this two methods work?
// 		.catch(err => console.error('fetchMoods failed!', err))
// 		// .catch(err => Materialize.toast(`Ошибка! ${err.reason}`, 4000)) // TODO add client side error handling
// }

// export const insertMood = name => dispatch => {
// 	dispatch(fetchingInProgress())
// 	fetch('/api/moods', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({name}),
// 		credentials: 'same-origin'
// 	})
// 	.then(function(response) {
// 		dispatch(fetchMoods())
//         // Materialize.toast('Сохранено!', 4000)
// 	})
// 	.catch(error => {
// 		console.warn('insertMood!!!');
// 		console.error(error)
//         dispatch(fetchingError(err.reason))
//     })
// }

// export const rateContent = object => dispatch => {
// 	console.log('rateContent object', object)
// 	$
// 	.get('/api', {
// 		type: 'rateContent',
// 		payload: JSON.stringify(object)
// 	})
// 	.done(moodContentDecision => {
// 		console.log('moodContentDecision', JSON.parse(moodContentDecision))
// 		// dispatch(
// 		// 	recieveMoodContent(JSON.parse(moodContentDecision))
// 		// )
// 	})
// 	.fail(err => dispatch(fetchingError(err.reason)))
// }

export const insertContent = (data, callback) => dispatch => {
	console.log('data', data)
	dispatch(fetchingInProgress())
	if (typeof data == 'object') data.userId = Meteor.userId()
	$
	.get('/api', {
		type: 'insertContent',
		payload: JSON.stringify(data)
	})
	// close modal
	.done(() => callback())
	.fail(err => dispatch(fetchingError(err)))
	.error(err => dispatch(fetchingError(err)))
}

export const rootReducer = function(state, action) {
	if(state === undefined) return initialState
	// console.log('action', action)
	let newState = state

	switch(action.type) {
		case 'RECIEVE_MOODS':
			console.log(action.moods);
			newState = Object.assign({}, state, {
				moods: action.moods,
				loading: false
			})
			break
		case 'FETCHING_IN_PROGRESS':
			newState = Object.assign({}, state, {loading: true})
			break
		case 'FETCHING_ERROR':
			Materialize.toast(`Ошибка! ${action.payload}`, 4000)
			newState = Object.assign({}, state, {
				loading: false,
				error: action.payload
			})
			break
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
