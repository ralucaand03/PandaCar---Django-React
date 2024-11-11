import React, { useState } from "react";
import './AdminDashbord.css';

const AdminDashbord = () => {
    const [data, setData] = useState({
        users: [],
        cars: [],
        availabilities: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAPI = async (endpoint, dataKey) => {
        setLoading(true);
        setError(null);

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
                setError(`Error fetching ${endpoint}!`);
                throw new Error(JSON.stringify(errorData));
            }

            const responseData = await response.json();
            setData(prevState => ({
                ...prevState,
                [dataKey]: responseData
            }));
        } catch (error) {
            setError(`Failed to fetch ${endpoint}`);
        }
        setLoading(false);
    };

    return (
        <div className="contentAdmin">
            <div id="dashboard">
                {/* Admin Dashboard Header */}
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                </div>

                {/* Users Section */}
                <div className="section" id="getUsersDiv">
                    <div className="button-container">
                        <button onClick={() => fetchAPI('users', 'users')} className="get-users-btn">Get Users</button>
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
                </div>

                {/* Cars Section */}
                <div className="section" id="getCarsDiv">
                    <div className="button-container">
                        <button onClick={() => fetchAPI('cars', 'cars')} className="get-cars-btn">Get Cars</button>
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="cars-list">
                        {data.cars.length === 0 ? (
                            <p>No cars found</p>
                        ) : (
                            data.cars.map((car) => (
                                <div key={car.id} className="car-card">
                                    <h3>{car.car_name} ({car.brand_name})</h3>
                                    <p>Price per day: ${car.price_per_day}</p>
                                    <p>Fuel type: {car.fuel_type}</p>
                                    <p>Seats: {car.number_of_seats}</p>
                                    <p>Horsepower: {car.horse_power} HP</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Availability Section */}
                <div className="section" id="getAvailabilitiesDiv">
                    <div className="button-container">
                        <button onClick={() => fetchAPI('availabilities', 'availabilities')} className="get-availability-btn">Get Car Availability</button>
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashbord;
