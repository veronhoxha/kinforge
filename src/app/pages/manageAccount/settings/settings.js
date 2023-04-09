import React, { useState } from 'react';
import PasswordIcon from '@mui/icons-material/Password';
import { getAuth, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import '../../../styles/settings.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Settings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const auth = getAuth();

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
  };

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
      </div>
    </div>
  );
  }
  
  export default Settings;
