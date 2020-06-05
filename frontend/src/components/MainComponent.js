import React, {useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import io from 'socket.io-client'
import ConversationContainer from './ConversationContainer'
import SideBarConversationsContainer from './SideBarConversationsContainer'
import {addOrUpdateConversation} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'
import {setSocket} from '../actions/socket'
import apiUrl from '../utils/apiUrl'


export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    // const ENDPOINT = 'localhost:4000'
    // console.log(process.env.NODE_ENV)
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
            console.log('dipped')
            establishSocket.disconnect()
            // establishSocket.emit('disconnect')
            establishSocket.off()
        }
    }, [ENDPOINT])

    return (
        <div className="main-component">
            <SideBarConversationsContainer/>
            <ConversationContainer/>
        </div>
    )
}
