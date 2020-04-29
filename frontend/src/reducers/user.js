const user = (state = {
    loggedIn: false
}, {type,payload}) => {
    switch(type){
        case "SET_USER":
            return {
                loggedIn: true,
                ...payload
            }
        default: return state
    }
}

export default user