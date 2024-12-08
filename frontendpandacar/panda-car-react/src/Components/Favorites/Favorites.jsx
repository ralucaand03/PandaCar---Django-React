import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Filters from '../Filters/Filters';
import './Favorites.css';

const Favorites = () => {
    const [cars, setCars] = useState([]);  // Cars fetched from API
    const [filteredCars, setFilteredCars] = useState([]);  // Filtered cars
    const [cars_available, setCarsAvailable] = useState(false); // Boolean for cars availability
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state

    const fetchFavCars = async () => {
        setLoading(true);
        setError(null);  
        try {
            const response = await fetch('http://127.0.0.1:8000/api/favorites/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                setError('Error fetching favorite cars.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Fetched Cars:', data);

            if (!Array.isArray(data) || data.length === 0) {
                console.log('No favorite cars found');
                setCars([]);
                setFilteredCars([]);
                setCarsAvailable(false);
                setLoading(false);
                return;
            }

            setCars(data);
            setFilteredCars(data);
            setCarsAvailable(true);
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch cars');
            setLoading(false);
        }
    };

    const handleFilterChange = (filteredCars) => {
        console.log('Filter applied. Filtered Cars:', filteredCars);
        setFilteredCars(Array.isArray(filteredCars) ? filteredCars : []);
        setCarsAvailable(filteredCars.length > 0);
    };

    const handleRemoveFromFav = async (car) => {
        console.log('Removing car:', car);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/favorites/remove/${car.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedCars = cars.filter((fav) => fav.id !== car.id);
                setCars(updatedCars);
                setFilteredCars(updatedCars);
                setCarsAvailable(updatedCars.length > 0);
            } else {
                setError('Failed to remove from favorites');
            }
        } catch (error) {
            setError('Error while removing from favorites');
        }
    };

    const handleViewDetails = (car) => {
        console.log('View details for car:', car);
    };

    useEffect(() => {
        fetchFavCars();
    }, []);

    console.log('Render: Loading:', loading, 'Cars:', cars, 'Filtered Cars:', filteredCars, 'Error:', error, 'Cars Available:', cars_available);

    if (loading) {
        return (
            <div className="favWrapper">
                <Header />
                <div className="contentFav">
                    <main className="mainContentFav">
                        <h1>Loading...</h1>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favWrapper">
                <Header />
                <div className="contentFav">
                    <main className="mainContentFav">
                        <h1>Error</h1>
                        <p style={{ color: 'red' }}>{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    if (!cars_available) {
        return (
            <div className="favWrapper">
                <Header />
                <div className="contentFav">
                    <Filters onFilterChange={handleFilterChange} cars={cars} />
                    <main className="mainContentFav">
                        <h1>No Favorite Cars</h1>
                        <p>Your favorite cars list is empty. Add some cars to your favorites!</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="favWrapper">
            <Header />
            <div className="contentFav">
                <Filters onFilterChange={handleFilterChange} cars={cars} />
                <main className="mainContentFav">
                    <h1>Favorite Cars</h1>
                    <div className="fav-list">
                        {Array.isArray(filteredCars) && filteredCars.length > 0 ? (
                            filteredCars.map((car) => (
                                <div key={car.id} className="fav-car-card">
                                    <h3>{car.car_name} ({car.brand_name})</h3>
                                    <img
                                        src={`http://127.0.0.1:8000${car.photo_url}?t=${new Date().getTime()}`}
                                        alt={`${car.car_name} photo`}
                                    />
                                    <p>Price per day: ${car.price_per_day}</p>
                                    <p>Fuel type: {car.fuel_type}</p>
                                    <p>Seats: {car.number_of_seats}</p>
                                    <p>Horsepower: {car.horse_power} HP</p>
                                    <div className="fav-card-buttons">
                                        <button
                                            className="remove-favorite-button"
                                            onClick={() => handleRemoveFromFav(car)}
                                        >
                                            Remove from favorites
                                        </button>
                                        <button
                                            className="fav-details-button"
                                            onClick={() => handleViewDetails(car)}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No favorite cars available.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Favorites;
