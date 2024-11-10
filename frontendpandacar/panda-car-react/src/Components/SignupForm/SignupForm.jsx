import React, { useState } from 'react';
import './SignupForm.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

const SignupForm = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


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
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "dateOfBirth") {
            setDateOfBirth(value);
        } else if (name === "password") {
            setPassword(value);
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
        }
    };

    const fetchAPI = async (userData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleCreateAccount = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const newUserData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone,
            date_of_birth: dateOfBirth,
            password: password,
            is_admin: false,
        };

        fetchAPI(newUserData);

    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleCreateAccount}>
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
                    <input type="email"
                        placeholder='Email'
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        required />
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
                    <input type="date"
                        placeholder='dd-mm-yyyy'
                        name="dateOfBirth"
                        value={dateOfBirth}
                        onChange={handleInputChange}
                        required />
                    <FaCalendarAlt className='icon' />
                </div>

                <div className='input-box'>
                    <input type="password"
                        placeholder='Enter Password'
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        required />
                    <FaLock className='icon' />
                </div>

                <div className='input-box'>
                    <input type="password"
                        placeholder='Confirm Password'
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        required />
                    <FaLock className='icon' />
                </div>

                <button type='submit'>Create Account</button>

            </form>

        </div>
    );
};

export default SignupForm;