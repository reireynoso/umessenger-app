import React, {useState,useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {selectedConversation as selectConversation} from '../actions/conversation'

export default ({conversation, conversation: {messages, users}}) => {
    const [typing, setTyping] = useState("")
    const socket = useSelector(state => state.socket)
    
    // applies to all conversaton instances
    useEffect(() => {
        // console.log('select')
        // console.log(selectConversation)
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
            //     socket.emit('disconnect')
            //     socket.off()
            // }
        }
    }, [])

    //does not account if the conversation includes only the logged in user
    // const usersRefactored = () => {
    //     return users.filter(user => user.email !== loggedInUser.email)
    // }
    // const oneLineUsers = () => {
    //     return 
    // }
    const dispatch = useDispatch()
    return (
        <div onClick={() => dispatch(selectConversation(conversation))}>
            <h3>{users[0].name}</h3>
            <p>{messages[messages.length-1].content}</p>
            {
                typing && <p>Typing...</p>
            }
        </div>
    )
}