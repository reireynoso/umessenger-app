import React from 'react'
import moment from 'moment'
import {useSelector} from 'react-redux'

export default ({prevConversation, users=[], message: {content, user, createdAt}}) => {
    const loggedUser = useSelector(state => state.user)

    const calendarDiv = () => <div className="message__calendar">{moment(createdAt).calendar({
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday] MM/DD/YY',
        lastWeek: '[Last] dddd MM/DD/YY',
        sameElse: 'MM/DD/YY'
    })}</div>

    const checkDay = () => {
        if(!prevConversation){
            return calendarDiv()
        }
        else if(!moment(prevConversation.createdAt).isSame(createdAt, 'day')){
            return calendarDiv()
        }
    }
    return (
        <div className="message-container">
            {
               user && checkDay()   
            }      
            {
                users.length > 1 && user.email !== loggedUser.email && <div className="message__nametag">
                    {user.name}
                </div>  
            }
            <div className={`message ${loggedUser.email === user.email ? "mine" : "other"}`}>
                {!user ? <img className="segment__typing" src="/image/typing_dots.gif"/> : content}
            </div>
            {
                user && <div className={`message__time ${loggedUser.email === user.email ? "mine" : "other"}`}>
                    {moment(createdAt).format('LT')}
                </div>  
            }
        </div>
    )
}