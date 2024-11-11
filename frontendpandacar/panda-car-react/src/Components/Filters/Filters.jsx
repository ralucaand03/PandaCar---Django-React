import React, { useState } from 'react';
import './Filters.css';

const Filters = () => {
    const [location, setLocation] = useState('');
    const [seats, setSeats] = useState('');
    const [brand, setBrand] = useState('');

    // Sample brands; replace or expand with actual brand options
    const brands = ['All','Toyota', 'Ford', 'Honda', 'Chevrolet', 'BMW'];

    const handleApplyFilters = () => {
        console.log("Applying Filters:", { location, seats, brand });
    };

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
                    {brands.map((brandOption, index) => (
                        <option key={index} value={brandOption}>{brandOption}</option>
                    ))}
                </select>
            </div>

            {/* Apply Button */}
            <button className="apply-button" onClick={handleApplyFilters}>Apply Filters</button>
        </div>
    );
};

export default Filters;
