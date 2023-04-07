import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../styles/familyTree.css';
import profile_pic from '../../media/no-photo.png';
import { auth } from '../../../firebase';
import Authentication from '../../../Authentication';
import FamilyModal from '../../components/FamilyModal';
import { Link, useLocation } from 'react-router-dom';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

function FamilyTree() {
  const [currentUser, setCurrentUser] = useState();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menu = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!menu.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && localStorage.getItem('familyModalShown') !== 'true') {
        setIsModalOpen(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    localStorage.setItem('familyModalShown', 'true');
  };

  return (
    <div className={`menu ${isModalOpen ? 'no-click' : ''}`}>
      <FamilyModal open={isModalOpen} onClose={handleModalClose} isModalOpen={isModalOpen} />
      {currentUser ? (
        <>
          <div className="menu-wrapper" ref={menu}>
            <div className='icon'>
              <Link to="/familyTree" className="go-to-man">
                <ManIcon
                  sx={{
                    color: isModalOpen ?  'white' : location.pathname === '/familyTree' ? 'black' : 'inherit',
                  }}
                />
                <div className="tooltip">Dad's Family Side</div>
              </Link>
              <Link to="/familyTreeMom" className="go-to-woman">
                <WomanIcon
                  sx={{
                    color: isModalOpen ?  'white' : location.pathname === '/familyTreeMom' ? 'black' : 'inherit',
                  }}
                />
                <div className="tooltip">Mom's Family Side</div>
              </Link>
            </div>
            <div className="menu-main" onClick={() => isModalOpen ? null : setOpen(!open)}>
              <img src={currentUser.photoURL || profile_pic} alt="profile pic"></img>
            </div>
            <div className={`dropdown ${open ? 'active' : 'inactive'}`}>
              <h3>
                {currentUser ? `${currentUser.displayName}` : ''} <br />
                <span>{currentUser ? currentUser.email : ''}</span>
              </h3>
              <ul>
                <DropdownItem href="./editprofile" text="Edit Profile" icon={<EditIcon />} />
                <DropdownItem href="./settings" text="Settings" icon={<SettingsIcon />} />
                <DropdownItem href="./help" text="Help" icon={<HelpIcon />} />
                <DropdownItem
                  href="/"
                  text="Logout"
                  icon={<LogoutIcon />}
                  onClick={() => {
                    auth.signOut();
                    localStorage.removeItem('familyModalShown');
                    console.log(`${currentUser.email} has been logged out`);
                  }}
                />
              </ul>
              </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function DropdownItem(props) {
  return (
    <li className="dropdown-items">
      {props.icon}
      <a href={props.href} className="items" onClick={props.onClick}>
        {' '}
        {props.text}
      </a>
    </li>
  );
}

export default Authentication(FamilyTree);
