import React from 'react';
import { auth, db } from '../../../firebase';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import '../../styles/signup.css';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { getAuth, updateProfile } from 'firebase/auth';

const Signup = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');
    const history = useHistory();
    const usersCollection = collection(db, "users");

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const isValidPassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    const n = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    const signup = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setErrors('Fill in all fields, please.');
        } else if (!isValidEmail(email)) {
            setErrors('Enter a valid email address, please.');
        } else if (!isValidPassword(password)) {
            setErrors('Enter a valid password, please.');
        } else if (password !== confirmPassword) {
            setErrors('Passwords do not match.');
        } else {
            setErrors('');
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const uid = user.uid;
                    const displayName = `${firstName} ${lastName}`;
                    const authInstance = getAuth();
                
                updateProfile(authInstance.currentUser, {
                    displayName: displayName,
                });
                addDoc(usersCollection, {
                    name: firstName,
                    surname: lastName,
                    emailaddress: email,
                    uid: uid,
                });
                    history.push('../../login');
                })
                .catch((error) => {
                    console.log(error);
                    if (error.code === 'auth/email-already-in-use') {
                        setErrors('This email address is already in use.');
                    } else {
                        setErrors('An error occurred. Please try again later.');
                    }
                });
        }
    };

    return (
        <div className="signup">
            <form onSubmit={signup} className='signup-form'>
                <h1 className="title">Sign Up</h1>
                {errors && <p className="errors">{errors}</p>}
                <label htmlFor="firstName">First Name:</label>
                <input type="text" name="firstName" value={firstName} onChange={n} />
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" name="lastName" value={lastName} onChange={n} />
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" value={email} onChange={n} />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" value={password} onChange={n} />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input type="password" name="confirmPassword" value={confirmPassword} onChange={n} />
                <button type="signup-button" onClick={signup}>Sign Up</button>
                <Link to="/login" className="already-have-an-account">You already have an account?</Link>
                <Link to="/" className="go-back-to-the-homepage">Go back to the homepage</Link>
            </form>
            {/* <p className="password-requirements">Password must be at least 8 characters with 1 lower case letter, 1 upper case letter, 1 number, and 1 special character.</p> */}
        </div>
    );
};

export default Signup;