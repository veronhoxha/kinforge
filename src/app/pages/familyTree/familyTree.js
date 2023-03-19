import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../styles/familyTree.css';
import profile_pic from '../../pages/familyTree/veron.jpg';
import { auth } from '../../../firebase';
import Authentication from '../../../Authentication';

function FamilyTree() {

  const [currentUser, setCurrentUser] = useState();
  const [open, setOpen] = useState(false);
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
    });
    return () => unsubscribe();
  }, []);


  return (
    <div className="menu">
      <div className="menu-wrapper" ref={menu}>
        <div className="menu-main" onClick={() => setOpen(!open)}>
          <img src={profile_pic} alt="profile pic"></img>
        </div>

        <div className={`dropdown ${open ? 'active' : 'inactive'}`}>
          <h3>
          {currentUser ? `${currentUser.displayName}` : ''} <br/>
            <span>{currentUser ? currentUser.email : ''}</span>
          </h3>
          <ul>
            <DropdownItem href="./editprofile" text="Edit Profile" icon={<EditIcon />} />
            <DropdownItem href="./settings" text="Settings" icon={<SettingsIcon />} />
            <DropdownItem href="./help" text="Help" icon={<HelpIcon />} />
            <DropdownItem href="/" text="Logout" icon={<LogoutIcon />} onClick={() => {
              auth.signOut();
              console.log(`${currentUser.email} has been logged out`);
            }} />
          </ul>
        </div>
      </div>
    </div>
  );
}

function DropdownItem(props) {
  return (
    <li className="dropdown-items">
      {props.icon}
      <a href={props.href} className="items" onClick={props.onClick}> {props.text}</a>
    </li>
  );
}

export default Authentication(FamilyTree);