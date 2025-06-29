import React, { useEffect, useState } from 'react'
import { authorizedFetch } from '../utils/api'

const MyBooks = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await authorizedFetch('http://127.0.0.1:5000/my-books')
        setBooks(data)
      } catch (err) {
        console.error('Error fetching books:', err)
      }
    }

    fetchBooks()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">My Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} ({book.genre}) - {book.condition}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MyBooks
