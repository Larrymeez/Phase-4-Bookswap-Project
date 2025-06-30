import React, { useEffect, useState } from 'react'
import { authorizedFetch } from '../utils/api'

const AdminDashboard = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await authorizedFetch('http://127.0.0.1:5000/admin/books')
      if (Array.isArray(res)) {
        setBooks(res)
      } else {
        alert(res.error || 'Unauthorized')
      }
    }

    fetchBooks()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Admin: All Books</h2>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul className="space-y-4">
          {books.map(book => (
            <li key={book.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Condition: {book.condition}</p>
              <p className="text-sm text-gray-500">Owner ID: {book.owner_id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminDashboard
