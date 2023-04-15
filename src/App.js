import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './app/components/navbar';
import Home from './app/pages/home/home';
import Login from './app/pages/login/login';
import Signup from './app/pages/signup/signup';
import PageNotFound from './app/pages/pagenotfound/pagenotfound';
import ManageAccount from './app/pages/manageAccount/manageAccount';
import EditProfile from './app/pages/manageAccount/editprofile/editprofile';
import Settings from './app/pages/manageAccount/settings/settings';
import Help from './app/pages/manageAccount/help/help';
import FamilyTreeWithHierarchyDad from './app/components/FamilyTreeWithHierarchyDad'
import FamilyTreeWithHierarchyMom from './app/components/FamilyTreeWithHierarchyMom'

function App() {
  return (
    <Router>
      <React.Fragment>
        <Switch>
          <Route path="/familyTree" render={() => <FamilyTreeWithHierarchyDad />} />
          <Route path="/" exact>
            <Navbar/>
            <Home/>
          </Route>
          <Route path="/familyTreeMom" render={() => <FamilyTreeWithHierarchyMom />} />
          <Route path="/" exact>
            <Navbar/>
            <Home/>
          </Route>
          <Route path="/manageAccount" render={() => <ManageAccount />} />
          <Route path="/" exact>
            <Navbar/>
            <Home/>
          </Route>
          <Route path="/editprofile" exact>
            <EditProfile/>
            <ManageAccount/>
          </Route>
          <Route path="/settings" exact>
            <Settings/>
            <ManageAccount/>
          </Route>
          <Route path="/help" exact>
            <Help/>
            <ManageAccount/>
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