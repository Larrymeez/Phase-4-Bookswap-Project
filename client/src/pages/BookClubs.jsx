import React, { useEffect, useState } from 'react'
import { authorizedFetch } from '../utils/api'

const BookClubs = () => {
  const [clubs, setClubs] = useState([])
  const [myClubIds, setMyClubIds] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchClubs() {
      try {
        const [allClubs, myClubs] = await Promise.all([
          authorizedFetch("http://127.0.0.1:5000/clubs"),
          authorizedFetch("http://127.0.0.1:5000/my-clubs"),
        ])

        if (Array.isArray(allClubs)) setClubs(allClubs)
        if (Array.isArray(myClubs)) {
          const ids = myClubs.map(c => c.id)
          setMyClubIds(ids)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load book clubs.")
      }
    }

    fetchClubs()
  }, [])

  const handleJoin = async (clubId) => {
    try {
      const res = await authorizedFetch(`http://127.0.0.1:5000/clubs/${clubId}/join`, {
        method: "POST",
      })
      if (res.message) {
        setMyClubIds(prev => [...prev, clubId])
      }
    } catch (err) {
      console.error("Join error:", err)
    }
  }

  const handleLeave = async (clubId) => {
    try {
      const res = await authorizedFetch(`http://127.0.0.1:5000/clubs/${clubId}/leave`, {
        method: "DELETE",
      })
      if (res.message) {
        setMyClubIds(prev => prev.filter(id => id !== clubId))
      }
    } catch (err) {
      console.error("Leave error:", err)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📚 Book Clubs</h2>
      {error && <p className="text-red-500">{error}</p>}

      {clubs.length === 0 ? (
        <p>No clubs available.</p>
      ) : (
        <ul className="space-y-4">
          {clubs.map((club) => {
            const isMember = myClubIds.includes(club.id)
            return (
              <li key={club.id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-semibold">{club.name}</h3>
                <p>{club.description}</p>
                <button
                  onClick={() =>
                    isMember ? handleLeave(club.id) : handleJoin(club.id)
                  }
                  className={`mt-2 px-3 py-1 rounded ${
                    isMember
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isMember ? "Leave Club" : "Join Club"}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default BookClubs
