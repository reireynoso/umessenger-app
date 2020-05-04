import React from 'react'
import {useDispatch} from 'react-redux'

import {selectedConversation} from '../actions/conversation'

export default ({conversation, conversation: {messages, users}}) => {
    // const oneLineUsers = () => {
    //     return 
    // }
    const dispatch = useDispatch()
    return (
        <div onClick={() => dispatch(selectedConversation(conversation))}>
            <h3>{users[0].name}</h3>
            <p>{messages[messages.length-1].content}</p>
        </div>
    )
}