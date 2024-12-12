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

    // States to control dropdown visibility
    const [isSeatsDropdownOpen, setIsSeatsDropdownOpen] = useState(false);
    const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

    const fetchCarsAttributes = (cars) => {
        if (cars && cars.length > 0) {
            const carBrands = cars.map(car => car.brand_name);
            const carSeats = cars.map(car => car.number_of_seats);
            const uniqueBrands = ['All', ...new Set(carBrands)];
            const uniqueSeats = [...new Set(carSeats)].sort((a, b) => a - b);
            setBrands(uniqueBrands);
            setNumberSeats(uniqueSeats);
        } else {
            setBrands([]);
            setNumberSeats([]);
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

    // Handle seat selection
    const handleSeatSelection = (seat) => {
        setSeats(seat);
        setIsSeatsDropdownOpen(false); // Close dropdown after selection
    };

    // Handle brand selection
    const handleBrandSelection = (selectedBrand) => {
        setBrand(selectedBrand);
        setIsBrandDropdownOpen(false); // Close dropdown after selection
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

            {/* Number of Seats Filter - Custom Dropdown */}
            <div className="filter-item">
                <label htmlFor="seats">Number of Seats:</label>
                <div className="custom-dropdown">
                    <button
                        className="dropdown-btn"
                        onClick={() => {
                            setIsSeatsDropdownOpen(!isSeatsDropdownOpen);
                            if (!isSeatsDropdownOpen) setIsBrandDropdownOpen(false);
                        }}
                    >
                        {seats || 'Select seats'}
                    </button>
                    {isSeatsDropdownOpen && (
                        <ul className="dropdown-list">
                            {number_of_seats.map((seatOption, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => {
                                        setIsBrandDropdownOpen(!isBrandDropdownOpen);
                                        if (!isBrandDropdownOpen) setIsSeatsDropdownOpen(false);
                                        handleSeatSelection(seatOption);
                                    }}
                                >
                                    {seatOption} Seats
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Brands Filter - Custom Dropdown */}
            <div className="filter-item">
                <label htmlFor="brand">Brand:</label>
                <div className="custom-dropdown">
                    <button
                        className="dropdown-btn"
                        onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                    >
                        {brand || 'Select a brand'}
                    </button>
                    {isBrandDropdownOpen && (
                        <ul className="dropdown-list">
                            {loading ? (
                                <li>Loading...</li>
                            ) : error ? (
                                <li>{error}</li>
                            ) : (
                                brands.map((brandOption, index) => (
                                    <li
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => handleBrandSelection(brandOption)}
                                    >
                                        {brandOption}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Apply Button */}
            <button className="apply-button" onClick={filterCars}>Apply Filters</button>
        </div >
    );
};

export default Filters;
