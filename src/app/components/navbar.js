import { useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../styles/navbar.css';

function Navbar() {

  const navRef = useRef();
  const showNavBar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };

  return (
    <header>
      <div>
        <Link to="/">
          <img src={process.env.PUBLIC_URL + 'favicon.ico'} alt="Logo"></img>
        </Link>
      </div>
      <nav className="nav-wrapper ml-auto" ref={navRef}>
        <Link to="/login">
          <Button variant="contained" style={{ backgroundColor: 'white', color: '#7D4032' }}>Log In</Button>
        </Link>
        <Link to="/signup">
          <Button variant="contained" style={{ backgroundColor: '#7D4032', color: 'white' }}>Sign Up</Button>
        </Link>
        <button className="nav-btn nav-close-btn" onClick={showNavBar}>
          <FaTimes/>
        </button>
      </nav>
        <button className="nav-btn" onClick={showNavBar}>
            <FaBars/>
        </button>
    </header>
  );
}

export default Navbar;
