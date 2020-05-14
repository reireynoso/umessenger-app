import React, {useState,useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {selectedConversation as selectConversationAction} from '../actions/conversation'

export default ({conversation, conversation: {messages, users}}) => {
    const [typing, setTyping] = useState("")
    const socket = useSelector(state => state.socket)
    // const user = useSelector(state => state.user)
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    // applies to all conversaton instances
    useEffect(() => {
        // console.log(selectConversationAction)
        if(socket.io){
            // console.log(users)
            socket.emit('subscribeToConversation', conversation)
            socket.on('typing', ({selectedConversation,content}) => {
                // console.log(content)
                // console.log(selectedConversation)
                // debugger
                //pass is an arg from server that includes the user name and conversation obj for comparison
                if(selectedConversation._id === conversation._id){
                    // console.log(content)
                    // console.log('matcg')
                    // console.log(conversation._id)
                    // console.log(selectedConversation._id)
                    //possible bugs: multiple user typing. One stops but might overwrite the other user still typing
                    setTyping(content)
                }
            })
        }
        return () => {
            // if(socket.on){
            //     // socket.emit('disconnect')
            //     socket.off('typing')
            // }
        }
    }, [])

    const handleConversationSelect = () => {
        if(selectConversation._id !== conversation._id){
            // console.log('hello')
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