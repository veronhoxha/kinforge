import React from 'react';
import { auth } from '../../../firebase';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/login.css'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {

    document.cookie = 'cookieName=cookieValue; SameSite=Lax;';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);
    const history = useHistory();

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const emailChanging = (e) => {
        setEmail(e.target.value);
    };

    const passwordChanging = (e) => {
        setPassword(e.target.value);
    };

    const login = (e) => {
        e.preventDefault();
    
        if (!email && !password ) {
            setErrors('Enter your email address and password, please.');
        } else if (!password) {
            setErrors('Enter your password, please.');
        } else if (!email) {
            setErrors('Enter your email address, please.');
        } else if (!isValidEmail(email)) {
            setErrors('Enter a valid email address, please.');
        } else {
            setErrors('');
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setErrors(null);
                console.log('User logged in successfully:', user);
                history.push('../../familyTree');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                    setErrors('Invalid email or password. Please try again.');
                } else if (errorCode === 'auth/too-many-requests') {
                    setErrors('To many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');
                } else {
                    setErrors(errorMessage);
                }
                console.error('Error signing in:', error);
            });
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (!email) {
            setErrors("Please enter your email address and click 'Forgot your password?' again to receive a password reset link. Make sure to check your spam folder.");

        } else {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    setErrors(`Password reset email sent to ${email}.`);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/user-not-found') {
                        setErrors('This user does not exist. Cannot send a reset password email.');
                    } if (errorCode === 'auth/invalid-email') {
                        setErrors('Enter a valid email address, please.');
                    } else {
                        setErrors(errorMessage);
                    }
                });
        }
    };

    return (
        <div className="login">
        <form onSubmit={login} className="login-form">
            <h1 className='title'>Login</h1>
            {errors && <p className="errors">{errors}</p>}
            <label>Email:
                <input type="email" value={email} onChange={emailChanging}></input>
            </label>
            <label>Password: 
                <input type="password" value={password} onChange={passwordChanging}></input>
            </label>
            <button type="login-button">Login</button>
            <a href="/#" onClick={handleForgotPassword}>Forgot your password?</a>
            <Link to="/signup" className="dont-have-an-account-already"> You don't have an account already? </Link>
            <Link to="/" className="go-back-to-the-homepage"> Go back to the homepage </Link>
        </form>
        </div>
  );
};

export default Login;
