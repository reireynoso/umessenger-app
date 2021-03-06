import React, {useState,useEffect,useRef, useLayoutEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import "emoji-mart/css/emoji-mart.css"
import {Picker} from 'emoji-mart'
import {sendMessageToConversation, selectedConversation as setSelectedConversation} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'
import {setConversationError, emptyConversationError} from '../actions/errors'

export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const conversationError = useSelector(state => state.errors.conversationError)
    
    const textArea = useRef()
    const pickerRef = useRef()

    const [content, setContent] = useState("")

    const audio = useRef(new Audio('/audio/sent_message.mp3'))

    const socket = useSelector(state => state.socket)

    const [emojiPickerState, setEmojiPicker] = useState(false)

    useEffect(() => {
        if(textArea.current){
            textArea.current.focus()
        }
        return () => {
           resetDivHeight()
        }
    },[selectedConversation._id])

    useLayoutEffect(() => {
        const documentObj = document
        documentObj.addEventListener('click', closeEmoji)
        return () => {
            documentObj.removeEventListener('click', closeEmoji)
        }
    }, [emojiPickerState])

    useEffect(() => {
        if(content){
            dispatch(emptyConversationError())
        }
    }, [content])

    const handleResetInput = () =>{
        // console.log('logged out')
        // const data = {selectedConversation,user,content:""}
        // if(socket.on && selectedConversation){         
        //     socket.emit('typing', data)
        //     socket.emit('messageTyping', data)
        // }
        socketRequest("")
        resetDivHeight()
    }

    // emits changes of typing
    const socketRequest = (value) => {
        const data = {selectedConversation,user,content:value}
        if(socket.on && selectedConversation){     
            socket.emit('typing', data)
            socket.emit('messageTyping', data)
        }
    }

    const resetDivHeight = () => {
        textArea.current.value = ""
        textArea.current.style.height = '20px'
        setContent("")
    }
    
    const handleOnChange = (e) => {
        //always resets height to 2rem
        textArea.current.style.height = '20px';
        //grabs the scrollHeight from that initial height of 2rem and assigns to new accounting for the extra 2px
        textArea.current.style.height = (textArea.current.scrollHeight - 2) + 'px'
        if(textArea.current.value.trim() === ""){
            textArea.current.value = ""
            textArea.current.style.height = '20px'
        }
        // const data = {selectedConversation,user,content:e.target.value}
        // if(socket.on && selectedConversation){
        //     socket.emit('typing', data)
        //     socket.emit('messageTyping', data)
        // }
        socketRequest(e.target.value)
        setContent(e.target.value)
    }
    
    const handleOnSubmit = async(e) => {     
        if(e.key=== "Enter"){
            //make a fetch request to the backend to create new convo
            if(!content){
                return dispatch(setConversationError("Message cannot be empty!"))
            }

            if(emails.length === 0 && content){
                e.preventDefault()
                return dispatch(setConversationError("Please enter a recipient!"))
            }

            if(emails.length > 0 && content){
                handleResetInput()
                // console.log(textArea.current.value)
                // const errors = await dispatch(sendMessageToConversation(emails,content,user))
                const result = await sendMessageToConversation(emails,content)
                if(result.errors){
                    return dispatch(setConversationError(result.errors[0]))
                }

                if(result.newConversation){   
                    // handles switching selected convo to new convo. ONLY if new
                    dispatch(setSelectedConversation(removeLoggedInUserFromConversation(result.newConversation,user)))
                }

                if(result.conversation){   
                    // handles switching selected convo to existing convo
                    dispatch(setSelectedConversation(removeLoggedInUserFromConversation(result.conversation,user)))
                }

                audio.current.play()
            }    
        }
    }

    const closeEmoji = (e) => {
        // maybe an issue with performance to add event listener to document
        if(emojiPickerState && !pickerRef.current.contains(e.target)){
            setEmojiPicker(false)
        }
    }

    const pickerStyle = () => ({
        position: "absolute", 
        bottom: textArea.current.offsetHeight + 20, 
        right: 0, 
        zIndex:30,
    })

    return(
        <div className="content">
            {
               <div 
                    ref={pickerRef}
                    className={emojiPickerState? "fadeIn" : "fadeOut"}
                    style={textArea.current ? pickerStyle(): null}
                    >
                        <Picker
                        title="Pick your emoji"
                        emoji="point_up"
                        theme="dark"
                        onSelect={emoji => {
                            setContent(content + emoji.native + " ")
                            setEmojiPicker(false)
                            textArea.current.focus()
                        }}
                    />
                </div>
            }
            <textarea ref={textArea} type="text" className={`content__input ${conversationError ? "error" : null}`} value={content} onKeyPress={handleOnSubmit} onChange={handleOnChange} placeholder="uMessage..."/>
            <div onClick={() => setEmojiPicker(!emojiPickerState)} id="emoji-container">
                <i className="fas fa-smile"></i>
            </div>
        </div>    
    )
}