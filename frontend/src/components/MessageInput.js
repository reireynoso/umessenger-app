import React, {useState,useEffect,useRef, forwardRef, useLayoutEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {sendMessageToConversation} from '../actions/conversation'
import {setConversationError, emptyConversationError} from '../actions/errors'

export default forwardRef(({setmessageInputHeight},ref) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const conversationError = useSelector(state => state.errors.conversationError)
    
    const textArea = useRef()

    const [content, setContent] = useState("")
    const audio = useRef(new Audio('/audio/sent_message.mp3'))

    const socket = useSelector(state => state.socket)

    useLayoutEffect(() => {
        if(ref.current){
            ref.current.height = ref.current.offsetHeight
            setmessageInputHeight(ref.current.height)
        }
    }, [textArea.current ? textArea.current.offsetHeight : null])

    useEffect(() => {
        if(textArea.current){
            textArea.current.focus()
        }
        return () => {
           resetDivHeight()
        }
    },[selectedConversation._id])

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
                const errors = await dispatch(sendMessageToConversation(emails,content,user))
                if(errors){
                    return dispatch(setConversationError(errors[0]))
                }
                audio.current.play()
            }

            
        }
    }
    return(
        <div ref={ref} className="content">
            <textarea ref={textArea} type="text" className={`content__input ${conversationError ? "error" : null}`} value={content} onKeyPress={handleOnSubmit} onChange={handleOnChange} placeholder="uMessage..."/>
        </div>    
    )
})