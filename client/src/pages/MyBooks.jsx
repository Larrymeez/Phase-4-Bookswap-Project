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
    <div
      className="p-8 max-w-4xl mx-auto"
      style={{
        fontFamily: "'Georgia', serif",
        background: 'linear-gradient(to bottom right, #fef9f4, #f3e6d3)',
        minHeight: '100vh'
      }}
    >
      <h2
        className="text-3xl mb-6 text-center font-bold"
        style={{ color: '#8B0000' }}
      >
        📚 My Book Collection
      </h2>

      {books.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t added any books yet.</p>
      ) : (
        <ul className="space-y-5">
          {books.map(book => (
            <li
              key={book.id}
              className="bg-white border-l-4 border-amber-700 p-5 rounded-lg shadow-md"
              style={{ backgroundColor: '#fffaf0' }}
            >
              <h3 className="text-xl font-semibold text-brown-900">{book.title}</h3>
              <p className="text-sm text-gray-700">✍️ Author: <span className="text-zinc-800">{book.author}</span></p>
              <p className="text-sm text-gray-700">📖 Genre: <span className="text-zinc-800">{book.genre}</span></p>
              <p className="text-sm text-gray-700">📦 Condition: <span className="text-zinc-800">{book.condition}</span></p>

              <button
               onClick={() => handleDelete(book.id)}
               className="mt-3 inline-block text-sm bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded-xl transition">
                  🗑️ Delete Book
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyBooks
