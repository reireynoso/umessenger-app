import React, {useState, useEffect} from 'react'
import Linkify from 'linkifyjs/react'
import moment from 'moment'
import {useSelector} from 'react-redux'
import {sendReactionRequest} from '../actions/conversation'

import AnimationFeature from './AnimationFeature'

export default ({users=[], handleUnblur, message: {_id,content, reactions, user, createdAt, nextMessageUser}, blurOutComponent, blurred}) => {
    // const dispatch = useDispatch()
    const loggedUser = useSelector(state => state.user)
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    
    const [startLongPress, setStartLongPress] = useState(false)
    const [showTimeBar, setTimeBar] = useState(false)
    const [loading, setLoading] = useState(false)

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

    const giveReaction = async(reaction) => {
        //handle fetch to express to create reaction
        const reactionObj = {
            conversation_id: selectConversation._id,
            message_id: _id,
            reaction
        }

        setLoading("Loading...")

        const request = await sendReactionRequest(reactionObj);
        if(request === 400){
            setLoading("Try again...")
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
        if(request === 201){
            handleUnblur()
            setLoading(false)
        }
    }

    const whichReaction = (reaction) => {
        // function determines which reaction icon to return
        switch(reaction){
            case "thumbs-up":
                return <i className="fas fa-thumbs-up fa-lg"></i>
            case "thumbs-down":
                return <i className="fas fa-thumbs-down fa-lg"></i>
            case "exclamation":
                return <i className="fas fa-exclamation fa-lg"></i>
            case "question":
                return <i className="fas fa-question fa-lg"></i>
        }
    }

    const sortThroughReactions = () => {
        const reactionKeys = Object.keys(reactions)
        // set initial reaction to undefined. These will be set to the appropriate element
        let firstReaction;
        let secondReaction;

        //iterate through all the reaction keys
        for(let i = 0; i< reactionKeys.length; i++){
            // MAP may not be used efficiently
            // goal is to iterate through the users of reaction keys.
            reactions[reactionKeys[i]].map(user => {
                // console.log(reactionKeys[i])
                //set secondReaction to the first user that isn't the logged in user
                if(!secondReaction && user !== loggedUser.email){
                    secondReaction = <div className={`message-reaction reaction-second ${checkIfMineOrOther()}`}>
                        {whichReaction(reactionKeys[i])}
                    </div>
                }
                //set firstReaction to a matching logged in user
                if(user === loggedUser.email){
                    firstReaction = <div className={`message-reaction reaction-first ${checkIfMineOrOther()} myReaction`}>
                        {whichReaction(reactionKeys[i])}
                    </div>
                }
                //set firstReaction to the last user if no logged in user reaction is found
                if((i + 1 === reactionKeys.lenth) && !firstReaction){
                    firstReaction = <div className={`message-reaction reaction-first ${checkIfMineOrOther()}`}>
                        {whichReaction(reactionKeys[i])}
                    </div>
                }
            })
        }

        return <React.Fragment>
            {
                firstReaction
            }
            {
                secondReaction
            }
        </React.Fragment>
    }

    const determineReactionsToRender = () => {
        const reactionKeys = Object.keys(reactions)
        // Handles exactly ONE reaction from ONE user.
        // checks if there's one Reaction key. Also checks if only one user is in that list
        if(reactionKeys.length === 1 && reactions[reactionKeys].length === 1){
            const onlyReactionUser = reactions[reactionKeys][0]
            return <div className={`message-reaction reaction-second ${checkIfMineOrOther()} ${onlyReactionUser === loggedUser.email ? "myReaction" : null}`}>
                {whichReaction(reactionKeys[0])}
            </div>
        }
        else{
            
            return <React.Fragment>
            {
                sortThroughReactions()
            }
            </React.Fragment>
        }
    }

    const generateReactionElement = () => {
        if(reactions){
            return <div className={`message-reaction__container ${checkIfMineOrOther()}`}>
                <div className="reaction-container">
                    {
                        determineReactionsToRender()
                    }
                </div>
            </div> 
        }
    }

    const checkIfMineOrOther = () => loggedUser.email === user.email ? "mine" : "other"

    const checkIfLastMessage = () => lastMessage() ? "last" : ""

    const lastMessage = () => !nextMessageUser || nextMessageUser.email !== user.email

    const checkIfMineAndLast = () => `${checkIfMineOrOther()} ${checkIfLastMessage()}`

    return (
        <div className={`message-container`}>  
            {
                users.length > 1 && user.email !== loggedUser.email && <div className="message__nametag">
                    {user.name}
                </div>  
            }
            <div className={`message ${blurred === _id ? "no-blurred" : ""} ${checkIfMineAndLast()} ${reactions ? "has-reactions" : ""}`}
                onMouseDown={() => setStartLongPress(true)}
                onMouseUp={() => setStartLongPress(false)}
                onMouseLeave={() => setStartLongPress(false)}
                onTouchStart={() => setStartLongPress(true)} 
                onTouchEnd={() => setStartLongPress(false)} 
            >
                {
                    generateReactionElement()
                } 
                {
                    <AnimationFeature show={(_id && blurred === _id)}>
                        <div className={`message__reaction-container ${checkIfMineOrOther()}`}>
                            {      
                                loading ? loading
                                :
                                <React.Fragment>
                                    <span onClick={() => giveReaction("thumbs-up")}><i className="fas fa-thumbs-up fa-lg"></i></span>
                                    <span onClick={() => giveReaction("thumbs-down")}><i className="fas fa-thumbs-down fa-lg"></i></span>
                                    <span onClick={() => giveReaction("exclamation")}><i className="fas fa-exclamation fa-lg"></i></span>
                                    <span onClick={() => giveReaction("question")}><i className="fas fa-question fa-lg"></i></span>     
                                </React.Fragment>    
                            }    
                        </div>
                    </AnimationFeature>
                }
                <span 
                    onMouseEnter={() => setTimeBar(true)} 
                    onMouseLeave={() => setTimeBar(false)} 
                    className="message-content"
                    >
                    <Linkify>{content}</Linkify>
                </span>
                {
                <AnimationFeature show={showTimeBar}>
                    <div className={`message__tooltip ${checkIfMineOrOther()}`}>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </AnimationFeature>
                }
            </div>
            {
                lastMessage() && <div className={`message__time ${checkIfMineAndLast()}`}>
                    {moment(createdAt).format('LT')}
                </div>  
            }
        </div>
    )
}