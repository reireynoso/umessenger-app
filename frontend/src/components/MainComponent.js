import React from 'react'
import NewConversationForm from './NewConversation'
import SideBarConversationsContainer from './SideBarConversationsContainer'

export default () => {
    return (
        <div>
            <h1>Main Component</h1>
            <SideBarConversationsContainer/>
            <NewConversationForm/>
        </div>
    )
}
