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
    //does not account if the conversation includes only the logged in user
    // const usersRefactored = () => {
    //     return users.filter(user => user.email !== loggedInUser.email)
    // }
    // const oneLineUsers = () => {
    //     return 
    // }
    const dispatch = useDispatch()
    return (
        <div onClick={handleConversationSelect}>
            <h3>{users[0].name}</h3>
            <p>{messages[messages.length-1].content}</p>
            {
                typing && <p>Typing...</p>
            }
        </div>
    )
}