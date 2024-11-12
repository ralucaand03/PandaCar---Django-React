import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
<<<<<<< HEAD
import { Link,useNavigate  } from 'react-router-dom';

const LoginForm = () => {

    const [errorMessage, setErrorMessage] = useState("");  // some css, te las Raluca sa faci cum vrei tu, clasa e deja definita, vezi in form
    const [successMessage, setSuccessMessage] = useState(""); // some css, te las Raluca sa faci cum vrei tu, clasa e deja definita, vezi in form
=======
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
>>>>>>> frontend
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "email") {
            setEmail(value);
<<<<<<< HEAD
        }
        else if (name === "password") {
=======
        } else if (name === "password") {
>>>>>>> frontend
            setPassword(value);
        }
    };

<<<<<<< HEAD
    const fetchAPI = async (userCredetials) => {

=======
    const fetchAPI = async (userCredentials) => {
>>>>>>> frontend
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
<<<<<<< HEAD
                body: JSON.stringify(userCredetials),
=======
                body: JSON.stringify(userCredentials),
>>>>>>> frontend
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
<<<<<<< HEAD
                setErrorMessage("Error at loging in account!");
=======
                setErrorMessage("Error logging in!");
>>>>>>> frontend
                setSuccessMessage('');
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
<<<<<<< HEAD
            const { access, refresh, role } = data // get access and refresh jwt tokens

            //save them in local storage, maybe future implementation with cookies
=======
            const { access, refresh, role } = data; // Get access and refresh JWT tokens

            // Save them in local storage (or use cookies in the future)
>>>>>>> frontend
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            setSuccessMessage('Login successful!');
            setErrorMessage('');

            if (role === 'admin') {
<<<<<<< HEAD
                navigate('/admindashboard');
            } else {
                // navigate('/home');
            }

            //need to create home page and use navigate
            //const navigate = useNavigate();
            //example: navigate('/home'); 

=======
                navigate('/admin');
            } else {
                // Navigate to the home page if the role is not admin
                navigate('/home');
            }
>>>>>>> frontend
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage("Something went wrong!");
            console.error('Error:', error.message);
        }
<<<<<<< HEAD


    }
=======
    };
>>>>>>> frontend

    const handleLoginUser = async (event) => {
        event.preventDefault();

<<<<<<< HEAD
        const userCredetials = {
            email: email,
            password: password,
        }

        fetchAPI(userCredetials);
    }

    return (
        <div className='wrapper'>
            <form onSubmit={handleLoginUser}>
                <h1>Login</h1>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className='input-box'>
                    <input type="text"
                        placeholder='Email'
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        required />
                    <FaUser className='icon' />
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

                <button type='submit'>Submit</button>
                <div className='register-link'>
                    <p>Don't have an account? <Link to="/signup">Register</Link></p>
                </div>

            </form>

=======
        const userCredentials = {
            email: email,
            password: password,
        };

        fetchAPI(userCredentials);
    };

    return (
        <div className='contentlogin'>
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
>>>>>>> frontend
        </div>
    );
};

<<<<<<< HEAD
export default LoginForm;
=======
export default LoginForm;
>>>>>>> frontend
