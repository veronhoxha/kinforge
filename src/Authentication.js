import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useHistory } from 'react-router-dom';

const Authentication = (Component) => {
  const MainComponent = (props) => {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          history.push('/login');
        }
      });
    
      return () => {
        unsubscribe();
      };
    }, [history]);
    

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return MainComponent;
};

export default Authentication;