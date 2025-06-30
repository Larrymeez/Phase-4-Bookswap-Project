import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const is_admin = JSON.parse(localStorage.getItem('is_admin'))
  
    if (token) {
      setUser({ token, is_admin })
    }
  }, [])
  

  // Save token + user on login
  const login = (token, is_admin) => {
    localStorage.setItem('token', token)
    localStorage.setItem('is_admin', JSON.stringify(is_admin)) // store admin flag
    setUser({ token, is_admin })
    navigate(is_admin ? '/admin' : '/my-books')  // Redirect to admin dashboard
  }
  

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

