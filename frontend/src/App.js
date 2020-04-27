import React from 'react';
import {Route, Switch} from 'react-router-dom'
import './App.css';

import UserForm from './components/UserForm'

const App = () => {
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
