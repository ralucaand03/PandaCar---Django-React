import React, { useState, useRef, useEffect } from "react";
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
    const [showCreateCarForm, setShowCreateCarForm] = useState(false);
    const [showCreateAvailabilityForm, setShowCreateAvailabilityForm] = useState(false);


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

    const [newCar, setNewCar] = useState({
        photo_name: '',
        car_name: '',
        price_per_day: '',
        brand_name: '',
        number_of_seats: '',
        color: '',
        horse_power: '',
        engine_capacity: '',
        fuel_type: ''
    });

    const [newAvailability, setNewAvailability] = useState({
        car: '',
        start_date: '',
        end_date: '',
    });

    const [editUser, setEditUser] = useState(null);

    const [updatedUser, setUpdatedUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        is_staff: false,
        is_admin: false,
        date_of_birth: ''
    });

    const [editCar, setEditCar] = useState(null);

    const [updatedCar, setUpdatedCar] = useState({
        car_name: '',
        brand_name: '',
        photo_url: '',
        price_per_day: '',
        fuel_type: '',
        number_of_seats: '',
        horse_power: ''
    });

    const [editAvailability, setEditAvailability] = useState(null);

    const [updateAvailability, setUpdateAvailability] = useState({
        start_date: '',
        end_date: '',
    });

    const userCardRef = useRef(null);

    const formRef = useRef(null);

    const carCardRef = useRef(null);

    const carFormRef = useRef(null);

    const availabilityCardRef = useRef(null);

    const availabilityFormRef = useRef(null);

    const handleInputChange = (event, formType) => {
        const { name, value, type, checked } = event.target;

        const updatedValue = type === 'checkbox'
            ? checked
            : (type === 'number' ? (value === '' ? '' : parseFloat(value)) : value);

        if (formType === 'user') {
            setNewUser(prev => ({
                ...prev,
                [name]: updatedValue
            }));
        } else if (formType === 'car') {
            setNewCar(prev => ({
                ...prev,
                [name]: updatedValue
            }));
        } else if (formType === 'availability') {
            setNewAvailability(prev => ({
                ...prev,
                [name]: updatedValue
            }));
        }
    };

    const toggleForm = (form) => {
        if (form === 'user') {
            setShowCreateUserForm(prev => !prev);
        } else if (form === 'car') {
            setShowCreateCarForm(prev => !prev);
        } else if (form == 'availability') {
            setShowCreateAvailabilityForm(prev => !prev);
        }
    };

    const fetchAPI = async (endpoint, dataKey) => {
        setLoading(prev => ({ ...prev, [dataKey]: true }));
        setError(prev => ({ ...prev, [dataKey]: null }));

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
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
                credentials: 'include',
                headers: {
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

    const handleCreateCar = async (event) => {
        event.preventDefault();
        setCreateError(null);
        setCreateSuccess(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/cars/create', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    photo_name: newCar.photo_name,
                    car_name: newCar.car_name,
                    price_per_day: newCar.price_per_day,
                    brand_name: newCar.brand_name,
                    number_of_seats: newCar.number_of_seats,
                    color: newCar.color,
                    horse_power: newCar.horse_power,
                    engine_capacity: newCar.engine_capacity,
                    fuel_type: newCar.fuel_type
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating car:', errorData);
                setCreateError('Error creating car. Please check the input data.');
                return;
            }

            setNewCar({
                photo_name: '',
                car_name: '',
                price_per_day: '',
                brand_name: '',
                number_of_seats: '',
                color: '',
                horse_power: '',
                engine_capacity: '',
                fuel_type: ''
            });

            setCreateSuccess('Car created')

        } catch (error) {
            setCreateError('Failed to create car');
            console.log(error);
        }
    }

    const handleCreateAvailability = async (event) => {
        event.preventDefault();
        setCreateError(null);
        setCreateSuccess(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/availabilities/create', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    car: newAvailability.car,
                    start_date: newAvailability.start_date,
                    end_date: newAvailability.end_date,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating availability:', errorData);
                setCreateError('Error creating availability. Please check the input data.');
                return;
            }

            setNewAvailability({
                car: '',
                start_date: '',
                end_date: '',
            });

            setCreateSuccess('Availability created')

        } catch (error) {
            setCreateError('Failed to create availability');
            console.log(error);
        }
    }

    const handleDeleteContent = async (contentType, id) => {

        const url = `http://127.0.0.1:8000/api/${contentType}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                throw new Error(JSON.stringify(errorData));
            }

            setData(prevState => {
                const updatedData = { ...prevState };
                updatedData[contentType] = updatedData[contentType].filter(item => item.id !== id);
                return updatedData;
            });

            console.log('Deleted successfully!');
        } catch (error) {
            console.log("Error catched" + error);
        }

    };

    const handleEditUser = (user) => {
        setEditUser(user.id);
        setUpdatedUser({ ...user });
    };

    const handleEditAvailability = (availability) => {
        setEditAvailability(availability.id);
        setUpdateAvailability({ ...availability });
    };

    const handleEditCar = (car) => {
        setEditCar(car.id);
        setUpdatedCar({ ...car });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://127.0.0.1:8000/api/users/${updatedUser.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            console.log('User updated successfully');
            setEditUser(null);
            fetchAPI('users', 'users');
        } else {
            const errorData = await response.json();
            console.log('Error updating user: ' + errorData);
        }
    };

    const handleUpdateCar = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://127.0.0.1:8000/api/cars/${updatedCar.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCar),
        });

        if (response.ok) {
            console.log('Car updated successfully');
            setEditCar(null);
            fetchAPI('cars', 'cars');
        } else {
            const errorData = await response.json();
            console.log('Error updating car: ' + errorData);
        }
    };

    const handleUpdateAvailability = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://127.0.0.1:8000/api/availabilities/${updateAvailability.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateAvailability),
        });

        if (response.ok) {
            console.log('Availability updated successfully');
            setEditAvailability(null);
            fetchAPI('availabilities', 'availabilities');
        } else {
            const errorData = await response.json();
            console.log('Error updating availability: ' + errorData);
        }
    };

    useEffect(() => {
        const handleClickOutsideUser = (event) => {
            if (
                userCardRef.current &&
                !userCardRef.current.contains(event.target) &&
                formRef.current &&
                !formRef.current.contains(event.target)
            ) {
                setEditUser(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideUser);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideUser);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideCar = (event) => {
            if (
                carCardRef.current &&
                !carCardRef.current.contains(event.target) &&
                carFormRef.current &&
                !carFormRef.current.contains(event.target)
            ) {
                setEditCar(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideCar);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideCar);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideAvailability = (event) => {
            if (
                availabilityCardRef.current &&
                !availabilityCardRef.current.contains(event.target) &&
                availabilityFormRef.current &&
                !availabilityFormRef.current.contains(event.target)
            ) {
                setEditAvailability(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideAvailability);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideAvailability);
        };
    }, []);

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
                                        <div key={user.id} className="usercard" ref={userCardRef}>
                                            {editUser === user.id ? (
                                                // Formular editabil
                                                <form onSubmit={handleUpdateUser} ref={formRef}>
                                                    <input
                                                        type="text"
                                                        value={updatedUser.first_name}
                                                        onChange={(e) => setUpdatedUser({ ...updatedUser, first_name: e.target.value })}
                                                        placeholder="First Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={updatedUser.last_name}
                                                        onChange={(e) => setUpdatedUser({ ...updatedUser, last_name: e.target.value })}
                                                        placeholder="Last Name"
                                                    />
                                                    <input
                                                        type="email"
                                                        value={updatedUser.email}
                                                        onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                                                        placeholder="Email"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={updatedUser.phone_number}
                                                        onChange={(e) => setUpdatedUser({ ...updatedUser, phone_number: e.target.value })}
                                                        placeholder="Phone"
                                                    />
                                                    <label>
                                                        Staff:
                                                        <input
                                                            type="checkbox"
                                                            checked={updatedUser.is_staff}
                                                            onChange={(e) => setUpdatedUser({ ...updatedUser, is_staff: e.target.checked })}
                                                        />
                                                    </label>
                                                    <label>
                                                        Admin:
                                                        <input
                                                            type="checkbox"
                                                            checked={updatedUser.is_admin}
                                                            onChange={(e) => setUpdatedUser({ ...updatedUser, is_admin: e.target.checked })}
                                                        />
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={updatedUser.date_of_birth}
                                                        onChange={(e) => setUpdatedUser({ ...updatedUser, date_of_birth: e.target.value })}
                                                        placeholder="Date of Birth"
                                                    />
                                                    <button type="submit">Update User</button>
                                                </form>
                                            ) : (
                                                <div>
                                                    <h3>{user.first_name} {user.last_name}</h3>
                                                    <p>Email: {user.email}</p>
                                                    <p>Phone: {user.phone_number}</p>
                                                    <p>Staff: {user.is_staff ? 'Yes' : 'No'}</p>
                                                    <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
                                                    <p>Age: {user.date_of_birth}</p>
                                                    <button onClick={() => handleDeleteContent('users', user.id)}>Delete User</button>
                                                    <button className="edit-button" onClick={() => handleEditUser(user)}>Edit User</button>
                                                </div>
                                            )}
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
                                        <div key={car.id} className="carcard" ref={carCardRef}>
                                            {editCar === car.id ? (
                                                <form onSubmit={handleUpdateCar} ref={carFormRef}>
                                                    <input
                                                        type="text"
                                                        value={updatedCar.car_name}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, car_name: e.target.value })}
                                                        placeholder="Car Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={updatedCar.brand_name}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, brand_name: e.target.value })}
                                                        placeholder="Brand Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={updatedCar.photo_url}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, photo_url: e.target.value })}
                                                        placeholder="Photo URL"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={updatedCar.price_per_day}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, price_per_day: e.target.value })}
                                                        placeholder="Price per Day"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={updatedCar.fuel_type}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, fuel_type: e.target.value })}
                                                        placeholder="Fuel Type"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={updatedCar.number_of_seats}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, number_of_seats: e.target.value })}
                                                        placeholder="Seats"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={updatedCar.horse_power}
                                                        onChange={(e) => setUpdatedCar({ ...updatedCar, horse_power: e.target.value })}
                                                        placeholder="Horse Power"
                                                    />
                                                    <button type="submit">Update Car</button>
                                                </form>
                                            ) : (
                                                <div>
                                                    <h3>{car.car_name} ({car.brand_name})</h3>
                                                    <img src={`http://127.0.0.1:8000${car.photo_url}`} alt={`${car.car_name} photo`} />
                                                    <p>Id: {car.id}</p>
                                                    <p>Image: {car.photo_name}</p>
                                                    <p>Price per day: ${car.price_per_day}</p>
                                                    <p>Fuel type: {car.fuel_type}</p>
                                                    <p>Seats: {car.number_of_seats}</p>
                                                    <p>Horsepower: {car.horse_power} HP</p>
                                                    <button onClick={() => handleDeleteContent('cars', car.id)}>Delete Car</button>
                                                    <button className="edit-button" onClick={() => handleEditCar(car)}>
                                                        Edit Car
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
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
                                        <div key={availability.id} className="availabilitycard" ref={availabilityCardRef}>
                                            {editAvailability === availability.id ? (
                                                <form onSubmit={handleUpdateAvailability} ref={availabilityFormRef}>
                                                    <input
                                                        type="date"
                                                        value={updateAvailability.start_date}
                                                        onChange={(e) => setUpdateAvailability({ ...updateAvailability, start_date: e.target.value })}
                                                        placeholder="Start Date"
                                                    />
                                                    <input
                                                        type="date"
                                                        value={updateAvailability.end_date}
                                                        onChange={(e) => setUpdateAvailability({ ...updateAvailability, end_date: e.target.value })}
                                                        placeholder="End Date"
                                                    />
                                                    <button type="submit">Update Availability</button>
                                                </form>
                                            ) : (
                                                <div>
                                                    <h3>Id of availability: {availability.id}</h3>
                                                    <p>Available from: {availability.start_date}</p>
                                                    <p>Available until: {availability.end_date}</p>
                                                    <p>Id of car: {availability.car}</p>
                                                    <button onClick={() => handleDeleteContent('availabilities', availability.id)}>Delete Availability</button>
                                                    <button className="edit-button" onClick={() => handleEditAvailability(availability)}>
                                                        Edit Availability
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Toggle Button for User Creation Form */}
                <div className="section" id="toggleCreateUserFormDiv">
                    <button onClick={() => toggleForm('user')} className="toggle-create-user-form-btn">
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
                                onChange={(event) => handleInputChange(event, 'user')}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={newUser.lastName}
                                onChange={(event) => handleInputChange(event, 'user')}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(event) => handleInputChange(event, 'user')}
                                required
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                required
                                value={newUser.phoneNumber}
                                onChange={(event) => handleInputChange(event, 'user')}
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={newUser.isAdmin}
                                    onChange={(event) => handleInputChange(event, 'user')}
                                />
                                Is Admin
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Date of Birth"
                                required
                                value={newUser.dateOfBirth}
                                onChange={(event) => handleInputChange(event, 'user')}
                            />
                            <input
                                type="text"
                                name="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(event) => handleInputChange(event, 'user')}
                                required
                            />
                            <input
                                type="text"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={newUser.confirmPassword}
                                onChange={(event) => handleInputChange(event, 'user')}
                                required
                            />
                            <button type="submit">Create User</button>
                            {createError && <p style={{ color: 'red' }}>{createError}</p>}
                            {createSuccess && <p style={{ color: 'green' }}>{createSuccess}</p>}
                        </form>
                    </div>
                )}


                {/* Create New Car Form */}
                <div className="section" id="toggleCreateCarFormDiv">
                    <button onClick={() => toggleForm('car')} className="toggle-create-car-form-btn">
                        {showCreateCarForm ? 'Hide Create Car Form' : 'Show Create Car Form'}
                    </button>
                </div>

                {/* Car Creation Form */}
                {showCreateCarForm && (
                    <div className="section" id="createCarDiv">
                        <h2>Create New Car</h2>
                        <form className="create-car-form" onSubmit={handleCreateCar}>
                            <input type="text" name="car_name" value={newCar.car_name} onChange={(event) => handleInputChange(event, 'car')} placeholder="Car Name" />
                            <input type="text" name="brand_name" value={newCar.brand_name} onChange={(event) => handleInputChange(event, 'car')} placeholder="Brand Name" />
                            <input type="number" name="price_per_day" value={newCar.price_per_day} onChange={(event) => handleInputChange(event, 'car')} placeholder="Price Per Day" />
                            <input type="text" name="color" value={newCar.color} onChange={(event) => handleInputChange(event, 'car')} placeholder="Color" />
                            <input type="number" name="horse_power" value={newCar.horse_power} onChange={(event) => handleInputChange(event, 'car')} placeholder="Horse Power" />
                            <input type="number" name="engine_capacity" value={newCar.engine_capacity} onChange={(event) => handleInputChange(event, 'car')} placeholder="Engine Capacity" />
                            <input type="number" name="number_of_seats" value={newCar.number_of_seats} onChange={(event) => handleInputChange(event, 'car')} placeholder="Number of Seats" />
                            <input type="text" name="fuel_type" value={newCar.fuel_type} onChange={(event) => handleInputChange(event, 'car')} placeholder="Fuel Type" />
                            <input type="text" name="photo_name" value={newCar.photo_name} onChange={(event) => handleInputChange(event, 'car')} placeholder="Photo Name" />
                            <button type="submit">Create Car</button>
                        </form>
                        {createError && <p style={{ color: 'red' }}>{createError}</p>}
                        {createSuccess && <p style={{ color: 'green' }}>{createSuccess}</p>}
                    </div>
                )}

                {/* Create New Car Form */}
                <div className="section" id="toggleCreateCarFormDiv">
                    <button onClick={() => toggleForm('availability')} className="toggle-create-car-form-btn">
                        {showCreateAvailabilityForm ? 'Hide Create Availability Form' : 'Show Create Availability Form'}
                    </button>
                </div>

                {/* Car Creation Form */}
                {showCreateAvailabilityForm && (
                    <div className="section" id="createCarDiv">
                        <h2>Create New Availability</h2>
                        <form className="create-car-form" onSubmit={handleCreateAvailability}>
                            <input type="number" name="car" value={newAvailability.car} onChange={(event) => handleInputChange(event, 'availability')} placeholder="Car Id" />
                            <input type="date" name="start_date" value={newAvailability.start_date} onChange={(event) => handleInputChange(event, 'availability')} placeholder="Start Date" />
                            <input type="date" name="end_date" value={newAvailability.end_date} onChange={(event) => handleInputChange(event, 'availability')} placeholder="End Date" />
                            <button type="submit">Create Availability</button>
                        </form>
                        {createError && <p style={{ color: 'red' }}>{createError}</p>}
                        {createSuccess && <p style={{ color: 'green' }}>{createSuccess}</p>}
                    </div>
                )}

            </div>
        </div>
    );
};
export default AdminDashbord;