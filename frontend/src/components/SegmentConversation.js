import React from 'react'
import {useDispatch} from 'react-redux'

import {selectedConversation} from '../actions/conversation'

export default ({conversation, conversation: {messages, users}}) => {
    // const loggedInUser = useSelector(state => state.user)

    //does not account if the conversation includes only the logged in user
    // const usersRefactored = () => {
    //     return users.filter(user => user.email !== loggedInUser.email)
    // }
    // const oneLineUsers = () => {
    //     return 
    // }
    const dispatch = useDispatch()
    return (
        <div onClick={() => dispatch(selectedConversation(conversation))}>
            <h3>{users[0].name}</h3>
            <p>{messages[messages.length-1].content}</p>
        </div>
    )
}