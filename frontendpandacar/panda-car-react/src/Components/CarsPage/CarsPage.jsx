import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Filters from '../Filters/Filters';
import './CarsPage.css';

const CarsPage = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null); // New state for the selected car
    const [startDate, setStartDate] = useState(''); // State for start date
    const [endDate, setEndDate] = useState(''); // State for end date

    // Fetch cars from the API
    const fetchCars = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cars/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                setError('Error fetching cars!');
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            setCars(data);
            setFilteredCars(data);
        } catch (error) {
            setError('Failed to fetch cars');
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleFilterChange = (filteredCars) => {
        setFilteredCars(filteredCars);
    };

    const handleAddToCart = async (car) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cart/add/${car.id}/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.status === 201) {
                console.log(`${car.car_name} added to cart`);
            } else if (response.status === 200 && data.message.includes("already")) {
                console.log(`${car.car_name} is already in your cart`);
            } else {
                console.error('Failed to add to cart');
            }
        } catch (error) {
            console.error('Error in handleAddToCart:', error);
        }
    };

    const handleAddToFavorites = async (car) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/favorites/add/${car.id}/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.status === 201) {
                console.log(`${car.car_name} added to favorites`);
            } else if (response.status === 200 && data.message.includes("already")) {
                console.log(`${car.car_name} is already in your favorites`);
            } else {
                console.error('Failed to add to favorites');
            }
        } catch (error) {
            console.error('Error in handleAddToFavorites:', error);
        }
    };

    const handleViewDetails = (car) => {
        setSelectedCar(car); // Set the selected car when "View details" is clicked
    };

    const handleCloseDetails = () => {
        setSelectedCar(null); // Reset the selected car and show the list again
    };

    const handleDateChange = (e, type) => {
        if (type === 'start') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    return (
        <div className="carsWrapper">
            <Header />
            <div className="contentCarspage">
                <Filters onFilterChange={handleFilterChange} cars={cars} />
                <main className="mainContentCars">
                    {selectedCar ? (
                        <div className="car-details">
                            <button className="close-button" onClick={handleCloseDetails}>X</button>
                            <h1>{selectedCar.car_name} ({selectedCar.brand_name})</h1>
                            <img src={`http://127.0.0.1:8000${selectedCar.photo_url}?t=${new Date().getTime()}`} alt={`${selectedCar.car_name} photo`} />
                            <p>Price per day: ${selectedCar.price_per_day}</p>
                            <p>Fuel type: {selectedCar.fuel_type}</p>
                            <p>Seats: {selectedCar.number_of_seats}</p>
                            <p>Horsepower: {selectedCar.horse_power} HP</p>

                            {/* Date Selection */}
                            <div className="date-selection">
                                <label>Select dates:</label>
                                <span> From: </span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e, 'start')}
                                />
                                <span> To: </span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange(e, 'end')}
                                />
                            </div>

                            {/* Add to Cart button */}
                            <button className="add-to-cart-button" onClick={() => handleAddToCart(selectedCar)}>Add to Cart</button>
                        </div>
                    ) : (
                        <>
                            <h1>Available Cars</h1>
                            {loading && <p>Loading...</p>}
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="cars-list">
                                {filteredCars.length === 0 ? (
                                    <p>No cars available</p>
                                ) : (
                                    filteredCars.map((car) => (
                                        <div key={car.id} className="car-card">
                                            <h3>{car.car_name} ({car.brand_name})</h3>
                                            <img src={`http://127.0.0.1:8000${car.photo_url}?t=${new Date().getTime()}`} alt={`${car.car_name} photo`} />
                                            <p>Price per day: ${car.price_per_day}</p>
                                            <p>Fuel type: {car.fuel_type}</p>
                                            <p>Seats: {car.number_of_seats}</p>
                                            <p>Horsepower: {car.horse_power} HP</p>
                                            <div className="car-card-buttons">
                                                <button
                                                    className="favorite-button"
                                                    onClick={() => handleAddToFavorites(car)} // passing car as an argument
                                                >
                                                    Add to favorites
                                                </button>
                                                <button
                                                    className="details-button"
                                                    onClick={() => handleViewDetails(car)} // passing car as an argument
                                                >
                                                    View details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CarsPage;
