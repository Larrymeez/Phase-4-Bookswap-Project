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
        {results.map((book, index) => (
          <li key={index} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{book.title}</h3>
            <p>Author: {book.author_name?.[0]}</p>
            <p>First published: {book.first_publish_year}</p>
            <button
              onClick={() => handleSave(book)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Save to My Books
            </button>
          </li>
        ))}
      </ul>
      
      )}
    </div>
  )
}


  
export default SearchBooks
