import {combineReducers} from 'redux'
import user from './user'
import conversation from './conversation'
import socket from './socket'
import errors from './errors'


const root = combineReducers({
    user,
    conversation,
    socket,
    errors
})

export default root