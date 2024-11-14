import React, { useState } from "react";
import './AdminDashbord.css';
import pandaIcon from '../Assets/panda3.png';

const AdminDashbord = () => {
    const [data, setData] = useState({
        users: [],
        cars: [],
        availabilities: []
    });
    const [loading, setLoading] = useState({
        users: false,
        cars: false,
        availabilities: false
    });
    const [error, setError] = useState({
        users: null,
        cars: null,
        availabilities: null
    });
    const [showData, setShowData] = useState({
        users: false,
        cars: false,
        availabilities: false
    });

    const [createError, setCreateError] = useState(null);
    const [createSuccess, setCreateSuccess] = useState(null);

    const [showCreateUserForm, setShowCreateUserForm] = useState(false);

    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        isAdmin: false,
        dateOfBirth: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setNewUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleCreateUserForm = () => {
        setShowCreateUserForm(prev => !prev);
    };

    const fetchAPI = async (endpoint, dataKey) => {
        setLoading(prev => ({ ...prev, [dataKey]: true }));
        setError(prev => ({ ...prev, [dataKey]: null }));

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                setError(prev => ({ ...prev, [dataKey]: `Error fetching ${endpoint}!` }));
                throw new Error(JSON.stringify(errorData));
            }

            const responseData = await response.json();
            setData(prevState => ({
                ...prevState,
                [dataKey]: responseData
            }));
        } catch (error) {
            setError(prev => ({ ...prev, [dataKey]: `Failed to fetch ${endpoint}` }));
        }
        setLoading(prev => ({ ...prev, [dataKey]: false }));
    };

    const toggleDataVisibility = (dataKey) => {
        setShowData(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));

        if (!showData[dataKey]) {
            fetchAPI(dataKey, dataKey);
        }
    };

    const handleCreateUser = async (event) => {
        event.preventDefault();
        setCreateError(null);
        setCreateSuccess(null);
        try {

            if (newUser.password !== newUser.confirmPassword) {
                setCreateError('Passwords do not match');
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/api/users/create', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: newUser.firstName,
                    last_name: newUser.lastName,
                    email: newUser.email,
                    phone_number: newUser.phoneNumber,
                    password: newUser.password,
                    is_admin: newUser.isAdmin,
                    date_of_birth: newUser.dateOfBirth
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating user:', errorData);
                setCreateError('Error creating user. Please check the input data.');
                return;
            }

            setNewUser({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                isStaff: false,
                isAdmin: false,
                dateOfBirth: '',
                password: '',
                confirmPassword: ''
            });

            setCreateSuccess('User created')

        } catch (error) {
            setCreateError('Failed to create user');
            console.log(error);
        }
    }


    return (
        <div className="contentAdmin">
            <div id="dashboard">
                {/* Admin Dashboard Header */}
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <span className="admin-brand-name">
                        <img src={pandaIcon} alt="Panda Icon" className="admin-panda-icon" />
                        PandaCar
                    </span>
                </div>

                {/* Users Section */}
                <div className="section" id="getUsersDiv">
                    <div className="button-container">
                        <button onClick={() => toggleDataVisibility('users')} className="get-users-btn">
                            {showData.users ? 'Hide Users' : 'Get Users'}
                        </button>
                    </div>
                    {showData.users && (
                        <>
                            {loading.users && <p>Loading...</p>}
                            {error.users && <p style={{ color: 'red' }}>{error.users}</p>}
                            <div className="users-list">
                                {data.users.length === 0 ? (
                                    <p>No users found</p>
                                ) : (
                                    data.users.map((user) => (
                                        <div key={user.id} className="user-card">
                                            <h3>{user.first_name} {user.last_name}</h3>
                                            <p>Email: {user.email}</p>
                                            <p>Phone: {user.phone_number}</p>
                                            <p>Staff: {user.is_staff ? 'Yes' : 'No'}</p>
                                            <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
                                            <p>Age: {user.date_of_birth}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Cars Section */}
                <div className="section" id="getCarsDiv">
                    <div className="button-container">
                        <button onClick={() => toggleDataVisibility('cars')} className="get-cars-btn">
                            {showData.cars ? 'Hide Cars' : 'Get Cars'}
                        </button>
                    </div>
                    {showData.cars && (
                        <>
                            {loading.cars && <p>Loading...</p>}
                            {error.cars && <p style={{ color: 'red' }}>{error.cars}</p>}
                            <div className="cars-list">
                                {data.cars.length === 0 ? (
                                    <p>No cars found</p>
                                ) : (
                                    data.cars.map((car) => (
                                        <div key={car.id} className="car-card">
                                            <h3>{car.car_name} ({car.brand_name})</h3>
                                            <img src={`http://127.0.0.1:8000${car.photo_url}`} alt={`${car.car_name} photo`} />
                                            <p>Id: {car.id}</p>
                                            <p>Image: {car.photo_name}</p>
                                            <p>Price per day: ${car.price_per_day}</p>
                                            <p>Fuel type: {car.fuel_type}</p>
                                            <p>Seats: {car.number_of_seats}</p>
                                            <p>Horsepower: {car.horse_power} HP</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Availability Section */}
                <div className="section" id="getAvailabilitiesDiv">
                    <div className="button-container">
                        <button onClick={() => toggleDataVisibility('availabilities')} className="get-availability-btn">
                            {showData.availabilities ? 'Hide Availabilities' : 'Get Car Availability'}
                        </button>
                    </div>
                    {showData.availabilities && (
                        <>
                            {loading.availabilities && <p>Loading...</p>}
                            {error.availabilities && <p style={{ color: 'red' }}>{error.availabilities}</p>}
                            <div className="availabilities-list">
                                {data.availabilities.length === 0 ? (
                                    <p>No availability data found</p>
                                ) : (
                                    data.availabilities.map((availability) => (
                                        <div key={availability.id} className="availability-card">
                                            <h3>{availability.car.car_name}</h3>
                                            <p>Available from: {availability.start_date}</p>
                                            <p>Available until: {availability.end_date}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Toggle Button for User Creation Form */}
                <div className="section" id="toggleCreateUserFormDiv">
                    <button onClick={toggleCreateUserForm} className="toggle-create-user-form-btn">
                        {showCreateUserForm ? 'Hide Create User Form' : 'Show Create User Form'}
                    </button>
                </div>

                {/* User Creation Form */}
                {showCreateUserForm && (
                    <div className="section" id="createUserDiv">
                        <h2>Create New User</h2>
                        <form className="create-user-form" onSubmit={handleCreateUser}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={newUser.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={newUser.lastName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                required
                                value={newUser.phoneNumber}
                                onChange={handleInputChange}
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={newUser.isAdmin}
                                    onChange={handleInputChange}
                                />
                                Is Admin
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Date of Birth"
                                required
                                value={newUser.dateOfBirth}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={newUser.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Create User</button>
                            {createUserError && <p style={{ color: 'red' }}>{createUserError}</p>}
                            {createUserSuccess && <p style={{ color: 'green' }}>{createUserSuccess}</p>}
                        </form>
                    </div>
                )}


            </div>
        </div>
    );
};
export default AdminDashbord;
