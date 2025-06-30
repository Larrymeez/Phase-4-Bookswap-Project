import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Navbar from './components/Navbar.jsx'
import MyBooks from './pages/MyBooks.jsx'
import { AuthProvider } from './context/AuthContext'
import AddBook from './pages/AddBook.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SearchBooks from './pages/SearchBooks'
import UserProfile from './components/UserProfile.jsx'
import BookClubs from './pages/BookClubs.jsx'


const RootLayout = ({ children }) => (
  <div>
    <Navbar />
    <main className="p-6">{children}</main>
  </div>
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RootLayout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/search-books" element={<SearchBooks />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/clubs" element={<BookClubs />} />
            




          </Routes>
        </RootLayout>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)