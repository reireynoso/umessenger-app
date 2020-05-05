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
        case "ADD_OR_UPDATE_CONVERSATION":
            //remove the old conversation if it exists,
            //add updated/new conversation to the beginning of the array
            const removeOld = state.conversations.filter(conversation => conversation._id!==payload._id)
            return {
                conversations: [payload, ...removeOld],
                selectedConversation: payload
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