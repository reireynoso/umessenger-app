import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {closeVideoModal} from '../actions/modal'

import {declineCallAction} from '../actions/video-chat'

import Peer from 'simple-peer'

export default () => {
    const {videoModal, callerInformation} = useSelector(state => state.modal)
    const user = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const {receivingCall, caller, callerSignal} = useSelector(state => state.videoChat)

    const userVideo = useRef()
    const partnerVideo = useRef()


    let currentStream;

    useEffect(() => {
        // let currentStream;
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
        }

        return () => {
            console.log('unmount')
            if(currentStream){
                //returns active media
                currentStream.getTracks().forEach((track) => {
                    // console.log(track)
                    //stops each active media
                    if(track.readyState === 'live'){
                        track.stop();
                    }
                })
            }
            dispatch(declineCallAction())
            // dispatch(unsetReceivingCall())
            // console.log(userVideo)
            socket.off("notOnline")
            socket.off("callAccepted")
            socket.off("callDeclined")
        }
    }, [])

    const acceptCall = (stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
          });
          peer.on("signal", data => {
            socket.emit("acceptCall", { signal: data, to: caller.email })
          })
      
          peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
          });

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
            // console.log('hey')
            socket.emit("callUser", {
                userToCall: callerInformation.email, 
                signalData: data, 
                from: user
            })
        })

        peer.on("stream", stream => {
            // console.log(partnerVideo.current)
  
            if(partnerVideo.current){
                partnerVideo.current.srcObject = stream;
            }
        })

        peer.on('connection', function(dataConnection){
            console.log('connected')
        })


        socket.on("callAccepted", signal => {
            peer.signal(signal)
        })

        socket.on("notOnline", () => {
            console.log('not online')
            
        })

        socket.on("callDeclined", () => {
            console.log('call declined')
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
                    <span className="name">{callerInformation.name}</span>
                </div>
            </div>

            <div className="video-modal__bottom-bar">
                <div onClick={() => console.log(callerSignal)} className="leave">
                    <i className="fas fa-phone-slash"></i> &nbsp;End Call
                </div>
            </div>
        </div>
    )
}