import React, {useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {fetchUser} from '../actions/user'

let date = new Date();
let currentYear = date.getFullYear()

const UserForm = ({location, history}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const route = location.pathname.split("").splice(1).join("")

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [image, setImage] = useState({})

    const [errors,setErrors] = useState([])

    const handleSetPhone = (e) => {
        //format() add dashes to the the input field.
        //unformattedPhone will remove those dashes and join the number strings together
        //Necessary since regex will reject the dashes since it's only expecting numbers
        //The only needed to store in state is the actual number strings.
        // const unformattedPhone = e.target.value.split("-").join("")
        // console.log(phone)
        //use .replace with regex to replace ()or- with ''
        const unformattedPhone = e.target.value.replace(/[-)()]/g,'')
        if(unformattedPhone.match(/^[0-9]*$/) && unformattedPhone.length < 11){
            setPhone(unformattedPhone)
        }
    }

    //format() is responsible for taking the value of phone and adding dashes for formatting
    const format = () => {
        //creating a new array that will include the dashes
        let formattedNumber = []
        for(let i = 0; i<phone.length;i++){
            if(phone.length > 3){
                formattedNumber[0] = "("
            }
            formattedNumber = [...formattedNumber, phone[i]]
            if((i === 2 && phone[i+1])){
                formattedNumber = [...formattedNumber, ")"]
            }
            //for the 3 number, add a dash after ONLY if a 4th number exists, likewise with 6th and 7th number
            if((i === 2 && phone[i+1]) || (i === 5 && phone[i+1])){
                formattedNumber = [...formattedNumber, "-"]
            }
        }
        //combine the array and dashes together
        return formattedNumber.join("")
    }

    const whichDataToSend = () => {
        if(route === 'signup'){
            // return {
            //     name,
            //     email,
            //     password,
            //     phone
            // }

            const form = new FormData()
            form.append("name", name)
            form.append("email", email)
            form.append("phone", phone)
            form.append("password", password)
            form.append('upload', image)

            return form

        }else{
            return {
                email,
                password
            }
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const res = await dispatch(fetchUser(route, whichDataToSend()))
        if(res && res.errors){
            // console.log(res.errors)
            setErrors(res.errors)
        }
    }

    const optionClick = (urlRoute) => {
        setErrors([])
        setEmail("")
        setName("")
        setPassword("")
        setPhone("")
        setImage({})
        history.push(urlRoute);
    }

    const formatName = () => {
        if(image.name.length > 12){
            // const fileType = "." + image.name.split(".")[image.name.split(".").length - 1]
            const fileName = image.name.slice(0, 16) + "..." 
            return fileName
        }
        return image.name
    }

    const checkRoute = () => route === "signup"

    return(
        <div className="form__container">
            <div className="form__inner-container">
                <h1 className="form__title">uMessenger</h1>
                <div className="form__button-box">
                    <div id="btn" className={`${checkRoute() ? "signup" : "login"}`}></div>
                    <button type="button" className={`toggle-btn ${!checkRoute() ? "toggle-selected" : ""}`} onClick={() => optionClick('/login')}>Login</button>
                    <button type="button" className={`toggle-btn ${checkRoute() ? "toggle-selected": ""}`} onClick={() => optionClick('/signup')}>Sign Up</button>
                </div>
                {
                    !user.loggedIn ? 
                        <form className={`form__input-group ${checkRoute() ? "signup-group" : "login-group"}`} onSubmit={handleSubmit}>
                            {
                                checkRoute() ? <React.Fragment>
                                    <input className="form__input-field" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                                    <input className="form__input-field" type="text" value={format()} placeholder="Phone" onChange={handleSetPhone}/>
                                </React.Fragment>
                                :
                                null 
                            }
                            <input className="form__input-field" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                            <input className="form__input-field" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                            {
                                checkRoute() &&  <div>
                                    <input id="form__input-file" type="file" name="image" onChange={(e) => setImage(e.target.files[0] === undefined ? {} : e.target.files[0])}/>
                                    <label htmlFor="form__input-file">
                                        <i className="fas fa-upload"></i>
                                        &nbsp;Upload an image (optional)
                                    </label>
                                    <span>
                                        <strong>Choose file:</strong>
                                        <span id="file-name">{image.name ? formatName() : "No file"}</span>
                                    </span>
                                </div>
                            }
                            <input className="form__submit-btn toggle-selected" type="submit"/>
                        </form>
                    :
                    <Redirect to="/dashboard"/>
                }
                <ul className="form__errors">
                    {errors.length > 0 && errors.map((error,index) => <li className="form__error" key={index+error}><i className="fas fa-exclamation-circle"></i> {error}</li>)}
                </ul>

                <span id="credit">Proudly created by <a target="_blank" href="https://www.linkedin.com/in/reinald-reynoso622/">Reinald Reynoso</a> {currentYear} <a target="_blank" href="https://github.com/reireynoso/umessenger-app"><i className="fab fa-github"></i></a></span>
            </div>
        </div>
    )
}

export default UserForm