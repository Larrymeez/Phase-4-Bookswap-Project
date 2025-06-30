import React, { useEffect, useState } from 'react'
import { authorizedFetch } from '../utils/api'

const MyBooks = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await authorizedFetch('http://127.0.0.1:5000/my-books')
      if (Array.isArray(res)) {
        setBooks(res)
      } else {
        console.error(res.error || 'Failed to load books')
      }
    }

    fetchBooks()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?')
    if (!confirmDelete) return

    const res = await authorizedFetch(`http://127.0.0.1:5000/books/${id}`, {
      method: 'DELETE',
    })

    if (res.message === 'Book deleted') {
      setBooks(prev => prev.filter(book => book.id !== id))
    } else {
      alert(res.error || 'Failed to delete book')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">My Books</h2>
      {books.length === 0 ? (
        <p>You have no books yet.</p>
      ) : (
        <ul className="space-y-4">
          {books.map(book => (
            <li key={book.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Condition: {book.condition}</p>
              <button
                onClick={() => handleDelete(book.id)}
                className="mt-2 text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyBooks

