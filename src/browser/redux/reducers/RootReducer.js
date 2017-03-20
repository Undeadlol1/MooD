import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as toastr } from 'react-redux-toastr'

import global from './AppReducer'
import user from './UserReducer'
import mood from './MoodReducer'
import node from './NodeReducer'

// export default combineReducers({ ...global, ...user, ...mood, ...node, form, routing, toastr })
export default combineReducers({ global, user, mood, node, form, routing, toastr })
// const combinedReducer = {
//     global,
//     user,
//     mood,
//     node
// }
// export default combineReducers({ app: combinedReducer, form, routing, toastr })
