const conversation = (state = {
    conversations: [],
    selectedConversation: {},
    emails: []
}, {type,payload}) => {
    // const onlyEmails = selectedConversation.users.map(user => user.email)
    switch(type){    
        case "SET_CONVERSATIONS":
            let initialPayload = (payload[0] ? payload[0].users : false) || []
            return {
                selectedConversation: payload[0] || {},
                conversations: payload,
                emails: initialPayload.map(user => user.email)
            }
        case "ADD_OR_UPDATE_CONVERSATION":
            //remove the old conversation if it exists,
            //add updated/new conversation to the beginning of the array
            const removeOld = state.conversations.filter(conversation => conversation._id!==payload._id)
            return {
                ...state,
                conversations: [payload, ...removeOld],
                // selectedConversation: payload,
                // emails: payload.users.map(user => user.email)
            }
        case "SELECTED_CONVERSATION":
            return {
                ...state,
                selectedConversation: payload,
                emails: payload.users.map(user => user.email)
            }
        case "REMOVE_SELECTED_CONVERSATION":
            // debugger
            return {
                ...state,
                selectedConversation: {},
                //check if there's a previous selected convo, if not, keep the emails to avoid retyping
                emails: !!state.selectedConversation.users ? [] : [...state.emails],
            }
        case "ADD_EMAIL":
            return {
                ...state,
                emails: [...state.emails,payload]
            }
        case "REMOVE_EMAIL":
            return {
                ...state,
                emails: state.emails.filter(email => email!== payload)
            }
        default: return state
    }
}

export default conversation