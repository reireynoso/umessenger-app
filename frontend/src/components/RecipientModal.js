import React, {forwardRef} from 'react'

export default forwardRef(({modal}, ref) => {
    return (
        <div ref={ref} className={`recipient__modal ${modal && "modal-active"}`}>
            <div className="recipient__modal-header">
                <div className="image">
                    <img src="https://www.w3schools.com/howto/img_avatar.png"/>
                </div>
                <h1>Rei Rey;</h1>
            </div>

            <div className="recipient__modal-information">
                <p>
                    <i className="far fa-envelope"></i>
                    &nbsp;cool@email.com
                </p>
                <p>
                    <i className="fas fa-phone"></i>
                    &nbsp;201-693-9999
                </p>
            </div>

            <div className="recipient__modal-icons">
                <div className="message__icon-container">
                    <div className="message__icon-icon">
                        <i className="fas fa-comment-dots"></i>
                    </div>

                    <div className="message__icon-name">
                        Message
                    </div>
                </div>

                <div className="video__icon-container">
                    <div className="message__icon-icon">
                        <i className="fas fa-video"></i>
                    </div> 

                    <div className="message__icon-name">
                        Video Chat
                    </div>
                </div>
            </div>
        </div>
    )
})