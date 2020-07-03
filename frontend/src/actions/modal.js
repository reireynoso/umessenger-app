export const openVideoModal = (payload) => ({
    type: "OPEN_VIDEO_MODAL",
    payload
})

export const closeVideoModal = () => ({
    type: "CLOSE_VIDEO_MODAL"
})

export const openRecipientModal = (userInfo) => ({
    type: "OPEN_RECIPIENT_MODAL",
    payload: userInfo
})

export const closeRecipientModal = () => ({
    type: "CLOSE_RECIPIENT_MODAL"
})

export const setCallerInformation = (payload) => ({
    type: "SET_CALLER_INFORMATION",
    payload
})