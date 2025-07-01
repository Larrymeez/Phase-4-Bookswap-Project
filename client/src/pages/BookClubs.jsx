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
        setError("❌ Failed to load book clubs.")
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-amber-700 mb-6 tracking-wide">📚 Book Clubs</h2>
      {error && <p className="text-rose-600 mb-4">{error}</p>}

      {clubs.length === 0 ? (
        <p className="text-zinc-600 italic">No clubs available.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-6">
          {clubs.map((club) => {
            const isMember = myClubIds.includes(club.id)
            return (
              <li
                key={club.id}
                className="border border-amber-200 bg-amber-50 p-5 rounded-xl shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-amber-800">{club.name}</h3>
                <p className="text-zinc-700 mt-1">{club.description}</p>
                <button
                  onClick={() =>
                    isMember ? handleLeave(club.id) : handleJoin(club.id)
                  }
                  className={`mt-4 px-4 py-2 rounded-lg font-medium transition 
                    ${
                      isMember
                        ? 'bg-rose-600 hover:bg-rose-700 text-black'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-black'
                    }`}
                >
                  {isMember ? 'Leave Club' : 'Join Club'}
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

