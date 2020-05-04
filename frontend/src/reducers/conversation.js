const conversation = (state = {
    conversations: [],
    selectedConversation: {}
}, {type,payload}) => {
    switch(type){    
        case "SET_CONVERSATIONS":
            return {
                selectedConversation: payload[0],
                conversations: payload
            }
        case "SELECTED_CONVERSATION":
            return {
                ...state,
                selectedConversation: payload
            }
        case "REMOVE_SELECTED_CONVERSATION":
            return {
                ...state,
                selectedConversation: {}
            }
        default: return state
    }
}

export default conversation