import React, { useState } from 'react';
import './Header.css'
import logo from './../../Assets/logo';
import Filter from '../Filters/Filter';

const Header = ({ }) => {
    const [filterOpened, setFilterOpened] = useState(false);

    const onFilterClick = () => {
        setFilterOpened(prev => {
            return (prev == false) ? true : false
        })
    }

    return (
        <div className='header-container'>
            <img src={logo} alt="" className='header-logo' />
            <span className='header-title'>Mukund's Candidate Application Platform</span>
        </div>
    )
}

export default Header