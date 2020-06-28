import React, {useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {closeVideoModal} from '../actions/modal'

import {receivingCall, unsetReceivingCall,setCaller,setCallAccepted} from '../actions/video-chat'

import Peer from 'simple-peer'

export default () => {
    const videoModal = useSelector(state => state.modal.videoModal)
    const user = useSelector(state => state.user)
    const modalUser = useSelector(state => state.modal.userInformation)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const {receivingCall, callAccepted, caller, callerSignal} = useSelector(state => state.videoChat)

    const [stream, setStream] = useState()
    // const [callAccepted, setCallAccepted] = useState(false)

    const userVideo = useRef()
    const partnerVideo = useRef()

    // console.log(socket)
    
    useEffect(() => {
        let currentStream;
        if(videoModal){
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            .then(stream => {
                currentStream = stream
                // setStream(stream)
                if(userVideo.current){
                    userVideo.current.srcObject = stream
                    
                    if(!receivingCall){
                        return callPeer(currentStream)
                    }
                
                    return acceptCall(currentStream)
                }
            })
        }

        return () => {
            // debugger
            console.log('unmount')
            if(currentStream){
                //returns active media
                currentStream.getTracks().forEach((track) => {
                    // console.log(track)
                    //stops each active media
                    if(track.readyState == 'live'){
                        track.stop();
                    }
                })
            }
            dispatch(unsetReceivingCall())
            // console.log(userVideo)
        }
    }, [])

    const acceptCall = (currstream) => {
        // setCallAccepted(true)
        // console.log(stream)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: currstream,
          });
          peer.on("signal", data => {
            socket.emit("acceptCall", { signal: data, to: caller.email })
          })
      
          peer.on("stream", stream => {
              console.log(stream)
            partnerVideo.current.srcObject = stream;
          });
        //   console.log(callerSignal)
          peer.signal(callerSignal);
    }

    const callPeer = (stream) => {
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
            socket.emit("callUser", {
                userToCall: modalUser.email, 
                signalData: data, 
                from: user
            })
        })

        peer.on("stream", stream => {
            // console.log(stream)
            if(partnerVideo.current){
                partnerVideo.current.srcObject = stream;
            }
        })

        socket.on("callAccepted", signal => {
            // console.log(signal)
            // setCallAccepted(true)
            peer.signal(signal)
        })
    }
    
    return (
        <div className={`video-modal__container`}>
            <div className="video-modal__top-bar">
                <span onClick={() => dispatch(closeVideoModal())} className="close">X</span>
                <div className="video-modal__my-video-container">
                    <div className="video">
                        <video muted playsInline ref={userVideo} autoPlay/>
                        
                        <span className="name">{user.name}</span>
                    </div>
                </div>
            </div>

            <div className="video-modal__main-bar">
                <div className="video">
                    <video muted playsInline ref={partnerVideo} autoPlay/>
                    <span className="name">{modalUser.name}</span>
                </div>
            </div>

            <div className="video-modal__bottom-bar">
                <div className="leave">
                <i className="fas fa-phone-slash"></i> &nbsp;End Call
                </div>
            </div>
        </div>
    )
}