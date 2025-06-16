import React from 'react'
import { Link } from 'react-router-dom'
import "../css/navbar.css"

const NavBar = ({ text }) => {
  return (
    <>
    <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">NeuroBiz</Link>
        </div>
        <ul className='navbar-links'>
            <li><Link to="/admin">Admin Panel</Link></li>
            <li><Link to="/forms">Forms</Link></li>
            <li><Link to="/responses">Responses</Link></li>
        </ul>
    </nav>
    </>
  )
}

export default NavBar