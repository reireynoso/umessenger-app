import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import SegmentConversation from './SegmentConversation'

import {removeSelectedConversation} from '../actions/conversation'
import {logOutUser} from '../actions/user'

export default () => {
    const dispatch = useDispatch()
    const conversations = useSelector(state => state.conversation.conversations)
    const socket = useSelector(state => state.socket)

    return (
        <div className="side-bar">
            <button onClick={() => dispatch(removeSelectedConversation())}>New</button>
            <button onClick={() => dispatch(logOutUser())}>Log Out</button>
            {
                conversations.map(conversation => 
                    <SegmentConversation 
                        key={conversation._id}
                        conversations={conversations} 
                        socket={socket} 
                        conversation={conversation}
                    />)
            }
        </div>
    )
}