import React from 'react'
import {useSelector} from 'react-redux'
import Message from './Message'

export default () => {
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    
    return (
        <div>
            <h1>Messages</h1>
            {
                selectedConversation.messages && selectedConversation.messages.map(message => <Message message={message}/>)
            }
        </div>
    )
}