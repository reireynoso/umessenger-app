export const setUser = (userObj) => ({
    type: "SET_USER",
    payload: userObj
})

export const fetchAutoLogin = (token) => {
    fetch(`localhost:4000/users/auto_login`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(userData => {
        if(userData.errors){
            return userData.errors
        }
        dispatch(setUser(user))
    })
}
