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
        dispatch(setUser(userData))
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
        // console.log(userData.user)
        localStorage.setItem("token", userData.token)
        dispatch(setUser(userData.user))
        // return "loggedIn"
    })
} 
