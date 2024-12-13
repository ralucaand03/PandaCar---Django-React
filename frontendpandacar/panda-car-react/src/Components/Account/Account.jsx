import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Account.css';
import pandaProfile from '../Assets/panda5.png';


const Account = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        is_admin: false
    });
    const [error, setError] = useState('');

    // Fetch user data from the backend API
    const fetchUserData = async () => {

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/myaccount/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError('Error fetching user data');
                console.error(errorData);
                return;
            }

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            setError('Error fetching user data');
            console.error(error);
        }
    };

    // Handle the logout action
    const handleLogout = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/logout/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error logging out:", errorData);
                throw new Error("Logout failed");
            }

            console.log("Successfully logged out");
            navigate("/");

        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);
    return (
        <div className="accountWrapper">
            <Header />
            <div className="contentAccount">
                <main className="mainContentAccount">
                    <span className="Panda-profile-content">
                        <img src={pandaProfile} alt="Panda Profile" className="panda-profile" />
                    </span>

                    <h1>Your Account Details</h1>
                    {error && <p className="error">{error}</p>}
                    <div>
                        <p><strong>First Name:</strong> {userData.first_name || 'Loading...'}</p>
                        <p><strong>Last Name:</strong> {userData.last_name || 'Loading...'}</p>
                        <p><strong>Email:</strong> {userData.email || 'Loading...'}</p>
                        <p><strong>Phone Number:</strong> {userData.phone_number || 'Loading...'}</p>
                        <p><strong>Date of Birth:</strong> {userData.date_of_birth || 'Loading...'}</p>
                    </div>
                    <button className="logoutButton" onClick={handleLogout}>Log Out</button>
                </main>
            </div>
        </div>
    );
};

export default Account;
