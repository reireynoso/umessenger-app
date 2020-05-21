import React, {useState, useLayoutEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {selectedConversation as selectConversationAction} from '../actions/conversation'

export default ({conversations,socket, conversation, conversation: {messages, users}}) => {
    const [typing, setTyping] = useState("")
    const user = useSelector(state => state.user)
    const selectConversation = useSelector(state => state.conversation.selectedConversation)

    // applies to all conversaton instances
    // why useLayoutEffect()? -> So React is attaching the socket event for the updated DOM before updated the screen. React will have to wait for this function to finish.
    useLayoutEffect(() => {
        setTyping("") //resets typing field since the order of conversations changes
        socket.emit('subscribeToConversation', conversation)
        socket.on('typing', ({selectedConversation,content}) => {

            //pass is an arg from server that includes the user name and conversation obj for comparison
            if(selectedConversation._id === conversation._id){

                //possible bugs: multiple user typing. One stops but might overwrite the other user still typing
                setTyping(content)
            }
        })
    
        return () => {
            socket.off('typing')
        }
    }, [conversations])

    const handleConversationSelect = () => {
        if(selectConversation._id !== conversation._id){
            // console.log('hello')
            //emits the event to remove this specific user from list of typers to other users' message container
            if(selectConversation){     
                const data = {selectedConversation:selectConversation,user,content:""}    
                socket.emit('typing', data)
                socket.emit('messageTyping', data)
            }
            dispatch(selectConversationAction(conversation))
        }
    }

    const truncate = () => {
        const message = messages[messages.length-1].content
        let shortenedMsg = message.slice(0,18) 
        if(message.length > 18){
            return shortenedMsg + '...'
        }
        return shortenedMsg
    }
    //does not account if the conversation includes only the logged in user
    // const usersRefactored = () => {
    //     return users.filter(user => user.email !== loggedInUser.email)
    // }
    // const oneLineUsers = () => {
    //     return 
    // }
    const dispatch = useDispatch()
    return (
        <div className="segment" onClick={handleConversationSelect}>
            <div className="segment__notification">
                D
            </div>
            <div className="segment__info">
                <img className="segment__image" src="https://cdn2.vectorstock.com/i/1000x1000/01/66/businesswoman-character-avatar-icon-vector-12800166.jpg"/>
                <div className="segment__details">
                    <h4>{users[0].name}</h4>
                    <p>{truncate()}</p>
                    {
                        typing && <p>Typing...</p>
                    }
                </div>
            </div>
        </div>
    )
}