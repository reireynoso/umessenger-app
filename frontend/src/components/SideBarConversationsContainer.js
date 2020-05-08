import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import SegmentConversation from './SegmentConversation'

export default () => {
    const conversations = useSelector(state => state.conversation.conversations)
    
    return (
        <div>
            <h2>Converations</h2>
            {
                conversations.map(conversation => <SegmentConversation conversation={conversation}/>)
            }
        </div>
    )
}