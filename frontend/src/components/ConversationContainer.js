import React from 'react'
import Recipient from './Recipient'
import MessagesContainer from './MessagesContainer'
import MessageInput from './MessageInput'

export default () => {

    return (
        <div className="conversation">
            <Recipient/>
            <MessagesContainer/>
            <MessageInput/>  
        </div>
    )
}
