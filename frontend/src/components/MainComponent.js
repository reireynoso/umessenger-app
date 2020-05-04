import React from 'react'
import {useDispatch} from 'react-redux'
import ConversationContainer from './ConversationContainer'
import SideBarConversationsContainer from './SideBarConversationsContainer'
import {removeSelectedConversation} from '../actions/conversation'

export default () => {
    const dispatch = useDispatch()
    return (
        <div>
            <h1>Main Component</h1>
            <button onClick={() => dispatch(removeSelectedConversation())}>New</button>
            <SideBarConversationsContainer/>
            <ConversationContainer/>
        </div>
    )
}
