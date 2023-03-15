import React, { useEffect } from 'react';
import { auth } from './firebase';
import { useHistory } from 'react-router-dom';

const Authentication = (Component) => {
  const MainComponent = (props) => {
    const history = useHistory();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          history.push('/login');
        } 
      });

      return () => {
        unsubscribe();
      };
    }, [history]);

    return <Component {...props} />;
  };

  return MainComponent;
};

export default Authentication;