const modal = (state = {
    videoModal: false,
    recipientModal: false,
    userInformation: {},
    callerInformation: {}
}, {type, payload}) => {
    switch(type){    
        case "OPEN_VIDEO_MODAL":
            return {
                ...state,
                recipientModal: false,
                callerInformation: payload ? payload : {...state.userInformation},
                userInformation: {},
                videoModal: true
            }
        case "CLOSE_VIDEO_MODAL":
            return {
                ...state,
                callerInformation: {},
                // userInformation: {},
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
                userInformation: {}
            }
        // case "SET_CALLER_INFORMATION":
        // return {
        //     ...state,
        //     callerInformation: payload
        // }
        default: return state
    }
}

export default modal