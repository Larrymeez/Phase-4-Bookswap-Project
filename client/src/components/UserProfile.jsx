import React, { useEffect, useState } from 'react'
import { authorizedFetch } from '../api'

const UserProfile = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      const data = await authorizedFetch('http://127.0.0.1:5000/profile')
      setProfile(data)
    }
    fetchProfile()
  }, [])

  if (!profile) return <p>Loading profile...</p>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">👤 {profile.username}</h2>
      <p>Email: {profile.email}</p>
      <p>Location: {profile.location}</p>
      <p>Admin: {profile.is_admin ? '✅' : '❌'}</p>

      <h3 className="mt-4 font-semibold">📚 Your Books:</h3>
      <ul className="list-disc pl-5">
        {profile.books.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} ({book.genre}, {book.condition})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserProfile
