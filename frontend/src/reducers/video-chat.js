const videoChat = (state = {
    // stream: null,
    receivingCall: false,
    caller: {},
    callerSignal: null,
    // callAccepted: false
}, {type,payload}) => {
    switch(type){    
        // case "SET_STREAM":
        //     return {
        //         ...state,
        //         stream: payload
        //     }
        // case "UNSET_RECEIVING_CALL":
        //     return {
        //         ...state,
        //         receivingCall:false
        //     }
        case "SET_CALLER":
            return {
                ...state,
                caller: payload.from,
                callerSignal: payload.signal,
                receivingCall:true
            }
        case "DECLINE_CALL":
            return {
                ...state,
                caller: {},
                callerSignal: null,
                receivingCall: false,
            }
        // case "SET_CALL_ACCEPTED":
        //     return {
        //         ...state,
        //         callAccepted: true
        //     }            
        default: return state
    }
}

export default videoChat