import React, { useEffect, useState } from 'react'
import { authorizedFetch } from "../utils/api"

const UserProfile = () => {
  const [profile, setProfile] = useState(null)
  const [joinedClubs, setJoinedClubs] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchClubs()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await authorizedFetch('http://127.0.0.1:5000/profile')
      if (data && !data.error) {
        setProfile(data)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
  }

  const fetchClubs = async () => {
    try {
      const clubs = await authorizedFetch('http://127.0.0.1:5000/my-clubs')
      if (Array.isArray(clubs)) {
        setJoinedClubs(clubs)
      }
    } catch (err) {
      console.error("Failed to fetch clubs", err)
    }
  }

  const handleLeaveClub = async (clubId) => {
    try {
      const res = await authorizedFetch(`http://127.0.0.1:5000/clubs/${clubId}/leave`, {
        method: 'DELETE',
      })
      if (res.message) {
        setJoinedClubs(prev => prev.filter(club => club.id !== clubId))
      }
    } catch (err) {
      console.error("Leave club failed", err)
    }
  }

  if (error) {
    return <p className="text-red-600 p-4">⚠️ Failed to load profile. Please check your login or try again later.</p>
  }

  if (!profile) {
    return <p className="p-4">Loading profile...</p>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">👤 {profile.username}</h2>
      <p>Email: {profile.email}</p>
      <p>Location: {profile.location}</p>
      <p>Admin: {profile.is_admin ? '✅' : '❌'}</p>

      <h3 className="mt-4 font-semibold">📚 Your Books:</h3>
      <ul className="list-disc pl-5">
        {profile.books?.length > 0 ? (
          profile.books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author} ({book.genre}, {book.condition})
            </li>
          ))
        ) : (
          <li>You have no books listed.</li>
        )}
      </ul>

      <h3 className="mt-6 font-semibold">👥 Joined Book Clubs:</h3>
      <ul className="space-y-2">
        {joinedClubs.length > 0 ? (
          joinedClubs.map(club => (
            <li key={club.id} className="flex justify-between items-center border rounded p-2">
              <div>
                <strong>{club.name}</strong> – {club.description}
              </div>
              <button
                onClick={() => handleLeaveClub(club.id)}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Leave
              </button>
            </li>
          ))
        ) : (
          <li>You have not joined any clubs yet.</li>
        )}
      </ul>
    </div>
  )
}

export default UserProfile

