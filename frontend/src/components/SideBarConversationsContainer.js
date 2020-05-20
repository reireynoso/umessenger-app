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
            <div className="side-bar__header">
                <button className="button button__log-out" onClick={() => dispatch(logOutUser())}>Log Out</button>
                <div className="side-bar__action">
                    <input className="text_input" type="text"/>
                    <button className="button button__primary" onClick={() => dispatch(removeSelectedConversation())}>New</button>
                </div>
            </div>
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