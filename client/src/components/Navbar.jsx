import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-gray-100 px-6 py-4 mb-4 shadow">
      <ul className="flex gap-4">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/login">Log In</Link></li>
        <li><Link to="/my-books">My Books</Link></li>

      </ul>
    </nav>
  )
}

export default Navbar
