import React from 'react'
import {useSelector} from 'react-redux'
import SegmentConversation from './SegmentConversation'

export default () => {
    const conversations = useSelector(state => state.user.conversations)
    // console.log(conversations)
    return (
        <div>
            <h2>Converations</h2>
            {
                conversations.map(conversation => <SegmentConversation conversation={conversation}/>)
            }
        </div>
    )
}