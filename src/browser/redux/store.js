import { createStore, applyMiddleware } from 'redux'
 // TODO is it even used?
import thunk from 'redux-thunk'
import rootReducer from './reducers/RootReducer'

const reduxDevtools =   process.env.BROWSER && process.env.NODE_ENV == 'development'
                        ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                        : {}
                        
const store =   createStore(
                    rootReducer,
                    reduxDevtools,
                    applyMiddleware(thunk) // TODO do i use this?
                ) // thunk, promise, // TODO add dev variable to redux devtools

export default store