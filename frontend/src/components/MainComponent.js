import React, {useEffect, useState, useRef} from 'react'
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
    const [audio] = useState(new Audio('/audio/iphone-ding-sound.mp3'))
    const [playing, setPlaying] = useState(false)

    const music = useRef(null)
    // const ENDPOINT = 'localhost:4000'
    // console.log(process.env.NODE_ENV)
    const ENDPOINT = apiUrl

    const notification = (conversation) => {
        const messages = conversation.messages
        const lastMessage = messages[messages.length-1]
        if(lastMessage.user.email !== user.email){
            setPlaying(true)
            setTimeout(() => {
                setPlaying(false)
            }, 2)
        }
    }
    useEffect(() => {
        if(playing){
            audio.play()
        }
    }, [playing])

    useEffect(() => {
        const establishSocket = io(ENDPOINT)
        establishSocket.emit("online", user)
        establishSocket.on('newConversation', (newConversation) => {
            notification(newConversation)
            dispatch(addOrUpdateConversation(removeLoggedInUserFromConversation(newConversation,user)))
        })
        establishSocket.on('existingConversation', (existingConversation) => {
            notification(existingConversation)
            console.log(existingConversation)
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
            <audio ref={music} src="/audio/sent_message.mp3" allow="autoplay" style={{display:"none"}}/>
            <SideBarConversationsContainer/>
            <ConversationContainer/>
        </div>
    )
}
