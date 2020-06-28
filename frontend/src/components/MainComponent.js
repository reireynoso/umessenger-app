import React, {useEffect, useState, useRef} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import io from 'socket.io-client'
import ConversationContainer from './ConversationContainer'
import SideBarConversationsContainer from './SideBarConversationsContainer'
import {addOrUpdateConversation} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'
import {setSocket} from '../actions/socket'
import apiUrl from '../utils/apiUrl'

import VideoModal from './VideoModal'

import {setReceivingCall,setCaller,setCallAccepted, unsetReceivingCall,declineCallAction} from '../actions/video-chat'
import {openVideoModal} from '../actions/modal'

export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const videoModal = useSelector(state => state.modal.videoModal)
    const [audio] = useState(new Audio('/audio/iphone-ding-sound.mp3'))
    const [playing, setPlaying] = useState(false)

    const {receivingCall, caller} = useSelector(state => state.videoChat)

    // const [caller, setCaller] = useState("")
    // const [recievingCall,setRecievingCall] = useState(false)
    // const [callerSignal, setCallerSignal] = useState()
    // const [callAccepted, setCallAccepted] = useState()

    const music = useRef(null)
    // const ENDPOINT = 'localhost:4000'
    // console.log(process.env.NODE_ENV)
    const ENDPOINT = apiUrl

    const notification = (conversation) => {
        const messages = conversation.messages
        const lastMessage = messages[messages.length-1]
        if(lastMessage.user.email !== user.email && !playing){
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
            dispatch(addOrUpdateConversation(removeLoggedInUserFromConversation(existingConversation,user)))
        })

        //being called functionality
        establishSocket.on('calling', (data) => {
        //    console.log(data)
           dispatch(setReceivingCall())
           dispatch(setCaller(data))
          
        //    setRecievingCall(true)
        //    setCaller(data.from.name)
        //    setCallerSignal(data.signal)
        })
        dispatch(setSocket(establishSocket))
        return () => {
            console.log('dipped')
            establishSocket.disconnect()
            // establishSocket.emit('disconnect')
            establishSocket.off()
        }
    }, [ENDPOINT])

    const acceptCall = () => {
        // setCallAccepted(true)
        dispatch(setCallAccepted())
        dispatch(openVideoModal(caller))
        // dispatch(unsetReceivingCall())
        // const peer = new peer({
        //     initiator: false,
        //     trickle: false,
        //     // stream: stream
        // })
    }

    const declineCall = () => {
        console.log('something')
        dispatch(declineCallAction())
    }

    return (
        <div className="main-component">
            <audio ref={music} src="/audio/sent_message.mp3" allow="autoplay" style={{display:"none"}}/>
            
            {
                videoModal && <VideoModal/>
            } 
            <SideBarConversationsContainer/>
            <ConversationContainer/>
        
            {
                receivingCall && <div className="test">
                    <h1>{caller.name} is calling you</h1>
                    <button onClick={acceptCall}>Accept</button>
                    <button onClick={declineCall}>Decline</button>
                </div>
            }
        </div>
    )
}
