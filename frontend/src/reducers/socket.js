const socket = (state = {}, {type,payload}) => {
    switch(type){    
        case "SET_SOCKET":
            return payload
        case "UNSET_SOCKET":
            return {}
        default: return state
    }
}

export default socket