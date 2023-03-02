import Button from '@mui/material/Button';
import React from 'react'
import '../styles/mainsection.css';

function mainsection() {
  return (
    <div className='main-section'>
        <video src='family-video.mp4' autoPlay loop muted> </video>
        <h1>KinForge</h1>
        <p>Connect with your family's past</p>
        <div className='create-tree-btn'>
            <Button variant="contained" size="large" style={{ backgroundColor: '#7D4032', color: '#fff' }}> CREATE YOUR FAMILY TREE </Button>
        </div>
    </div>
  )
}

export default mainsection