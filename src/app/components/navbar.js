import { useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../styles/navbar.css';

function Navbar() {

  const navBar = useRef();
  const showTheNavBar = () => {navBar.current.classList.toggle('responsive_nav');};

  return (
    <header>
      <div>
        <Link to="/">
          <img src={process.env.PUBLIC_URL + 'favicon.ico'} alt="Logo"></img>
        </Link>
      </div>
      <nav className="nav-cover ml-auto" ref={navBar}>
        <Link to="/login">
          <Button variant="contained" style={{ backgroundColor: 'white', color: '#7D4032' }}>Log In</Button>
        </Link>
        <Link to="/signup">
          <Button variant="contained" style={{ backgroundColor: '#7D4032', color: 'white' }}>Sign Up</Button>
        </Link>
        <button className="nav-button nav-btn" onClick={showTheNavBar}>
          <FaTimes/>
        </button>
      </nav>
        <button className="nav-button" onClick={showTheNavBar}>
          <FaBars/>
        </button>
    </header>
  );
}

export default Navbar;
