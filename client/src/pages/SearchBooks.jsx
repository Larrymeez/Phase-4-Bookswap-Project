import React, { useState } from 'react'
import { authorizedFetch } from '../utils/api'

const SearchBooks = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSave = async (book) => {
    const payload = {
      title: book.title,
      author: book.author_name?.[0] || "Unknown",
      genre: "Unknown",
      condition: "Good"
    }

    try {
      const res = await authorizedFetch('http://127.0.0.1:5000/books', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (res.error) {
        alert("❌ Failed to save book: " + res.error)
      } else {
        alert("✅ Book saved successfully!")
      }
    } catch (err) {
      console.error("Error saving book:", err)
      alert("❌ Could not save book.")
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`)
    const data = await res.json()
    setResults(data.docs.slice(0, 10))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-amber-700 mb-6 tracking-wide">
        🔍 Discover Books
      </h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, etc."
          className="flex-1 border border-zinc-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-black px-5 py-2 rounded-xl transition font-semibold shadow"
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map((book, index) => (
            <li
              key={index}
              className="bg-white border border-zinc-200 rounded-2xl shadow p-4 space-y-1 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-zinc-800">{book.title}</h3>
              <p className="text-zinc-600">
                Author: {book.author_name?.[0] || 'Unknown'}
              </p>
              <p className="text-zinc-600">
                First published: {book.first_publish_year || 'N/A'}
              </p>
              <button
                onClick={() => handleSave(book)}
                className="mt-3 bg-rose-600 hover:bg-rose-700 text-black px-4 py-2 rounded-xl text-sm font-medium transition shadow"
              >
                💾 Save to My Books
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBooks
