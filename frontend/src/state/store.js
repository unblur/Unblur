import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

// Setup for redux-devtools. Everyone on the team should probably install it
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(thunk))
)
