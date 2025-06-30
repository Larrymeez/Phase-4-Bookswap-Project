import React, { useState } from 'react'

const SearchBooks = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`)
    const data = await res.json()
    setResults(data.docs.slice(0, 10)) // get first 10 results
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Search Books</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, etc"
          className="border px-3 py-2 mr-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map((book, i) => (
            <li key={i} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{book.title}</h3>
              <p>Author: {book.author_name?.join(', ')}</p>
              <p>First Published: {book.first_publish_year}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBooks
