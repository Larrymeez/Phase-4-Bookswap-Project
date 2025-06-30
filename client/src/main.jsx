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
          </Routes>
        </RootLayout>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)