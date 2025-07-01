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
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-[#fdf6ec]">
        <p className="text-red-600 p-6 bg-red-50 rounded max-w-md shadow-md text-center">
          ⚠️ Failed to load profile. Please check your login or try again later.
        </p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-[#fdf6ec]">
        <p className="p-6 max-w-md bg-yellow-50 rounded text-yellow-800 shadow-md text-center">
          Loading profile...
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#fdf6ec]">
      <div className="max-w-3xl w-full p-8 bg-white rounded-lg border border-amber-300 shadow-lg font-serif">
        <h2 className="text-3xl font-bold mb-6 text-amber-900 text-center">👤 {profile.username}</h2>

        <div className="space-y-2 text-amber-800 text-center mb-8">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
          <p><strong>Admin:</strong> {profile.is_admin ? '✅ Yes' : '❌ No'}</p>
        </div>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b border-amber-400 pb-2 text-amber-900">
            📚 Your Books:
          </h3>
          {profile.books?.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              {profile.books.map(book => (
                <li key={book.id}>
                  <span className="font-semibold">{book.title}</span> by {book.author} <em>({book.genre}, {book.condition})</em>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-700 italic text-center">You have no books listed.</p>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 border-b border-amber-400 pb-2 text-amber-900">
            👥 Joined Book Clubs:
          </h3>
          {joinedClubs.length > 0 ? (
            <ul className="space-y-4">
              {joinedClubs.map(club => (
                <li
                  key={club.id}
                  className="flex justify-between items-center p-4 border border-amber-300 rounded bg-amber-50 shadow-sm"
                >
                  <div className="text-amber-900">
                    <strong>{club.name}</strong> – <span className="italic">{club.description}</span>
                  </div>
                  <button
                    onClick={() => handleLeaveClub(club.id)}
                    className="ml-4 px-4 py-1 bg-red-600 hover:bg-red-700 text-black rounded shadow transition"
                  >
                    Leave
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-700 italic text-center">You have not joined any clubs yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default UserProfile



