const conversation = (state = {
    conversations: [],
    selectedConversation: {},
    emails: [],
    searchConversation: ""
}, {type,payload}) => {
    // const onlyEmails = selectedConversation.users.map(user => user.email)
    switch(type){    
        case "SET_CONVERSATIONS":
            let initialPayload = (payload[0] ? payload[0].users : false) || []
            return {
                selectedConversation: payload[0] || {},
                conversations: payload,
                emails: initialPayload.map(user => user.email),
                searchConversation: ""
            }
        case "ADD_OR_UPDATE_CONVERSATION":
            //remove the old conversation if it exists,
            //add updated/new conversation to the beginning of the array
            const removeOld = state.conversations.filter(conversation => conversation._id!==payload._id)
            const updatedConversations = [payload, ...removeOld]
            const previousSelectedConversation = updatedConversations.find(conversation => conversation._id === state.selectedConversation._id) || payload
            
            if(removeOld.length !== state.conversations){
                return {
                    ...state,
                    //if selectedConversation is empty, automatically redirect to the new
                    // selectedConversation: (Object.keys(state.selectedConversation).length === 0 ? payload : state.selectedConversation),
                    conversations: updatedConversations,
                    emails: previousSelectedConversation.users.map(user => user.email)
                }
            }
            return {
                ...state,
                // selectedConversation: (Object.keys(state.selectedConversation).length === 0 ? payload : state.selectedConversation),
                conversations: updatedConversations,
                emails: previousSelectedConversation.users.map(user => user.email)
            }
        case "SELECTED_CONVERSATION":
            return {
                ...state,
                selectedConversation: payload,
                emails: payload.users.map(user => user.email)
            }
        case "NEW_MESSAGE":
            return {
                ...state,
                selectedConversation: payload._id === state.selectedConversation._id ? payload : state.selectedConversation,
                // emails: payload.users.map(user => user.email)
            }
        case "REMOVE_SELECTED_CONVERSATION":
            // debugger
            return {
                ...state,
                selectedConversation: {},
                //check if there's a previous selected convo, if not, keep the emails to avoid retyping
                emails: !!state.selectedConversation.users ? (payload ? [payload] : []) : [...state.emails],
            }
        case "RESET_CONVERSATIONS":
            return {
                conversations: [],
                selectedConversation: {},
                emails: [],
                searchConversation: ""
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
        case "SET_SEARCH_TERM":
            return {
                ...state,
                searchTerm: payload
            }
        case "SET_REACTION" :
            const updatedConversationsReactions = state.conversations.map(conversation => {
                if(conversation._id === payload._id){
                    return payload
                }
                return conversation
            })
            return {
                ...state,
                selectedConversation: payload._id !== state.selectedConversation._id ? state.selectedConversation : payload,
                conversations: updatedConversationsReactions,

            }
        default: return state
    }
}

export default conversation