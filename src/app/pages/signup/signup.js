import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/signup.css';

const Signup = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

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

    const singup = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setErrors('Fill in all fields, please.');
        } else if (!isValidEmail(email)) {
            setErrors('Enter a valid email address, please.');
        } else if (password !== confirmPassword) {
            setErrors('Passwords do not match.');
        } else {
            setErrors('');
        // need to do :
        // send form data to server and handle response accordingly
        // redirect to log in page if the signup is succesful
        }
    };

    return (
        <div className="signup">
        <form onSubmit={singup} className='signup-form'>
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
            <button type="signup-button">Sign Up</button>
            <Link to="/login" className="already-have-an-account">You already have an account?</Link>
            <Link to="/" className="go-back-to-the-homepage">Go back to the homepage</Link>
        </form>
        </div>
    );
};

export default Signup;
