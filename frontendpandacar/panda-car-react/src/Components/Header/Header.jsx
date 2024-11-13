import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import pandaIcon from '../Assets/panda3.png'; // Adjust path if necessary

const Header = () => {
    return (
        <header className="header"> 
            <nav className="nav-bar"> 
                <div className="nav-buttons">
                    <Link to="/home" className="nav-button">Home</Link>
                    <Link to="/cars" className="nav-button">Cars</Link>
                    <Link to="/contact" className="nav-button">Contact</Link>
                    <Link to="/cart" className="nav-button">Cart</Link>
                </div>
                <span className="brand-name">
                    <img src={pandaIcon} alt="Panda Icon" className="panda-icon" /> 
                    PandaCar
                </span>
            </nav>
        </header>
    );
};

export default Header;
