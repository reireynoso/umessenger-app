export const openVideoModal = () => ({
    type: "OPEN_VIDEO_MODAL"
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