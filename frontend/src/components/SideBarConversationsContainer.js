import React from 'react'
import {useSelector} from 'react-redux'
import SegmentConversation from './SegmentConversation'

export default () => {
    const conversations = useSelector(state => state.conversation.conversations)
    const socket = useSelector(state => state.socket)

    return (
        <div>
            <h2>Converations</h2>
            {
                conversations.map(conversation => 
                    <SegmentConversation 
                        conversations={conversations} 
                        socket={socket} 
                        conversation={conversation}
                    />)
            }
        </div>
    )
}