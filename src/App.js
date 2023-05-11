import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './app/components/Navbar';
import Home from './app/pages/home/Home';
import Login from './app/pages/login/Login';
import Signup from './app/pages/signup/SignUp';
import PageNotFound from './app/pages/pagenotfound/PageNotFound';
import ManageAccount from './app/pages/manageAccount/ManageAccount';
import EditProfile from './app/pages/manageAccount/editprofile/EditProfile';
import Settings from './app/pages/manageAccount/settings/Settings';
import Help from './app/pages/manageAccount/help/Help';
import FamilyTreeWithHierarchyDad from './app/components/FamilyTreeWithHierarchyDad';
import FamilyTreeWithHierarchyMom from './app/components/FamilyTreeWithHierarchyMom';

function App() {

  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.remove();
    }
  }, []);

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