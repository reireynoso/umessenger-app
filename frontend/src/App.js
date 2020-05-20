import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux'
import {Route, Switch, Redirect} from 'react-router-dom'
import 'normalize.css/normalize.css';
import './styles/styles.scss';

import {fetchAutoLogin} from './actions/user'

import UserForm from './components/UserForm'
import MainComponent from './components/MainComponent'

import PrivateRoute from './routers/PrivateRoute'

const App = () => {

  const dispatch = useDispatch()
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token){
      dispatch(fetchAutoLogin(token))
    }
  }, [])
  
  return (
    <div className="App">
        <Switch>
          <Route path="/signup" component={UserForm}/>
          <Route path="/login" component={UserForm}/>
          <PrivateRoute path="/dashboard" component={MainComponent}/>
          <Route path="/" render={() => <Redirect to="/login"/>}/>
        </Switch>
    </div>
  );
}

export default App;
