import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential  } from "firebase/auth";
import { db } from '../../../../firebase';
import { getFirestore, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import '../../../styles/editprofile.css';
import profile_pic from '../../../pages/familyTree/veron.jpg';
import { MdEdit } from 'react-icons/md';

const EditProfile = () => {
  const [name, setFirstName] = useState('');
  const [surname, setLastName] = useState('');
  const [emailaddress, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState(null); 
  const [errors, setErrors] = useState('');
  const auth = getAuth();

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

        
  const reauthenticateUser = async (currentUser, originalEmail, password) => {
    const credentials = EmailAuthProvider.credential(originalEmail, password);
    return await reauthenticateWithCredential(currentUser, credentials);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!userId) {
      alert("User not found");
      return;
    }
  
    const displayName = `${name} ${surname}`;
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
    } catch (error) {
      alert("Error updating the display name: " + error.message);
      return;
    }
  
    try {
      await updateEmail(auth.currentUser, emailaddress);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        const currentPassword = prompt("Please enter your current password to confirm the email change:");
  
        if (!currentPassword) {
          alert("Password is required to update your email.");
          return;
        }
  
        try {
          await reauthenticateUser(auth.currentUser, currentUser.email, currentPassword);
          await updateEmail(auth.currentUser, emailaddress);
        } catch (reauthError) {
          alert("Error re-authenticating: " + reauthError.message);
          return;
        }
      } else {
        alert("Error updating the email: " + error.message);
        return;
       }
    }
  
  
    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('uid', '==', currentUser.auth.lastNotifiedUid));
  
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("No matching documents found!");
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
  
    alert("Your changes were saved successfully!");
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

  // console.log(currentUser);

  const handleCancel = () => {
    if (currentUser) {
      setFirstName(currentUser.displayName.split(' ')[0]);
      setLastName(currentUser.displayName.split(' ')[1]);
      setEmail(currentUser.email);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirstName(user.displayName.split(' ')[0]);
        setLastName(user.displayName.split(' ')[1]);
        setEmail(user.email);
        setCurrentUser(user);
        setUserId(user.uid); 
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      {currentUser ? (
        <>
          <div className="profile-picture-container">
            <img src={profile_pic} alt="User's Profile" className="profile-picture" />
            <div className="edit-icon">
              <MdEdit size={24} />
            </div>
          </div>
          <form onSubmit={validEmail} className="profile-form">
            <label htmlFor="first-name">First Name:</label>
            <input type="text" id="first-name" value={name || ''} required onChange={(e) => setFirstName(e.target.value)} />
  
            <label htmlFor="last-name">Last Name:</label>
            <input type="text" id="last-name" value={surname || ''} required onChange={(e) => setLastName(e.target.value)} />
  
            <label htmlFor="email">Email Address:</label>
            <input type="email" id="email" value={emailaddress || ''} required onChange={(e) => setEmail(e.target.value)} />
  
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </form>
          {errors && <p className="error-message">{errors}</p>}
        </>
      ) : (
        <p>Something went wrong...</p>
      )}
    </div>
  );
};

export default EditProfile;
