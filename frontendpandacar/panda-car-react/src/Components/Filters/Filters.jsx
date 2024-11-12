import React, { useState, useEffect } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange, cars }) => {
    const [location, setLocation] = useState('');
    const [seats, setSeats] = useState('');
    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBrands = (cars) => {
        if (cars && cars.length > 0) {
            const carBrands = cars.map(car => car.brand_name);
            const uniqueBrands = ['All', ...new Set(carBrands)];
            setBrands(uniqueBrands);
        } else {
            setBrands(['All']); 
        }
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
        fetchBrands(cars);
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
                    <option value="2">2 Seats</option>
                    <option value="3">3 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5 Seats</option>
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
