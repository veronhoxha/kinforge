import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import React from 'react'
import '../styles/mainsection.css';
import video from '../media/family-video.mp4'

function MainSection() {
  return (
    <div className='main-section'>
        <video src={video} autoPlay loop muted data-testid='main-section-video'> </video>
        <h1>KinForge</h1>
        <p>Connect with your family's past</p>
        <div className='create-tree-btn'>
            <Link to="/login">
              <Button variant="contained" size="large" style={{ backgroundColor: '#7D4032', color: '#fff' }}> CREATE YOUR FAMILY TREE </Button>
            </Link>
        </div>
    </div>
  )
}

export default MainSection;