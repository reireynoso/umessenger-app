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

    const handleSetPhone = (e) => {
        // e.persist()
        // console.log(e.target.value)
        const fix = e.target.value
        if(fix.match(/^[0-9]*$/) && fix.length < 12){
            // console.log(fix)
            setPhone(fix)
        }
        else{
            console.log('waat')
        }
        // console.log(e.target.value.match(/^[0-9]*$/))
        // setPhone()
        
    }
    // const format = (phoneArg) => {
    //     // console.log(phoneArg)
    //     let phoneFormat = phoneArg.split("")
    //     let newArr = []
    //     for(let i = 0; i<phoneFormat.length;i++){
    //         newArr = [...newArr, phoneFormat[i]]
    //         if(i === 2 || i === 4){
    //             newArr = [...newArr, "-"]
    //         }
    //     }
    //     // return phone.split("").join("-")
    //     return newArr.join("")
    // }

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
                    route === "signup" &&  <input type="text" value={phone} placeholder="Phone" onChange={handleSetPhone}/>
                   
                }
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default UserForm