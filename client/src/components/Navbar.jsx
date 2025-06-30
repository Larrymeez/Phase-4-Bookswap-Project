import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-gray-100 px-6 py-4 mb-4 shadow">
      <ul className="flex gap-4 items-center">
        <li><Link to="/">Home</Link></li>

        {user ? (
          <>
            <li><Link to="/my-books">My Books</Link></li>
            <li><Link to="/add-book">Add Book</Link></li>
            <li><Link to="/search-books">Search Books</Link></li>
            <li><Link to="/profile">Profile</Link></li> {/* 👈 New Profile link */}

            {user.is_admin && (
              <li><Link to="/admin">Admin Dashboard</Link></li>
            )}

            <li>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Log In</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar

