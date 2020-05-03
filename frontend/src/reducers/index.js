import {combineReducers} from 'redux'
import user from './user'
import conversation from './conversation'


const root = combineReducers({
    user,
    conversation
})

export default root