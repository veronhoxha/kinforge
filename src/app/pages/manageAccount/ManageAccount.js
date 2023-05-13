import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { auth } from '../../../firebase';
import { useHistory } from 'react-router-dom';
import EditProfile from './editprofile/EditProfile';
import Settings from './settings/Settings';
import Help from './help/Help';
import '../../styles/manageAccount.css';
import Authentication from '../../../Authentication';
import React, { useState, useEffect } from 'react';

const ManageAccount = () => {

    const [activeItem, setActiveItem] = useState(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const history = useHistory();

    const handleClick = (e) => {
      const menuItem = e.currentTarget.dataset.menuItem;
    
      if (menuItem !== null) {
        setActiveItem(menuItem);
    
        if (menuItem === 'Edit Profile') {
          window.history.pushState(null, null, '/editprofile');
          setShowEditProfile(true);
          setShowSettings(false);
          setShowHelp(false);
          history.go(0);
        } else {
          if (menuItem === 'Settings') {
            window.history.pushState(null, null, '/settings');
            setShowEditProfile(false);
            setShowSettings(true);
            setShowHelp(false);
          } else if (menuItem === 'Help') {
            window.history.pushState(null, null, '/help');
            setShowEditProfile(false);
            setShowSettings(false);
            setShowHelp(true);
          } else {
            setShowEditProfile(false);
            setShowSettings(false);
            setShowHelp(false);
          }
        }
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('familyModalShown');
      auth.signOut();
      history.push('./');
    };

    useEffect(() => {
      const currentPath = window.location.pathname;

      if (currentPath === '/editprofile') {
        setActiveItem('Edit Profile');
      } else if (currentPath === '/settings') {
        setActiveItem('Settings');
      } else if (currentPath === '/help') {
        setActiveItem('Help');
      } else {
        setActiveItem(null);
      }
    }, []);


    return (
      <div className="settings-menu">
        <h1 className="title" aria-label="Account">Account</h1>
        <hr></hr>
        <div className="menu-items">
          <div className={`menu-item${activeItem === 'Edit Profile' ? ' active' : ''}`} onClick={handleClick} data-menu-item="Edit Profile" data-testid="edit-profile">
            <EditIcon className="icons"/> Edit Profile </div>
          <div className={`menu-item${activeItem === 'Settings' ? ' active' : ''}`} onClick={handleClick} data-menu-item="Settings" data-testid="settings">
            <SettingsIcon className="icons" /> Settings </div>
          <div className="menu-item go-back" onClick={() => window.location.href = './familyTree'}>
            <ArrowBackIosIcon className="icons"/> Go back </div>
          <div className="menu-item" onClick={handleLogout} data-menu-item="Log Out" data-testid="log-out">
            <LogoutIcon className="icons"/> Log Out </div>
          <div className={`menu-item${activeItem === 'Help' ? ' active' : ''}`} onClick={handleClick} data-menu-item="Help" data-testid="help" >
            <HelpIcon className="icons"/> Help </div>
        </div>
        {showEditProfile && <EditProfile />}
        {showSettings && <Settings />}
        {showHelp && <Help />}
      </div>
    );
};

export default Authentication(ManageAccount);