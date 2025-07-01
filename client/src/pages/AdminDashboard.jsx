import React, { useEffect, useState } from "react"
import { authorizedFetch } from "../utils/api"

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const data = await authorizedFetch("http://127.0.0.1:5000/admin/dashboard")
      if (data.error) {
        setError(data.error)
      } else {
        setDashboard(data)
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong.")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    const res = await authorizedFetch(`http://127.0.0.1:5000/admin/users/${userId}`, {
      method: "DELETE"
    })

    if (res?.message) {
      alert(res.message)
      fetchAdminData()
    } else {
      alert(res?.error || "Failed to delete user.")
    }
  }

  const handleDeleteClub = async (clubId) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return

    const res = await authorizedFetch(`http://127.0.0.1:5000/admin/clubs/${clubId}`, {
      method: "DELETE"
    })

    if (res?.message) {
      alert(res.message)
      fetchAdminData()
    } else {
      alert(res?.error || "Failed to delete club.")
    }
  }

  if (error) return <p className="p-6 text-red-700 font-medium">⚠️ {error}</p>
  if (!dashboard) return <p className="p-6 text-zinc-600 italic">Loading dashboard...</p>

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#fdf6ec] shadow-xl rounded-lg border border-amber-200">
      <h1 className="text-3xl font-serif text-amber-900 mb-8">🛠️ Admin Control Panel</h1>

      {/* Users */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-amber-800 border-b border-amber-300 pb-2 mb-4">👥 Users</h2>
        <ul className="space-y-3">
          {dashboard.users.map(user => (
            <li key={user.id} className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border border-amber-100">
              <span className="text-zinc-800">
                <span className="font-medium">{user.username}</span> ({user.email}){" "}
                {user.is_admin && <span className="ml-2 text-xs bg-emerald-700 text-white px-2 py-0.5 rounded">ADMIN</span>}
              </span>
              {!user.is_admin && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-rose-700 text-black px-3 py-1 rounded hover:bg-rose-800 transition"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Books */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-amber-800 border-b border-amber-300 pb-2 mb-4">📚 Books</h2>
        <ul className="grid md:grid-cols-2 gap-4 text-zinc-800">
          {dashboard.books.map(book => (
            <li key={book.id} className="bg-white p-4 border border-amber-100 rounded-md shadow-sm">
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-zinc-600">by {book.author}</p>
              <p className="text-xs text-zinc-500">Owner ID: {book.owner_id}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Clubs */}
      <section>
        <h2 className="text-xl font-semibold text-amber-800 border-b border-amber-300 pb-2 mb-4">📖 Book Clubs</h2>
        <ul className="space-y-4">
          {dashboard.clubs.map(club => (
            <li key={club.id} className="flex justify-between items-start bg-white p-4 border border-amber-100 rounded-md shadow-sm">
              <div>
                <p className="font-semibold text-zinc-800">{club.name}</p>
                <p className="text-sm text-zinc-600">{club.description}</p>
                <p className="text-xs text-zinc-500">Creator ID: {club.creator_id}</p>
              </div>
              <button
                onClick={() => handleDeleteClub(club.id)}
                className="bg-rose-700 text-black px-3 py-1 mt-2 rounded hover:bg-rose-800 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default AdminDashboard
