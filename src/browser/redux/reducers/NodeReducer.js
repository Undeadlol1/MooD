const decisionStructure = {
								rating: '',
								UserId: '',
								NodeId: '',
								MoodId: '',
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
							...nodeStructure
						}
						
export default (state = initialState, {type, payload}) => {
	let newState = state

	switch(type) {
		case 'RECIEVE_NODE':
			newState = Object.assign({}, state, payload || initialState, {
				loading: false
			})
			// if (!payload) newState = Object.assign({}, state, initialState)
			break
		case 'TOGGLE_DIALOG':
			newState = Object.assign({}, state, {
				dialogIsOpen: !state.dialogIsOpen
			})
			break
		case 'UNLOAD_NODE':
			newState = Object.assign({}, state, nodeStructure)
			break
	}

	return newState
}