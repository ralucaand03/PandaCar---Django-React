import React, { useState } from 'react';
import './SignupForm.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

const SignupForm = () => {

    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "phone") {
            setPhone(value.replace(/[^0-9]/g, '')); 
        }
        else if (name === "firstName" || name === "lastName") {
            const sanitizedValue = value.replace(/[^a-zA-Z\s-]/g, '');
            if (name === "firstName") {
                setFirstName(sanitizedValue);
            } else if (name === "lastName") {
                setLastName(sanitizedValue);
            }
        }
    };

    return (
        <div className='wrapper'>
            <form action="">
                <h1>SignUp</h1>

                <div className='input-box'>
                    <input
                        type="text"
                        placeholder='First Name'
                        name="firstName"
                        value={firstName}
                        onChange={handleInputChange} 
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-box'>
                    <input
                        type="text"
                        placeholder='Last Name'
                        name="lastName"
                        value={lastName}
                        onChange={handleInputChange} 
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-box'>
                    <input type="email" placeholder='Email' required />
                    <FaEnvelope className='icon' />
                </div>

                <div className='input-box'>
                    <input
                        type="tel"
                        placeholder='Phone Number'
                        name="phone"
                        value={phone}
                        onChange={handleInputChange} 
                        required
                    />
                    <FaPhone className='icon' />
                </div>

                <div className='input-box'>
                    <input type="date" placeholder='dd-mm-yyyy' required />
                    <FaCalendarAlt className='icon' />
                </div>

                <div className='input-box'>
                    <input type="password" placeholder='Enter Password' required />
                    <FaLock className='icon' />
                </div>

                <div className='input-box'>
                    <input type="password" placeholder='Confirm Password' required />
                    <FaLock className='icon' />
                </div>

                <button type='submit'>Create Account</button>

            </form>

        </div>
    );
};

export default SignupForm;
