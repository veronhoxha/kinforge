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
import DownloadIcon from '@mui/icons-material/Download';
import { useHistory } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Search from '../../components/search'

function FamilyTree() {
  const [currentUser, setCurrentUser] = useState();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();
  const menu = useRef();
  const [profilePicture, setProfilePicture] = useState(profile_pic);

  useEffect(() => {
    const getUserProfileData = async (uid) => {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', uid));

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error("No matching documents found!");
        return;
      }

      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
      });

      return userData;
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userData = await getUserProfileData(user.uid);
        if (userData && userData.photoURL) {
          setProfilePicture(userData.photoURL);
        } else {
          setProfilePicture(profile_pic);
        }
      } else {
        setProfilePicture(profile_pic);
      }
    });

    return () => unsubscribe();
  }, []);

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
  
  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('familyModalShown');
    console.log(`${currentUser.email} has been logged out`);
    history.push('./');
  };

  return (
    <div className={`menu ${isModalOpen ? 'no-click' : ''}`}>
      <FamilyModal open={isModalOpen} onClose={handleModalClose} isModalOpen={isModalOpen} />
      {currentUser ? (
        <>
          <div className="menu-wrapper" ref={menu}>
          <div className="search-container">
            <Search />
          </div>
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
            <img src={profilePicture} alt="profile pic"></img>
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
                <DropdownItem text="Export as PDF" icon={<DownloadIcon />} />
                <DropdownItem
                  text="Logout"
                  icon={<LogoutIcon />}
                  onClick={handleLogout}
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