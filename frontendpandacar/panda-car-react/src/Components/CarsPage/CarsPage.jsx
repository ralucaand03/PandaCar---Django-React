import React, { useState, useEffect } from 'react';
import Header from '../Header/Header'; 
import Filters from '../Filters/Filters';
import './CarsPage.css';

const CarsPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cars from the API
    const fetchCars = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cars/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                setError('Error fetching cars!');
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            setCars(data); // Update the cars state with the fetched data
        } catch (error) {
            setError('Failed to fetch cars');
        }

        setLoading(false);
    };

    // Use useEffect to fetch data on component mount
    useEffect(() => {
        fetchCars();
    }, []); // Empty dependency array ensures it only runs once on mount

    return (
        <div className="carsWrapper">
            <Header />
            <div className="contentCarspage">
                <Filters />
                <main className="mainContentCars">
                    <h1>Available Cars</h1>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="cars-list">
                        {cars.length === 0 ? (
                            <p>No cars available</p>
                        ) : (
                            cars.map((car) => (
                                <div key={car.id} className="car-card">
                                    <h3>{car.car_name} ({car.brand_name})</h3>
                                    <img src={`http://127.0.0.1:8000${car.photo_url}?t=${new Date().getTime()}`} alt={`${car.car_name} photo`} />
                                    <p>Price per day: ${car.price_per_day}</p>
                                    <p>Fuel type: {car.fuel_type}</p>
                                    <p>Seats: {car.number_of_seats}</p>
                                    <p>Horsepower: {car.horse_power} HP</p>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CarsPage;
