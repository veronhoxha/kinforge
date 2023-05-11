import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db } from '../../../../firebase';
import { getFirestore, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import '../../../styles/editprofile.css';
import profile_pic from '../../../media/no-photo.png';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Authentication from '../../../../Authentication';
import Tooltip from '@mui/material/Tooltip';

const EditProfile = () => {
  const [name, setFirstName] = useState('');
  const [surname, setLastName] = useState('');
  const [emailaddress, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState(null); 
  const [errors, setErrors] = useState('');
  const [profilePicture, setProfilePicture] = useState(profile_pic);
  const [openModal, setOpenModal] = useState(false);
  const [noPhoto, setNoPhoto] = useState(false);
  const auth = getAuth();
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [editIconDisabled, setEditIconDisabled] = useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  const editIconStyle = {
    cursor: 'pointer',
  };

  const hiddenFileInputStyle = {
    display: 'none',
  };
  
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
    setErrors('');
  };
        
  const reauthenticateUser = async (currentUser, originalEmail, password) => {
    const credentials = EmailAuthProvider.credential(originalEmail, password);
    return await reauthenticateWithCredential(currentUser, credentials);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!userId) {
      showSnackbar("User not found", "error");
      return;
    }
  
    const displayName = `${name} ${surname}`;
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
    } catch (error) {
      showSnackbar("Error updating the display name: ", "error");
      return;
    }
  
    try {
      await updateEmail(auth.currentUser, emailaddress);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        showSnackbar("Password is required to update your email.", "error");
    
        setTimeout(async () => {
          const currentPassword = prompt("Please enter your current password to confirm the email change:");
    
          if (!currentPassword) {
            showSnackbar("Password is required to update your email.", "error");
            return;
          }
    
          try {
            await reauthenticateUser(auth.currentUser, currentUser.email, currentPassword);
            await updateEmail(auth.currentUser, emailaddress);
          } catch (reauthError) {
            showSnackbar("Error re-authenticating: ", "error");
            return;
          }
        }, 500);
      } else {
        showSnackbar("Error updating the email: ", "error");
        return;
      }
    }    

    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('uid', '==', currentUser.uid));
  
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      showSnackbar("No matching documents found!", "error");
      return;
    }
  
    querySnapshot.forEach(async (doc) => {
      const userRef = doc.ref;
      await updateDoc(userRef, {
        name,
        surname,
        emailaddress
      });
    });
  
    showSnackbar("Your changes were saved successfully!", "success");
  };

  const validEmail = (e) => {
    e.preventDefault();
    if (emailaddress === currentUser.email) {
      handleSubmit(e);
    } else if (!isValidEmail(emailaddress)) {
      setErrors('Enter a valid email address, please.');
    } else {
      setErrors('');
      const usersRef = collection(db, "users");
      const queryRef = query(usersRef, where("emailaddress", "==", emailaddress));
      getDocs(queryRef)
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            setErrors('This email address is already in use.');
          } else {
            handleSubmit(e);
          }
        });
    }
  };
  
  const handleCancel = () => {
    if (currentUser) {
      setFirstName(currentUser.displayName.split(' ')[0]);
      setLastName(currentUser.displayName.split(' ')[1]);
      setEmail(currentUser.email);
      setErrors()
    }
  };

  useEffect(() => {
    setEditIconDisabled(false);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setFirstName(user.displayName.split(' ')[0]);
        setLastName(user.displayName.split(' ')[1]);
        setEmail(user.email);
        setCurrentUser(user);
        setUserId(user.uid);
  
        const userData = await getUserProfileData(user.uid);
  
        if (userData && userData.photoURL) {
          setProfilePicture(userData.photoURL);
          setNoPhoto(false);
        } else {
              setProfilePicture(profile_pic);
              setNoPhoto(true);
        }
      } else {
            setProfilePicture(profile_pic);
            setNoPhoto(true);
      }
    });
  
    return () => {
      const inputElement = document.getElementById("profile-picture");
      if (inputElement) {
        inputElement.value = null;
      }
      unsubscribe();
    };
  }, [auth]);
  
  
  const handleProfilePictureChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
      uploadProfilePicture(file);
    }
    handleModal();
  };
  
  const deleteProfilePicture = async (e) => {
    const storage = getStorage();
    const imageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
    try {
      await deleteObject(imageRef);
      setProfilePicture(profile_pic);
      setNoPhoto(true);
      setCurrentUser({
        ...currentUser,
        photoURL: null,
      });

      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', currentUser.uid));
  
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.error("No matching documents found!");
        return;
      }
    
      querySnapshot.forEach(async (doc) => {
        const userRef = doc.ref;
        await updateDoc(userRef, {
          photoURL: null,
        });
      });
    
      setProfilePicture(profile_pic);
      setNoPhoto(true);
  
    } catch (error) {
      console.error('Error deleting the profile picture:', error);
    }
  };
  
  const uploadProfilePicture = (file) => {
    const storage = getStorage();
    const imageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
  
    const uploadTask = uploadBytesResumable(imageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {;
      },
      (error) => {
        console.error('Error uploading the profile picture:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setProfilePicture(downloadURL);
          setNoPhoto(false);
  
          try {
            await updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            });
          } catch (error) {
            console.error('Error updating the user profile:', error);
          }
  
          setCurrentUser({
            ...currentUser,
            photoURL: downloadURL || profile_pic,
          });
  
          const db = getFirestore();
          const usersCollection = collection(db, 'users');
          const q = query(usersCollection, where('uid', '==', currentUser.uid));
  
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            console.error("No matching documents found!");
            return;
          }
  
          querySnapshot.forEach(async (doc) => {
            const userRef = doc.ref;
            await updateDoc(userRef, {
              photoURL: downloadURL,
            });
          });
        });
      }
    );
  };

  const handleDeleteAndModal = () => {
    deleteProfilePicture();
    handleModal();
  }

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

  
  return (
    <div className="edit-profile" data-testid="editprofile-component">
      <h2>Edit Profile</h2>
      {currentUser ? (
        <>
         <div className="profile-picture-container">
         {noPhoto ? (
          <img src={profile_pic} alt="User's Profile" style={{ borderRadius: '50%', objectFit: 'cover', width: '150px', height: '150px', border: '3px solid #ccc' }} />
        ) : (
          <img src={profilePicture} alt="User's Profile" style={{ borderRadius: '50%', objectFit: 'cover', width: '150px', height: '150px', border: '3px solid #ccc' }} />
        )}
          <div className="edit-icon" data-testid="edit-icon">
          <EditIcon size={24} style={editIconStyle} onClick={handleModal} disabled={editIconDisabled} />
            <input type="file" id="profile-picture" accept="image/*" style={hiddenFileInputStyle} onChange={handleProfilePictureChange}  onClick={(e) => e.stopPropagation()}/>
          </div>
          <Modal open={openModal} onClose={handleModal} className="my-modal" >
            <Box
              className="my-modal"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h3>Profile Picture Options</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <button type="button" onClick={() => document.getElementById("profile-picture").click()} style={{ marginRight: '8px' }}>
                  Edit Photo
                </button>
                <button type="button" onClick={handleDeleteAndModal} style={{ marginRight: '8px' }}>
                  Delete Photo
                </button>
                <button type="button" onClick={handleModal}>
                  Cancel
                </button>
              </div>
            </Box>
            </Modal>
          </div>
          <div className="edit-profile-wrapper">
          <form onSubmit={validEmail} className="profile-form">
            <label htmlFor="firstName">First Name:</label>
            <Tooltip title="Max 20 characters" placement="top-end"> 
            <input type="text" id="firstName" name='firstName' maxLength='20' value={name || ''} required onChange={(e) => setFirstName(e.target.value)} />
            </Tooltip>

            <label htmlFor="lastName">Last Name:</label>
            <Tooltip title="Max 20 characters" placement="top-end"> 
            <input type="text" id="lastName" name='lastName' maxLength='20' placeholder="Max 20 characters" value={surname || ''} required onChange={(e) => setLastName(e.target.value)} />
            </Tooltip>
            
            <div className="input-wrapper">
              <label htmlFor="email">Email Address:</label>
              {errors && <p className="error-message">{errors}</p>}
              <input type="email" id="email" name='email' value={emailaddress || ''} required onChange={(e) => setEmail(e.target.value)} />
            </div>
  
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </form>
          </div>
          
        </>
      ) : (
        <></>
      )}
          <Snackbar
            className="my-snackbar"
            open={!!snackbarMessage}
            autoHideDuration={6000}
            onClose={() => setSnackbarMessage(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbarMessage(null)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
      </div>
  );
};

export default Authentication(EditProfile);