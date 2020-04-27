import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux'
import {Route, Switch} from 'react-router-dom'

import {fetchAutoLogin} from './actions/user'
import './App.css';

import UserForm from './components/UserForm'

const App = () => {

  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(fetchAutoLogin())
  }, [])
  
  return (
    <div className="App">
        <Switch>
          <Route path="/signup" component={UserForm}/>
          <Route path="/login" component={UserForm}/>
        </Switch>
    </div>
  );
}

export default App;
