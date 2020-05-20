import {setConversations} from './conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'
import apiUrl from '../utils/apiUrl'

export const setUser = (userObj) => ({
    type: "SET_USER",
    payload: userObj
})

export const logOutUser = () => ({
    type: "UNSET_USER"
})

export const fetchAutoLogin = (token) => dispatch => {
    fetch(`${apiUrl}/users/auto_login`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(userData => {
        if(userData.errors){
            return userData.errors
        }
        console.log(userData)
        const {conversations, ...user} = userData
        dispatch(setUser(user))
        dispatch(setConversations(removeLoggedInUserFromConversation(conversations,user)))
        // console.log(removeLoggedInUserFromConversation(conversations,user))
    })
}

export const fetchUser = (route, userInfo) => dispatch => {
    // console.log(userInfo)
    const headers = () => {
        if(route === "signup"){
            return {
                method: "POST",
                body: userInfo
            }
        }
        else if(route === "login"){
            return {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userInfo)
            }
        }
    }
    return fetch(`${apiUrl}/users/${route}`, headers())
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
