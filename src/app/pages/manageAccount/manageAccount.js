import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { auth } from '../../../firebase';
import '../../styles/manageAccount.css';
import Authentication from '../../../Authentication';

const ManageAccount = () => {

  const handleClick = (e) => {
    const isLogout = e.currentTarget.classList.contains('logout');
  
    if (!isLogout) {
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.classList.remove('active');
      });
      e.currentTarget.classList.add('active');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };


  return (
    <div className="settings-menu">
    <h1 className="title">Account</h1>
    <hr></hr>
    <div className='menu-items'>
      <div className="menu-item" onClick={handleClick}>
        <a href="./manageAccount">
          <EditIcon className='icons'/>
          Edit Profile
        </a>
      </div>
      <div className="menu-item" onClick={handleClick}>
        <a href="./manageAccount">
          <SettingsIcon className='icons'/>
          Settings
        </a>
      </div>
      <div className="menu-item go-back" onClick={handleClick}>
        <a href="./familyTree">
          <ArrowBackIosIcon className='icons'/>
          Go back
        </a>
      </div>
      <div className="menu-item logout" onClick={handleLogout}>
        <a href="./">
          <LogoutIcon className='icons'/>
          Log Out
        </a>
      </div>
      <div className="menu-item" onClick={handleClick}>
        <a href="./manageAccount">
          <HelpIcon className='icons'/>
          Help
        </a>
      </div>
      </div>
    </div>
  );
};

export default Authentication(ManageAccount);
