const conversation = (state = [], {type,payload}) => {
    switch(type){    
        case "SET_CONVERSATIONS":
            return payload
        default: return state
    }
}

export default conversation