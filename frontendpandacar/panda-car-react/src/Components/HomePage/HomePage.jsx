// src/components/HomePage/HomePage.jsx
import React from 'react';
import Header from '../Header/Header'; 
import Filters from '../Filters/Filters';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homeWrapper">
            <Header />
            <div className="contentHomepage">
                <Filters />
                <main className="mainContent">
                    <h1>Welcome to Our Car Marketplace</h1>
                    <p>Browse through our collection of cars, find what suits you best, and contact us for more details!</p>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
