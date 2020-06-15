const errors = (state = {
    conversationError: ""
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
        default: return state
    }
}

export default errors