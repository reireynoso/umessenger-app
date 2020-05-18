import React from 'react'
import Recipient from './Recipient'
import MessagesContainer from './MessagesContainer'
import MessageInput from './MessageInput'

export default () => {

    return (
        <div>
            <div>
                <Recipient/>
            </div>
            <div>
                <MessagesContainer/>
            </div>
            <div>
                <MessageInput/>  
            </div>
        </div>
    )
}
