const errors = (state = {
    conversationError: "",
    disconnected: false
}, {type,payload}) => {
    switch(type){    
        case "SET_CONVERSATION_ERROR":
            return {
                ...state,
                conversationError: payload
            }
        case "EMPTY_CONVERSATION_ERROR":
            return {
                ...state,
                conversationError: ""
            }
        case "SET_DISCONNECTED_ERROR":
            return {
                ...state,
                disconnected: true
            }
        case "UNSET_DISCONNECTED_ERROR":
            return {
                ...state,
                disconnected: false
            }
        default: return state
    }
}

export default errors