import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/login.css'; 

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(null);

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
            setErrors('Enter a valid email, please.');
        } else {
            setErrors('');
            // need to do :
            // coonect to database and check if user exists in database and if the password and email are correct 
            // if login is successful redirect to new page
            // if login unsuccessful display the appropriate error message
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
            <Link to="/signup" className="dont-have-an-account-already"> You don't have an account already? </Link>
            <Link to="/" className="go-back-to-the-homepage"> Go back to the homepage </Link>
        </form>
        </div>
    );
};
  

export default Login;
