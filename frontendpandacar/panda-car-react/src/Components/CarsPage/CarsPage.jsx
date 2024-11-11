// src/components/CarsPage/CarsPage.jsx
import React from 'react';
import Header from '../Header/Header'; 
import Filters from '../Filters/Filters';
import './CarsPage.css';

const CarsPage = () => {
    return (
        <div className="carsWrapper">
            <Header />
            <div className="contentCarspage">
                <Filters />
                <main className="mainContentCars">
                    <h1>Welcome to Our Car PAGE</h1>
                    <p>Browse through our collection of cars, find what suits you best, and contact us for more details!</p>
                </main>
            </div>
        </div>
    );
};

export default CarsPage;
