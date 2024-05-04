import React from 'react';
import './Header.css'
import logo from './../../Assets/logo';

const Header = () => {
    return (
        <div className='header-container'>
            <img src={logo} alt="" className='header-logo' />
            <div className='header-title'>Mukund's Candidate Application Platform</div>
        </div>
    )
}

export default Header