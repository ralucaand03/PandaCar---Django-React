import React, { useState,useEffect  } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import pandaIcon from '../Assets/panda4.png';  // Import your icon image

const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const fetchAPI = async (userCredentials) => {

        console.log(userCredentials);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCredentials),
                credentials: 'include', //include cookies in request for the server
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                setErrorMessage("Error logging in!");
                setSuccessMessage('');
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            const { role } = data; 

            console.log(role);
            setSuccessMessage('Login successful!');
            setErrorMessage('');

            if (role === 'admin') {
                navigate('/admin');
            } else {
                // Navigate to the home page if the role is not admin
                navigate('/home');
            }
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage("Something went wrong!");
            console.error('Error:', error.message);
        }
    };

    const handleLoginUser = async (event) => {
        event.preventDefault();

        const userCredentials = {
            email: email,
            password: password,
        };

        fetchAPI(userCredentials);
    };

    return (
        <div className='contentlogin'>
            {/* Header with brand name */}
            <div className="login-header">
                <span className="login-brand-name">
                    <img src={pandaIcon} alt="Panda Icon" className="login-panda-icon" />
                    PandaCar
                </span>
            </div>

            <div className='wrapper'>
                <form onSubmit={handleLoginUser}>
                    <h1>Login</h1>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <div className='input-box'>
                        <input
                            type="text"
                            placeholder='Email'
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            required
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            required
                        />
                        <FaLock className='icon' />
                    </div>

                    <button type='submit' className="submit">Submit</button>

                    <div className='register-link'>
                        <p>Don't have an account? <Link to="/signup">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
