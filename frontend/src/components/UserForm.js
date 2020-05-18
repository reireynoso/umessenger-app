import React, {useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {fetchUser} from '../actions/user'

const UserForm = ({location, history}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const route = location.pathname.split("").splice(1).join("")

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const [errors,setErrors] = useState([])

    const checkRoute = () => {
        return route === "signup" ? "Sign Up" : "Login"
    }

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
            return {
                name,
                email,
                password,
                phone
            }
        }else{
            return {
                email,
                password
            }
        }
    }

    const whichButton = () => {
        if(route === 'signup'){
            return <div>
                <p>Have an account?</p>
                <button onClick={() => history.push('/login')}>Login</button>
            </div>
        }else if(route === 'login'){
            return <div>
                <p>No Account? Sign up!</p>
                <button onClick={() => history.push('/signup')}>Sign Up</button>
            </div>
        }
        
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const res = await dispatch(fetchUser(route, whichDataToSend()))
        if(res && res.errors){
            console.log(res.errors)
            setErrors(res.errors)
        }
        // else{
        //     setEmail("")
        //     setName("")
        //     setPassword("")
        //     setPhone("")
        //     setErrors([])
        // }
    }
    return(
        <div>
            <ul>
                {errors.length > 0 && errors.map((error,index) => <li style={{color:"red"}} key={index+error}>{error}</li>)}
            </ul>
            {
                !user.loggedIn ? 
                <React.Fragment>
                    <h1>{checkRoute()}</h1>
                    <form onSubmit={handleSubmit}>
                        {
                            route === "signup" && <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                        }
                        <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                        {
                            route === "signup" &&  <input type="text" value={format()} placeholder="Phone" onChange={handleSetPhone}/>
                        
                        }
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        <input type="submit"/>
                    </form>
                    {
                        whichButton()
                    }
                </React.Fragment>
                :
                <Redirect to="/dashboard"/>
            }
            
        </div>
    )
}

export default UserForm