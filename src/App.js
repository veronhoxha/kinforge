import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './app/components/navbar';
import Login from './app/pages/login/login';
import Signup from './app/pages/signup/signup';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Navbar/>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
