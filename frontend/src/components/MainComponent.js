import React, {useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import io from 'socket.io-client'
import ConversationContainer from './ConversationContainer'
import SideBarConversationsContainer from './SideBarConversationsContainer'
import {removeSelectedConversation} from '../actions/conversation'
import {setSocket} from '../actions/socket'


export default () => {
    const dispatch = useDispatch()
    const socket = useSelector(state => state.socket)
    const ENDPOINT = 'localhost:4000'
    useEffect(() => {
        const establishSocket = io(ENDPOINT)
        dispatch(setSocket(establishSocket))
        return () => {
            establishSocket.emit('disconnect')
            establishSocket.off()
        }
    }, [ENDPOINT])

    return (
        <div>
            <h1>Main Component</h1>
            <button onClick={() => dispatch(removeSelectedConversation())}>New</button>
            <SideBarConversationsContainer socket={socket}/>
            <ConversationContainer/>
        </div>
    )
}
