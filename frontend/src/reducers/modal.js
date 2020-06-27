const modal = (state = {
    videoModal: false,
    recipientModal: false,
    userInformation: {}
}, {type, payload}) => {
    switch(type){    
        case "OPEN_VIDEO_MODAL":
            return {
                ...state,
                recipientModal: false,
                // userInformation: {},
                videoModal: true
            }
        case "CLOSE_VIDEO_MODAL":
            return {
                ...state,
                userInformation: {},
                videoModal: false
            }
        case "OPEN_RECIPIENT_MODAL":
            return {
                ...state,
                recipientModal: true,
                userInformation: payload
            }
        case "CLOSE_RECIPIENT_MODAL":
            return {
                ...state,
                recipientModal: false,
                // userInformation: {}
            }
        default: return state
    }
}

export default modal