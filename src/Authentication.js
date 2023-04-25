import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useHistory } from 'react-router-dom';

const Authentication = (Component) => {
  const MainComponent = (props) => {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initialCheckComplete, setInitialCheckComplete] = useState(false);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setIsAuthenticated(true);
          setInitialCheckComplete(true);
        } else {
          setIsAuthenticated(false);
          setInitialCheckComplete(true);
          history.replace('/login');
        }
      });

      return () => {
        unsubscribe();
      };
    }, [history]);

    return initialCheckComplete && isAuthenticated ? <Component {...props} /> : null;
  };

  return MainComponent;
};

export default Authentication;
