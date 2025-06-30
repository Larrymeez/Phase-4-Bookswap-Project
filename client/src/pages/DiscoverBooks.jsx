import React, { useState } from 'react'

const DiscoverBooks = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const searchBooks = async () => {
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
      const data = await res.json()
      setResults(data.items || [])
    } catch (err) {
      console.error('Failed to fetch books:', err)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Discover Books</h2>
      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Search by title, author, etc."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>

      <div className="mt-6 space-y-4">
        {results.map((book) => (
          <div key={book.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{book.volumeInfo.title}</h3>
            <p>Author: {book.volumeInfo.authors?.join(', ')}</p>
            <p>Published: {book.volumeInfo.publishedDate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DiscoverBooks
