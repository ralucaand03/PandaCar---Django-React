import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import pandaIcon from '../Assets/panda3.png'; 

const Header = () => {
    return (
        <header className="header"> 
        <span className="brand-name">
                    <img src={pandaIcon} alt="Panda Icon" className="panda-icon" /> 
                    PandaCar
                </span>
            <nav className="nav-bar"> 
                
                <div className="nav-buttons">
                    <Link to="/home" className="nav-button">Home</Link>
                    <Link to="/cars" className="nav-button">Cars</Link>
                    <Link to="/favorites" className="nav-button">Favorites</Link>
                    <Link to="/recommendations" className="nav-button">Recommendations</Link>
                    <Link to="/cart" className="nav-button">Cart</Link>
                    <Link to="/account" className="nav-button">Account</Link>
                    <Link to="/contact" className="nav-button">Contact</Link>
                </div>
                
            </nav>
        </header>
    );
};

export default Header;
