import React, {useState, useEffect} from 'react'
import moment from 'moment'
import {useSelector} from 'react-redux'

export default ({users=[], message: {_id,content, user, createdAt, nextMessageUser}, blurOutComponent, blurred}) => {
    const loggedUser = useSelector(state => state.user)
    const [startLongPress, setStartLongPress] = useState(false)

    useEffect(() => {
        let timerId;
        if(startLongPress){
            timerId = setTimeout(() => {
                blurOutComponent(_id)
            }, 1000)
        }
        else{
            clearTimeout(timerId)
        }

        return ()=> {
            clearTimeout(timerId)
        }
    }, [startLongPress])


    const checkIfMineOrOther = () => loggedUser.email === user.email ? "mine" : "other"

    const checkIfLastMessage = () => lastMessage() ? "last" : ""

    const lastMessage = () => !nextMessageUser || nextMessageUser.email !== user.email

    const checkIfMineAndLast = () => `${checkIfMineOrOther()} ${checkIfLastMessage()}`

    return (
        <div className={`message-container ${blurred === _id ? "no-blurred" : ""}`}
            onMouseDown={() => setStartLongPress(true)}
            onMouseUp={() => setStartLongPress(false)}
            onMouseLeave={() => setStartLongPress(false)}
            >  
            {
                users.length > 1 && user.email !== loggedUser.email && <div className="message__nametag">
                    {user.name}
                </div>  
            }
            <div className={`message ${checkIfMineAndLast()}`}>
                {!user ? <img alt="typing-gif" className="segment__typing" src="/image/typing_dots.gif"/> : content}
                <div className={`message__tooltip ${checkIfMineOrOther()}`}>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
            </div>
            {
                lastMessage() && <div className={`message__time ${checkIfMineAndLast()}`}>
                    {moment(createdAt).format('LT')}
                </div>  
            }
        </div>
    )
}