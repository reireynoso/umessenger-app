import React, {useRef, useState} from 'react'
import Recipient from './Recipient'
import MessagesContainer from './MessagesContainer'
import MessageInput from './MessageInput'

export default () => {
    const recipientRef = useRef(null)
    const messageInputRef = useRef(null)
    const [recipientHeight, setrecipientHeight] = useState(0)
    const [messageInputHeight, setmessageInputHeight] = useState(0)

    return (
        <div className="conversation">
            <Recipient ref={recipientRef} setrecipientHeight={setrecipientHeight}/>
            <MessagesContainer 
                recipientHeight={recipientHeight}
                messageInputHeight={messageInputHeight}
            />
            <MessageInput ref={messageInputRef} setmessageInputHeight={setmessageInputHeight}/>  
        </div>
    )
}
