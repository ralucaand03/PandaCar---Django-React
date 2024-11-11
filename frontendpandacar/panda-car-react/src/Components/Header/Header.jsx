// src/components/Header/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the regular CSS file

const Header = () => {
    return (
        <header className="header"> 
            <nav className="nav-bar"> 
                <Link to="/home" className="nav-button">Home</Link>
                <Link to="/cars" className="nav-button">Cars</Link>
                <Link to="/contact" className="nav-button">Contact</Link>
                <Link to="/cart" className="nav-button">Cart</Link>
            </nav>
        </header>
    );
};

export default Header;
