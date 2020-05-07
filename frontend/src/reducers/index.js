import {combineReducers} from 'redux'
import user from './user'
import conversation from './conversation'
import socket from './socket'


const root = combineReducers({
    user,
    conversation,
    socket
})

export default root