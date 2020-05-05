import {removeLoggedInUserFromConversation} from '../selectors/conversation'

export const setConversations = (conversations) => ({
    type: "SET_CONVERSATIONS",
    payload: conversations
})

export const addOrUpdateConversation = (conversation) => ({
    type: "ADD_OR_UPDATE_CONVERSATION",
    payload: conversation
})

export const selectedConversation = (conversation) => {
    // console.log(conversation)
    return {
        type: "SELECTED_CONVERSATION",
        payload: conversation
    }
}

export const removeSelectedConversation = () => ({
    type: "REMOVE_SELECTED_CONVERSATION"
})

export const sendMessageToConversation = (emails,content,user) => dispatch => {
    const token = localStorage.getItem("token")
    return fetch(`http://localhost:4000/conversations`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            emails,
            content
        })
    })
    .then(res => res.json())
    .then(data => {
        // console.log(removeLoggedInUserFromConversation(data.conversation,user))
        dispatch(addOrUpdateConversation(removeLoggedInUserFromConversation(data.conversation,user)))
    })
}