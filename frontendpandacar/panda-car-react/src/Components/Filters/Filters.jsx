import React, { useState, useEffect } from 'react';
import './Filters.css';

const Filters = () => {
    const [location, setLocation] = useState('');
    const [seats, setSeats] = useState('');
    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);  
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);
    const [cars, setCars] = useState([]);  

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
                return;
            }

            const data = await response.json();
            setCars(data); 
            console.log("Fetched Cars:", data);
            const carBrands = data.map(car => car.brand_name); 
            console.log("Extracted Brands:", carBrands); 

            const uniqueBrands = ['All', ...new Set(carBrands)]; 
            setBrands(uniqueBrands); 
        } catch (error) {
            setError('Failed to fetch cars');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCars();
    }, []); 
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
            <button className="apply-button" onClick={handleApplyFilters}>Apply Filters</button>
        </div>
    );
};

export default Filters;
