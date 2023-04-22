import React, { useState, useEffect } from 'react';
import PasswordIcon from '@mui/icons-material/Password';
import { getAuth, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import '../../../styles/settings.css'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { brown } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import "../../../styles/hierarchy.css";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";


function Settings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showHierarchyForm, setShowHierarchyForm] = useState(false);
  const [activeSwitch, setActiveSwitch] = useState(1);
  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;


  const handleSwitchToggle = async (event) => {
    const switchIndex = parseInt(event.target.name.replace("switch", ""), 10);
    setActiveSwitch(switchIndex);
    await saveDesignChoice(auth.currentUser.uid, switchIndex);
  };  
  
  const loadActiveSwitchFromFirestore = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const designDocRef = doc(db, 'users_designs', userId);
      const designDocSnap = await getDoc(designDocRef);
  
      if (designDocSnap.exists()) {
        setActiveSwitch(designDocSnap.data().activeSwitch);
      } else {
        setActiveSwitch(1);
      }
    } else {
    }
  };

  const saveDesignChoice = async (userId, designChoice) => {
    const designDocRef = doc(db, 'users_designs', userId);
    await setDoc(designDocRef, { addedBy: currentUser.uid, activeSwitch: designChoice });
  };
  

  const handleToggleHierarchyForm = () => {
    setShowHierarchyForm(!showHierarchyForm);
  };

  const BrownSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: brown[600],
      '&:hover': {
        backgroundColor: alpha(brown[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: brown[600],
    },
  }));

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };  

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };


  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const isValidPassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const errors = {};
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      errors.currentPassword = "Fill in all fields, please.";
    }
    if (!isValidPassword(newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "New password and confirm password must match.";
    }
  
    if (Object.keys(errors).length === 0) {
      try {
        await signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword);
      } catch (error) {
        errors.currentPassword = "Current password is incorrect.";
      }
      if (!errors.currentPassword) {
        try {
          await updatePassword(auth.currentUser, newPassword);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setErrors({});
          setSnackbarOpen(true); 
          setShowPasswordForm(false);
        } catch (error) {
          setErrors({ submit: error.message });
        }
      } else {
        setErrors(errors);
      }
    } else {
      setErrors(errors);
    }
  };

  const handleTogglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadActiveSwitchFromFirestore();
      } else {
      }
    });
    return () => {
      unsubscribe();
    };
  }, [auth, loadActiveSwitchFromFirestore]);  
  
  
  return (
    <div className="settings">
      <div className="settings-content">
      <h2>Settings</h2>
      <div onClick={handleTogglePasswordForm} className="change-password">
        <PasswordIcon />
        Change Password
      </div>
      {showPasswordForm && (
      <div className="settings-form-wrapper">
        <form onSubmit={handleSubmit} className="settings-from">
          <div>
            {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
            <label htmlFor="current-password">Current Password:</label>
            <input type="password" id="current-password" value={currentPassword} onChange={handleCurrentPasswordChange} />
          </div>
          <div>
            <label htmlFor="new-password">New Password:</label>
            <input type="password" id="new-password" value={newPassword} onChange={handleNewPasswordChange} className={errors.newPassword && 'error'} />
            {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} className={errors.confirmPassword && 'error'} />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>
          <div className="button-container">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
          {errors.submit && <p className="error-message">{errors.submit}</p>}
        </form>
      </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Password changed successfully!
        </Alert>
      </Snackbar>
      <div onClick={handleToggleHierarchyForm} className="hierarchy">
          <AccountTreeIcon />
          Hierarchy design
        </div>
        {showHierarchyForm && (
          <div className="hierarchy-form-wrapper">
           <FormControlLabel
            control={<BrownSwitch checked={activeSwitch === 1} onChange={handleSwitchToggle} name="switch1"/>}
            label="Rectangle Nodes"
          />
          <FormControlLabel
            control={<BrownSwitch checked={activeSwitch === 2} onChange={handleSwitchToggle} name="switch2"/>}
            label="Ellipse Nodes"
          />
          <FormControlLabel
            control={<BrownSwitch checked={activeSwitch === 3} onChange={handleSwitchToggle} name="switch3"/>}
            label="Oval Nodes"
          />
          </div>
        )}
      </div>
    </div>
  );
  }
  
  export default Settings;
