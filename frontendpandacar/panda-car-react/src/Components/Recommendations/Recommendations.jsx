import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Filters from '../Filters/Filters';
import './Recommendations.css';

const Recommendations = () => {
    
    const [cars, setCars] = useState([]);  // Cars fetched from API
    const [filteredCars, setFilteredCars] = useState([]);  // Filtered cars
    const [carsAvailable, setCarsAvailable] = useState(false); // Boolean for cars availability
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const [selectedCar, setSelectedCar] = useState(null); // State for the selected car
    const [startDate, setStartDate] = useState(''); // State for start date
    const [endDate, setEndDate] = useState(''); // State for end date

    const updateAndFetchRecommendations = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch and update recommendations via a single GET request
            const response = await fetch('http://127.0.0.1:8000/api/recommended/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from response:', errorData);
                setError(errorData.message || 'Error fetching recommended cars.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Fetched Recommended Cars:', data);

            if (Array.isArray(data) && data.length > 0) {
                setCars(data);
                setFilteredCars(data);
                setCarsAvailable(true);
            } else {
                setCars([]);
                setFilteredCars([]);
                setCarsAvailable(false);
            }

            setLoading(false);
        } catch (error) {
            console.error('Unexpected Fetch Error:', error);
            setError('Failed to fetch recommended cars');
            setLoading(false);
        }
    };

    const handleFilterChange = (filteredCars) => {
        console.log('Filter applied. Filtered Cars:', filteredCars);
        setFilteredCars(Array.isArray(filteredCars) ? filteredCars : []);
        setCarsAvailable(filteredCars.length > 0);
    };

    const handleAddToFav = async (car) => {
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
        console.log('View details for car:', car);
        setSelectedCar(car);
    };

    const handleCloseDetails = () => {
        setSelectedCar(null);
    };

    const handleDateChange = (e, type) => {
        if (type === 'start') {
            setStartDate(e.target.value);
        } else {
            setEndDate(e.target.value);
        }
    };

    const handleAddToCart = async (car) => {
        try {
            const checkResponse = await fetch(`http://127.0.0.1:8000/api/availabilities`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (checkResponse.status === 404) {
                console.error("Availability data not found.");
                return;
            }

            const availabilities = await checkResponse.json();

            const carAvailabilities = availabilities.filter(
                (availability) => availability.car === car.id
            );

            if (carAvailabilities.length === 0) {
                console.error("No availability data found for this car.");
                return;
            }

            const userStartDate = new Date(startDate);
            const userEndDate = new Date(endDate);

            const isAvailable = carAvailabilities.some((availability) => {
                const availabilityStartDate = new Date(availability.start_date);
                const availabilityEndDate = new Date(availability.end_date);

                return (
                    userStartDate >= availabilityStartDate &&
                    userEndDate <= availabilityEndDate
                );
            });

            if (!isAvailable) {
                console.error("Car is not available for the selected period.");
                return;
            }

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


    useEffect(() => {
        updateAndFetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="RecommendationsWrapper">
                <Header />
                <div className="contentRecommendations">
                    <main className="mainContentRecommendations">
                        <h1>Loading...</h1>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="RecommendationsWrapper">
                <Header />
                <div className="contentRecommendations">
                    <main className="mainContentRecommendations">
                        <h1>Error</h1>
                        <p style={{ color: 'red' }}>{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    if (!carsAvailable) {
        return (
            <div className="RecommendationsWrapper">
                <Header />
                <div className="contentRecommendations">
                    <Filters onFilterChange={handleFilterChange} cars={cars} />
                    <main className="mainContentRecommendations">
                        <h1>No Recommendations</h1>
                        <p>Your recommendations list is empty. Add some cars to your favorites!</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="RecommendationsWrapper">
            <Header />
            <div className="contentRecommendations">
                <Filters onFilterChange={handleFilterChange} cars={cars} />
                <main className="mainContentRecommendations">
                    {selectedCar ? (
                        <div className="car-details">
                            <button className="close-button" onClick={handleCloseDetails}>X</button>
                            <h1>{selectedCar.car_name} ({selectedCar.brand_name})</h1>
                            <img
                                src={`http://127.0.0.1:8000${selectedCar.photo_url}?t=${new Date().getTime()}`}
                                alt={`${selectedCar.car_name} photo`}
                            />
                            <p>Price per day: ${selectedCar.price_per_day}</p>
                            <p>Fuel type: {selectedCar.fuel_type}</p>
                            <p>Seats: {selectedCar.number_of_seats}</p>
                            <p>Horsepower: {selectedCar.horse_power} HP</p>

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

                            <button className="add-to-cart-button" onClick={() => handleAddToCart(selectedCar)}>
                                Add to Cart
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1>Recommended Cars</h1>
                            <div className="Recommendations-list">
                                {filteredCars.map((car) => (
                                    <div key={car.id} className="Recommendations-car-card">
                                        <h3>{car.car_name} ({car.brand_name})</h3>
                                            <img
                                                src={`http://127.0.0.1:8000${car.photo_url}?t=${new Date().getTime()}`}
                                                alt={`${car.car_name} photo`}
                                            />
                                            <p>Price per day: ${car.price_per_day}</p>
                                            <p>Fuel type: {car.fuel_type}</p>
                                            <p>Seats: {car.number_of_seats}</p>
                                            <p>Horsepower: {car.horse_power} HP</p>
                                        <div className="rec-card-buttons">
                                            <button className="rec-button" onClick={() => handleViewDetails(car)}>
                                                View Details
                                            </button>
                                            <button
                                                className="rec-button"
                                                onClick={() => handleAddToFav(car)}
                                            >
                                                Add to Favorites
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Recommendations;
