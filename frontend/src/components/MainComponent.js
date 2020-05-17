import React, {useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import io from 'socket.io-client'
import ConversationContainer from './ConversationContainer'
import SideBarConversationsContainer from './SideBarConversationsContainer'
import {removeSelectedConversation, addOrUpdateConversation} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'
import {setSocket} from '../actions/socket'
import apiUrl from '../utils/apiUrl'


export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    // const ENDPOINT = 'localhost:4000'
    console.log(process.env.REACT_APP_PRODUCTION_URL)
    const ENDPOINT = apiUrl
    useEffect(() => {
        const establishSocket = io(ENDPOINT)

        establishSocket.emit("online", user)
        establishSocket.on('newConversation', (newConversation) => {
            dispatch(addOrUpdateConversation(removeLoggedInUserFromConversation(newConversation,user)))
        })
        establishSocket.on('existingConversation', (existingConversation) => {
            dispatch(addOrUpdateConversation(removeLoggedInUserFromConversation(existingConversation,user)))
        })
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
            <SideBarConversationsContainer/>
            <ConversationContainer/>
        </div>
    )
}
