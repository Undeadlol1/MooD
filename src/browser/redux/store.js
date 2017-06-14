import thunk from 'redux-thunk'
import rootReducer from './reducers/RootReducer'
import { createStore, applyMiddleware } from 'redux'

const reduxDevtools =   process.env.BROWSER && process.env.NODE_ENV == 'development'
                        ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                        : {}

const store =   createStore(
                    rootReducer,
                    reduxDevtools,
                    applyMiddleware(thunk),
                )

export default store