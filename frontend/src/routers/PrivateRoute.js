import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default ({component: Component, ...rest}) => {
    const user = useSelector(state => state.user)
    // console.log()
    return <Route {...rest} component={(props) => (
        user.loggedIn ? ( 
        <div>
            <Component {...props}/>
        </div>
        ) 
        :
        (
            <Redirect to="/signup"/>
        )
    )}  
    />
}