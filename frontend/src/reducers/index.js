import {combineReducers} from 'redux'
import user from './user'
import conversation from './conversation'
import socket from './socket'
import errors from './errors'
import modal from './modal'
import videoChat from './video-chat'


const root = combineReducers({
    user,
    conversation,
    socket,
    errors,
    modal,
    videoChat
})

export default root