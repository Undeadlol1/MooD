// TODO add immutable
const decisionStructure = {
								rating: '',
								UserId: '',
								NodeId: '',
								MoodId: '',
								vote: null,
								NodeRating: '',
								nextViewAt: '',
							}

const nodeStructure = 	{
							id: '',
							url: '',
							UserId: '',
							MoodId: '',
							rating: '',
							type: '',
							provider: '',
							contentId: '',
							Decision: decisionStructure
						}
const initialState = 	{
							error: '',
							loading: true,
							dialogIsOpen: false,
							searchIsActive: false, // TODO do i need this?
							searchedVideos: [],
							...nodeStructure
						}

export default (state = initialState, {type, payload}) => {
	let newState = state

	switch(type) {
		case 'FETCHING_NODE':
			newState = Object.assign({}, state, {
					loading: true
			})
		case 'RECIEVE_NODE':
			newState = Object.assign({}, state, payload || initialState, {
				loading: false
			})
			break
		case 'UPDATE_NODE':
			newState = Object.assign({}, state, payload)
			break
		case 'TOGGLE_DIALOG':
			newState = Object.assign({}, state, {
				dialogIsOpen: !state.dialogIsOpen
			})
			break
		case 'UNLOAD_NODE':
			newState = Object.assign({}, state, nodeStructure)
			break
		case 'RECIEVE_SEARCHED_VIDEOS':
			newState = Object.assign({}, state, {
				searchIsActive: false,
				searchedVideos: payload
			})
			break
	}

	return newState
}