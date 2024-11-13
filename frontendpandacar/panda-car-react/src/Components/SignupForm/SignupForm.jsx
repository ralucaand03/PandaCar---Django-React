import React, { useState } from 'react';
import './SignupForm.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import pandaIcon from '../Assets/panda4.png';

const SignupForm = () => {
    const navigate = useNavigate();  // Hook to navigate to other pages

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "phone") {
            setPhone(value.replace(/[^0-9]/g, ''));
        } else if (name === "firstName" || name === "lastName") {
            const sanitizedValue = value.replace(/[^a-zA-Z\s-]/g, '');
            if (name === "firstName") {
                setFirstName(sanitizedValue);
            } else if (name === "lastName") {
                setLastName(sanitizedValue);
            }
        } else {
            // Handle other fields
            if (name === "email") setEmail(value);
            if (name === "dateOfBirth") setDateOfBirth(value);
            if (name === "password") setPassword(value);
            if (name === "confirmPassword") setConfirmPassword(value);
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
                setErrorMessage("Error at creating account!");
                setSuccessMessage('');
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            console.log('Success:', data);
            setErrorMessage('');
            setSuccessMessage("Account created successfully!");
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage("Something went wrong!");
            console.error('Error:', error.message);
        }
    };

    const handleCreateAccount = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            setSuccessMessage('');
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

    // Handle "Go to Login Page" button click
    const handleGoToLogin = () => {
        navigate('/'); // Redirect to the login page
    };

    return (
        <div className='contentsignup'>
            <div className="login-header">
                <span className="login-brand-name">
                    <img src={pandaIcon} alt="Panda Icon" className="login-panda-icon" />
                    PandaCar
                </span>
            </div>
            <div className='sgnwrapper'>
                <form onSubmit={handleCreateAccount}>
                    <h1>SignUp</h1>

                    {errorMessage && <div className="error-message">{errorMessage}</div>} 
                    {successMessage && (
                        <div className="success-message-modal">
                            <div className="modal-content">
                                <p>{successMessage}</p>
                                <button className="go-to-login-btn" onClick={handleGoToLogin}>
                                    Go to Log in Page
                                </button>
                            </div>
                        </div>
                    )}

                    <div className='sgninput-box'>
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

                    <div className='sgninput-box'>
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

                    <div className='sgninput-box'>
                        <input type="email"
                            placeholder='Email'
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            required />
                        <FaEnvelope className='icon' />
                    </div>

                    <div className='sgninput-box'>
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

                    <div className='sgninput-box'>
                        <input type="date"
                            placeholder='dd-mm-yyyy'
                            name="dateOfBirth"
                            value={dateOfBirth}
                            onChange={handleInputChange}
                            required />
                        <FaCalendarAlt className='iconDate' />
                    </div>

                    <div className='sgninput-box'>
                        <input type="password"
                            placeholder='Enter Password'
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            required />
                        <FaLock className='icon' />
                    </div>

                    <div className='sgninput-box'>
                        <input type="password"
                            placeholder='Confirm Password'
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleInputChange}
                            required />
                        <FaLock className='icon' />
                    </div>

                    <button type='submit'  className="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
