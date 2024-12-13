import React from 'react';
import Header from '../Header/Header';
import Filters from '../Filters/Filters';
import './HomePage.css';
import pandaHome from '../Assets/panda8.png'; 

const HomePage = () => {
    return (
        <div className="homeWrapper">
            <Header />
            <div className="contentHomepage">
                {/* <Filters cars={[]} onFilterChange={() => { }} /> */}
                <main className="mainContent transparentContainer">
                <span className="Panda-home-content">
                    <img src={pandaHome} alt="Panda Home" className="panda-home" /> 
                </span>

                    <h1>Welcome to Panda Car </h1>
                    <h2>Your trusted destination for reliable and affordable car rentals.</h2>
                    <h3>Whether you're planning a road trip, need a ride for a special occasion, 
                    or just want a smooth drive, we’ve got you covered.     </h3>
                </main>
            </div>
        </div>
    );
};

export default HomePage;

