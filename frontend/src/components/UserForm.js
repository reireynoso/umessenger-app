import React, {useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {fetchUser} from '../actions/user'

const UserForm = ({location}) => {
    const dispatch = useDispatch()
    const route = location.pathname.split("").splice(1).join("")

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const checkRoute = () => {
        return route === "signup" ? "Sign Up" : "Login"
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

    const handleSubmit = async(e) => {
        e.preventDefault()
        const res = await dispatch(fetchUser(route, whichDataToSend()))
        console.log(res)
    }
    return(
        <div>
            <h1>{checkRoute()}</h1>
            <form onSubmit={handleSubmit}>
                {
                    route === "signup" && <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                }
                <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                {
                    route === "signup" &&  <input type="tel" placeholder="Phone phone" onChange={(e) => setPhone(e.target.value)}/>
                }
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default UserForm