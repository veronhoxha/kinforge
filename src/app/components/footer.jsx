import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import '../styles/footer.css';

function Footer() {
  return (
    <div className='footer'>
      <section className='socialmedia'>
        <div className='socialmedia-cover'>
            <Link to='/' className='page-name'> KinForge </Link>
            <small className='rights'> Copyright © 2023 All Rights Reserved </small>
          <div className='socialmedia-icons'>
            <a href='https://www.facebook.com/' className='icons' target='_blank' rel='noreferrer' aria-label='Facebook'>
              <FacebookIcon/>
            </a>
            <a href='https://www.instagram.com/' className='icons' target='_blank' rel='noreferrer' aria-label='Facebook'>
              <InstagramIcon/>
            </a>
            <a href='https://twitter.com/' className='icons' target='_blank' rel='noreferrer' aria-label='Facebook'>
              <TwitterIcon/>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;