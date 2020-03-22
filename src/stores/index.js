import {createStore, combineReducers} from 'redux'

import midi from './reducers/midi'

export default createStore(combineReducers({midi}))