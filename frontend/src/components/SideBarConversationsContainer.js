import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import SegmentConversation from './SegmentConversation'

import {matchConversations} from '../selectors/conversation'
import {removeSelectedConversation, resetConversations, setSearchConversation} from '../actions/conversation'
import {logOutUser} from '../actions/user'
import {truncateString} from '../selectors/conversation'

export default () => {
    const dispatch = useDispatch()
    const conversations = useSelector(state => state.conversation.conversations)
    const socket = useSelector(state => state.socket)
    const user = useSelector(state => state.user)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const searchTerm = useSelector(state => state.conversation.searchTerm)

    const handleLogOut = () => {
        const data = {selectedConversation,user,content:""}
        if(socket.on && selectedConversation){         
            socket.emit('typing', data)
            socket.emit('messageTyping', data)
        }
        dispatch(logOutUser())
        dispatch(resetConversations())
    }
    return (
        <div className="side-bar">
            <div className="side-bar__header">
                
                <button className="button button__log-out" onClick={handleLogOut}>Log Out</button>
                <div className="side-bar__info">Hello👋🏼 , {truncateString(user.name, 13)}</div>
                
                <div className="side-bar__action">
                    <input className="text_input" placeholder="Search for names..." type="text" onChange={(e) => dispatch(setSearchConversation(e.target.value))}/>
                    <button className="button button__primary" onClick={() => dispatch(removeSelectedConversation())}>New</button>
                </div>
            </div>
            <div className="segment-conversation__container">
                {
                    matchConversations(conversations,searchTerm).map(conversation => 
                        <SegmentConversation 
                            key={conversation._id}
                            conversations={conversations} 
                            socket={socket} 
                            conversation={conversation}
                        />)
                }
            </div>
        </div>
    )
}