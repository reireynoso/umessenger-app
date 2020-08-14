import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {unsetDisconnectedError} from '../actions/errors'

export default () => {
    const disconnected = useSelector(state => state.errors.disconnected)
    const dispatch = useDispatch()
    return (
       <React.Fragment>
       {
            disconnected ? <div className="react-alert">
               <i className="fas fa-info-circle"></i>
               <span>You've been disconnected.</span>
               <span>Please refresh the page.</span>
               <button className="button button__primary" onClick={() => window.location.reload()}>Refresh</button>
               <button className="button button__primary" onClick={() => dispatch(unsetDisconnectedError())}>Close</button>
            </div>
            : null
        }
       </React.Fragment>
    )
}