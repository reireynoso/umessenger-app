import {setConversations} from './conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'

export const setUser = (userObj) => ({
    type: "SET_USER",
    payload: userObj
})

export const fetchAutoLogin = (token) => dispatch => {
    fetch(`http://localhost:4000/users/auto_login`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(userData => {
        if(userData.errors){
            return userData.errors
        }
        const {conversations, ...user} = userData
        dispatch(setUser(user))
        dispatch(setConversations(removeLoggedInUserFromConversation(conversations,user)))
        // console.log(removeLoggedInUserFromConversation(conversations,user))
    })
}

export const fetchUser = (route, userInfo) => dispatch => {
    // console.log(userInfo)
    return fetch(`http://localhost:4000/users/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then(res => res.json())
    .then(userData => {
        if(userData.errors){
            return userData
        }
        localStorage.setItem("token", userData.token)
        const {conversations, ...user} = userData.user
        dispatch(setUser(user))
        dispatch(setConversations(removeLoggedInUserFromConversation(conversations,user)))
        // dispatch(setConversations(conversations))
        // return "loggedIn"
    })
} 
