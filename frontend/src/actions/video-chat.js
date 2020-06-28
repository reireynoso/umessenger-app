export const setStream = (stream) => ({
    type: "SET_STREAM",
    payload: stream
})

export const setReceivingCall = () => ({
    type: "SET_RECEIVING_CALL"
})

export const unsetReceivingCall = () => ({
    type: "UNSET_RECEIVING_CALL"
})

export const setCaller = (data) => ({
    type: "SET_CALLER",
    payload: data
})

export const setCallAccepted = () => ({
    type: "SET_CALL_ACCEPTED"
})

export const declineCallAction = () => ({
    type: "DECLINE_CALL"
})