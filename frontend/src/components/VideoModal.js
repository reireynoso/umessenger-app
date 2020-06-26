import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {closeVideoModal} from '../actions/modal'

export default () => {
    const videoModal = useSelector(state => state.modal.videoModal)
    const dispatch = useDispatch()

    return (
        <div className={`video-modal__container ${videoModal ? "open" : ""}`}>
            <div className="video-modal__top-bar">
                <span onClick={() => dispatch(closeVideoModal())} className="close">X</span>
                <div className="video-modal__my-video-container">
                    <div className="video">
                        
                        <span className="name">Rei Rey</span>
                    </div>
                </div>
            </div>

            <div className="video-modal__main-bar">
                <div className="video">
                    
                    <div className="name">Rei Rey</div>
                </div>
            </div>

            <div className="video-modal__bottom-bar">
                <div className="leave">
                    Leave
                </div>
            </div>
        </div>
    )
}