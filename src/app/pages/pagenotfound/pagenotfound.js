import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import '../../styles/pagenotfound.css';

function pagenotfound() {
  return (
    <div className='pagenotfound'>
        <h2>Oops! Page was not found.</h2>
        <h1>404</h1>
        <div className='go-back-home-btn'>
          <Link to='/home'> 
            <Button variant="contained" size="large" style={{ backgroundColor: '#7D4032', color: '#fff' }}> Go back home </Button>
          </Link>
        </div>
    </div>
  )
}

export default pagenotfound