import React from 'react'
import {NavLink} from 'react-router-dom';
import { history } from '../routers/AppRouter';

const Header = () => (
    <header className='header'>
        {/* <NavLink to="/dashboard" className='header-is-active'>Dashboard</NavLink>
        <NavLink to="/createuser" className='header-is-active'>Create User</NavLink>
        <NavLink to="/createevent" className='header-is-active'>Create Event</NavLink> */}
    </header>
)

export default Header;