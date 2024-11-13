import React, { useState, useEffect } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange, cars }) => {
    const [location, setLocation] = useState('');
    const [seats, setSeats] = useState('');
    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);
    const [number_of_seats, setNumberSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCarsAttributes = (cars) => {
        if (cars && cars.length > 0) {
            const carBrands = cars.map(car => car.brand_name);
            const carSeats = cars.map(car => car.number_of_seats);
            const uniqueBrands = ['All', ...new Set(carBrands)];
            const uniqueSeats = [...new Set(carSeats)].sort((a, b) => a - b);
            setBrands(uniqueBrands);
            setNumberSeats(uniqueSeats);
        } else {
            setBrands(['All']); 
            setNumberSeats(['Select Seats']);
        }
        setLoading(false);
    };

    const filterCars = () => {
        let filtered = cars;

        if (location) {
            filtered = filtered.filter(car => car.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (seats) {
            filtered = filtered.filter(car => car.number_of_seats === parseInt(seats));
        }

        if (brand && brand !== 'All') {
            filtered = filtered.filter(car => car.brand_name === brand);
        }

        onFilterChange(filtered); 
    };

    useEffect(() => {
        setLoading(true);
        fetchCarsAttributes(cars);
    }, [cars]); 

    return (
        <div className="filters">
            <h2>Filters</h2>

            {/* Location Filter */}
            <div className="filter-item">
                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    placeholder="Type location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {/* Number of Seats Filter */}
            <div className="filter-item">
                <label htmlFor="seats">Number of Seats:</label>
                <select
                    id="seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                >
                    <option value="">Select seats</option>
                    {number_of_seats.map((seatOption, index) => (
                        <option key={index} value={seatOption}>{seatOption} Seats</option>
                    ))}
                </select>
            </div>

            {/* Brands Filter */}
            <div className="filter-item">
                <label htmlFor="brand">Brand:</label>
                <select
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                >
                    <option value="">Select a brand</option>
                    {loading ? (
                        <option>Loading...</option>
                    ) : error ? (
                        <option>{error}</option>
                    ) : (
                        brands.map((brandOption, index) => (
                            <option key={index} value={brandOption}>{brandOption}</option>
                        ))
                    )}
                </select>
            </div>

            {/* Apply Button */}
            <button className="apply-button" onClick={filterCars}>Apply Filters</button>
        </div>
    );
};

export default Filters;
