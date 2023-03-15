import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './app/components/navbar';
import Home from './app/pages/home/home';
import Login from './app/pages/login/login';
import Signup from './app/pages/signup/signup';
import PageNotFound from './app/pages/pagenotfound/pagenotfound';
import FamilyTree from './app/pages/familyTree/familyTree';
import ManageAccount from './app/pages/manageAccount/manageAccount';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Switch>
          <Route path="/familyTree" render={() => <FamilyTree />} />
          <Route path="/" exact>
            <Navbar/>
            <Home/>
          </Route>
          <Route path="/manageAccount" render={() => <ManageAccount />} />
          <Route path="/" exact>
            <Navbar/>
            <Home/>
          </Route>
          <Route path="/login" exact>
            <Navbar/>
            <Login/>
          </Route>
          <Route path="/signup" exact>
            <Navbar/>
            <Signup/>
          </Route>
          <Route component={PageNotFound}></Route>
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
