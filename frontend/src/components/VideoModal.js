import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {closeVideoModal} from '../actions/modal'
import {declineCallAction} from '../actions/video-chat'
import {truncateString} from '../selectors/conversation'


import Peer from 'simple-peer'

export default () => {
    const dispatch = useDispatch()

    const {videoModal, callerInformation} = useSelector(state => state.modal)
    const {receivingCall, callerSignal} = useSelector(state => state.videoChat)
    const user = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)

    const [waitUser, setWaitUser] = useState("") 
    const [busy, setBusy] = useState(false) 

    const userVideo = useRef()
    const partnerVideo = useRef()

    let currentStream = useRef(null);

    useEffect(() => {
        // let currentStream;
        socket.on('callEnded', () => {
            const stream = partnerVideo.current.srcObject
            endCall(stream)
            partnerVideo.current.srcObject = null
            // setWaitUser(`${callerInformation.name} ended the call`)
            determine('callEnded')
        })

        socket.on('recepientBusy', () => {
            // const stream = partnerVideo.current.srcObject
            // endCall(stream)
            // partnerVideo.current.srcObject = null
            // setWaitUser(`${callerInformation.name} is busy.`)
            determine('busy')
        })

        // setWaitUser(`Waiting on ${callerInformation.name}`)
        determine()

        if(videoModal){
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            .then(stream => {
                currentStream = stream
                if(userVideo.current){
                    userVideo.current.srcObject = stream
                    
                    if(!receivingCall){
                        return callPeer(currentStream)
                    }
                
                    return acceptCall(currentStream)
                }
            })
            .catch((e) => {
                console.log(e)
            })
        }

        return () => {
            console.log('unmount')
            if(currentStream){
                //returns active media
                endCall(currentStream)
                // currentStream.getTracks().forEach((track) => {
                    // console.log(track)
                    //stops each active media
                //     if(track.readyState === 'live'){
                //         track.stop();
                //     }
                // })
            }

            socket.emit("callEnd", callerInformation)
            // dispatch(declineCallAction())
            socket.off('recepientBusy')
            socket.off("callEnded")
            socket.off("notOnline")
            socket.off("callAccepted")
            socket.off("callDeclined")
        }
    }, [])

    window.onbeforeunload = function() {
        socket.emit("callEnd", callerInformation)
    };

    const acceptCall = (stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", data => {
        //   console.log(data)
            socket.emit("acceptCall", { signal: data, to: callerInformation.email })
        })
    
        peer.on("stream", stream => {
            // console.log(stream)
            setWaitUser(`${callerInformation.name} is online`)
            partnerVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
        
        // dispatch(unsetReceivingCall())
        dispatch(declineCallAction())
    }

    const callPeer = (stream) => {
        let calling = true
        // wrapper around the RTC technology which takes 3 arguments
        const peer = new Peer({
            // whether this person is the initiator of the call
            initiator: true,
            trickle: false,
            //stream is same as the stream requested
            stream: stream
        })

        //sending out signal to other peer. Other peer will accept or deny signal. Creating handshake
        peer.on("signal", data => {
            // console.log('calling')
            // console.log(data)
            if(calling){
                socket.emit("callUser", {
                    userToCall: callerInformation.email, 
                    signalData: data, 
                    from: user
                })
            }
            // janky solution to prevent emitting another callUser event
            calling = false
        })

        peer.on("stream", stream => {
            // setWaitUser(`${callerInformation.name} is online`)
            determine("accepted")
            if(partnerVideo.current){
                partnerVideo.current.srcObject = stream;
            }
        })

        socket.on("callAccepted", signal => {
            peer.signal(signal)
        })

        socket.on("notOnline", () => {
            // console.log('not online')
            determine("notOnline")
            // setWaitUser(`${callerInformation.name} is not online`)
        })

        socket.on("callDeclined", () => {
            // console.log('call declined')
            determine("declined")
            // dispatch(closeVideoModal())
            // setWaitUser(`${callerInformation.name} declined...`)
        })
    }

    const endCall = (stream) => {
        if(stream){
            const tracks = stream.getTracks() 
            tracks.forEach((track) => {           
                //stops each active media
                if(track.readyState === 'live'){
                    track.stop();
                }
            })

            // turn off window after hang up
            setTimeout(() => {
                dispatch(closeVideoModal())
            }, 2500)
        }
    }

    const determine = (result) => {
        switch(result){
            case "accepted":
                return setWaitUser(`${shortenCallerName()} is online`)
            case "declined":
                return setWaitUser(`${shortenCallerName()} declined...`)
            case "notOnline":
                return setWaitUser(`${shortenCallerName()} is not online`)
            case "busy":
                return handleBusy()
            case "callEnded":
                return setWaitUser(`${shortenCallerName()} ended the call`)
            default: 
                return setWaitUser(`Waiting on ${shortenCallerName()}`)
        }
    }

    const shortenCallerName = () => truncateString(callerInformation.name, 20)

    const handleBusy = () => {
        setBusy(true)
        setWaitUser(`${shortenCallerName()} is busy.`)
    }

    const hangup = () => {
        // if user attempts to call another busy user, it will just clear their video modal but not emit a callUser event which will clear the other user's receiving call.
        if(!busy){
            socket.emit("callUser", {
                userToCall: callerInformation.email,
                from: user
            })
        }
        dispatch(closeVideoModal())
    }
    
    return (
        <div className={`video-modal__container`}>
            <div className="video-modal__top-bar">
                <span onClick={hangup} className="close">X</span>
                <div className="video-modal__my-video-container">
                    <div className="video">
                        <video muted playsInline ref={userVideo} autoPlay/>         
                        <span className="name">{truncateString(user.name, 10)}</span>
                    </div>
                </div>
            </div>

            <div className="video-modal__main-bar">
                <h1 className="video-modal__recepient">{waitUser}</h1>
                <div className="video">
                    <video height="360" width="480" controls muted poster="https://assets.zoom.us/images/en-us/desktop/generic/video-not-working.PNG" playsInline ref={partnerVideo} autoPlay/>
                    <span className="name">{truncateString(callerInformation.name, 30)}</span>
                </div>
            </div>

            <div className="video-modal__bottom-bar">
                <div onClick={hangup} className="leave">
                    <i className="fas fa-phone-slash"></i> &nbsp;End Call
                </div>
            </div>
        </div>
    )
}