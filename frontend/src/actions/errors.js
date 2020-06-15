export const setConversationError = (error) => ({
    type: "SET_CONVERSATION_ERROR",
    payload: error
})

export const emptyConversationError = () => ({
    type: "EMPTY_CONVERSATION_ERROR"
})