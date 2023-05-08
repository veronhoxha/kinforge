import React from 'react';
import { auth, db } from '../../../firebase';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import '../../styles/signup.css';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { getAuth, updateProfile } from 'firebase/auth';
import { query, where, getDocs } from "firebase/firestore";

const SignUp = () => {

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
            setErrors('Password must be at least eight characters long with one lower case letter, one upper case letter, one number, and one special character.');
        } else if (password !== confirmPassword) {
            setErrors('Passwords do not match.');
        } else {
            setErrors('');
            const usersRef = collection(db, "users");
            const queryRef = query(usersRef, where("emailaddress", "==", email));
            getDocs(queryRef)
            .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                setErrors('This email address is already in use.');
                } else {
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
            })
            .catch((error) => {
                console.log(error);
                setErrors('An error occurred. Please try again later.');
            });
        }
    };

    return (
        <div className="signup">
            <form onSubmit={signup} className='signup-form'>
                <h1 className="title">Sign Up</h1>
                {errors && <p className="errors" data-testid="errors">{errors}</p>}
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" maxLength='20' placeholder="Max 20 characters" value={firstName} onChange={n} />
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" maxLength='20' placeholder="Max 20 characters" value={lastName} onChange={n} />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={n} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={n} aria-label="Enter Password" />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={n} aria-label="Enter Confirm Password" />
                <button type="signup-button" onClick={signup} data-testid="signup-button">Sign Up</button>
                <Link to="/login" className="already-have-an-account">You already have an account?</Link>
                <Link to="/" className="go-back-to-the-homepage">Go back to the homepage</Link>
            </form>
        </div>
    );
};

export default SignUp;