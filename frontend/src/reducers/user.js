const user = (state = {
    loggedIn: false
}, {type,payload}) => {
    switch(type){    
        case "SET_USER":
            return {
                loggedIn: true,
                ...payload
            }
        case "UNSET_USER":
            localStorage.removeItem("token")
            return {
                loggedIn:false
            }
        default: return state
    }
}

export default user