import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Header from '../Header/Header';
import './Cart.css';

const Cart = () => {
    const [cars, setCars] = useState([]);  // Cars fetched from API
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state
    const [carsAvailable, setCarsAvailable] = useState(false);  
    const navigate = useNavigate();  
    const fetchCartCars = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/cart/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Ensure cookies are included with the request
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                setError('Error fetching cars.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Fetched Cars:', data);

            if (!Array.isArray(data) || data.length === 0) {
                setCars([]);  // No cars found
                setCarsAvailable(false);
                setLoading(false);
                return;
            }

            setCars(data);
            setCarsAvailable(true);
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch cars');
            setLoading(false);
        }
    };

    
    const handleRemoveFromCart = async (car) => {
        console.log('Removing car:', car);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/cart/remove/${car.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Ensure cookies are included with the request
            });

            if (response.ok) {
                const updatedCars = cars.filter((cartCar) => cartCar.id !== car.id);
                setCars(updatedCars);
                setCarsAvailable(updatedCars.length > 0);
            } else {
                setError('Failed to remove car from the cart');
            }
        } catch (error) {
            setError('Error removing car from cart');
        }
    };

    // View details of a car
    const handleViewDetails = (car) => {
        navigate(`/car-details/${car.id}`);  // Navigate to the car details page
    };

    useEffect(() => {
        fetchCartCars();  // Fetch cars when component mounts
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="CartWrapper">
                <Header />
                <div className="contentCart">
                    <main className="mainContentCart">
                        <h1>Loading...</h1>
                    </main>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="CartWrapper">
                <Header />
                <div className="contentCart">
                    <main className="mainContentCart">
                        <h1>Error</h1>
                        <p style={{ color: 'red' }}>{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    // If no cars are available
    if (!carsAvailable) {
        return (
            <div className="CartWrapper">
                <Header />
                <div className="contentCart">
                    <main className="mainContentCart">
                        <h1>Empty Cart</h1>
                        <p>Your cart is empty. Add some cars to your cart!</p>
                    </main>
                </div>
            </div>
        );
    }

    // Display the list of cars in the cart
    return (
        <div className="CartWrapper">
            <Header />
            <div className="contentCart">
                <main className="mainContentCart">
                    <h1>Your Cart</h1>
                    <div className="Cart-list">
                        {cars.length > 0 ? (
                            cars.map((car) => (
                                <div key={car.id} className="Cart-car-card">
                                    <h3>{car.car_name} ({car.brand_name})</h3>
                                    <img
                                        src={`http://127.0.0.1:8000${car.photo_url}?t=${new Date().getTime()}`}
                                        alt={`${car.car_name} photo`}
                                    />
                                    <p>Price per day: ${car.price_per_day}</p>
                                    <p>Fuel type: {car.fuel_type}</p>
                                    <p>Seats: {car.number_of_seats}</p>
                                    <p>Horsepower: {car.horse_power} HP</p>
                                    <div className="Cart-card-buttons">
                                        <button
                                            className="remove-from-cart-button"
                                            onClick={() => handleRemoveFromCart(car)}
                                        >
                                            Remove from cart
                                        </button>
                                        <button
                                            className="Cart-details-button"
                                            onClick={() => handleViewDetails(car)}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Your Cart is empty.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Cart;
