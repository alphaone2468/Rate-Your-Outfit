import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className='heading_navbar'>Rate Your Outfit</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
