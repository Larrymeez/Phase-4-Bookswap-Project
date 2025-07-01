import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-danger fw-bold" to="/">
          BookSwap
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-books">My Books</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-book">Add Book</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/search-books">Search</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clubs">Clubs</Link>
                </li>
                {user.is_admin && (
                  <li className="nav-item">
                    <Link className="nav-link text-primary fw-semibold" to="/admin">Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    onClick={logout}
                    className="btn btn-danger ms-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-primary me-2" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary" to="/login">Log In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

