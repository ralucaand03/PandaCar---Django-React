import React from 'react';
import './SignupForm.css';
import { FaUser,FaLock } from "react-icons/fa";

const SignupForm = () => {
    return(
        <div className='wrapper'>
            <form action="">
                <h1>SignUp</h1>

                <div className='input-box'>
                    <input type = "text" placeholder='Username' required/>
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type = "password" placeholder='Password' required/>
                    <FaLock className='icon' />
                </div>

                <button type='submit'>Create Account</button>

            </form>
            
        </div>
    );
};

export default SignupForm;