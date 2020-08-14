export const setConversationError = (error) => ({
    type: "SET_CONVERSATION_ERROR",
    payload: error
})

export const emptyConversationError = () => ({
    type: "EMPTY_CONVERSATION_ERROR"
})

export const setDisconnectedError = () => ({
    type: "SET_DISCONNECTED_ERROR"
})

export const unsetDisconnectedError = () => ({
    type: "UNSET_DISCONNECTED_ERROR"
})