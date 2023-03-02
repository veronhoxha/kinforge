import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './app/components/navbar';
import Home from './app/pages/home/home';
import Login from './app/pages/login/login';
import Signup from './app/pages/signup/signup';
import PageNotFound from './app/pages/pagenotfound/pagenotfound';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Navbar/>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/signup" exact component={Signup}></Route>
          <Route component={PageNotFound}></Route>
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
