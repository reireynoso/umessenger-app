import {removeLoggedInUserFromConversation} from '../selectors/conversation'
import apiUrl from '../utils/apiUrl'

export const addEmail = (email) => ({
    type: "ADD_EMAIL",
    payload: email
})

export const removeEmail = (email) => ({
    type: "REMOVE_EMAIL",
    payload: email
})


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

export const resetConversations = () => ({
    type: "RESET_CONVERSATIONS"
})

export const setSearchConversation = (searchTerm) => ({
    type: "SET_SEARCH_TERM",
    payload: searchTerm
})

export const sendMessageToConversation = (emails,content,user) => dispatch => {
    const token = localStorage.getItem("token")
    return fetch(`${apiUrl}/conversations`, {
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
        if(data.errors){
            // console.log(data.errors)
            return data.errors
        }
        // console.log(removeLoggedInUserFromConversation(data.conversation,user))
        dispatch(addOrUpdateConversation(removeLoggedInUserFromConversation(data.conversation,user)))
    })
}