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
    const confirm = window.confirm("Are you sure you want to delete this user?")
    if (!confirm) return

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
    const confirm = window.confirm("Are you sure you want to delete this club?")
    if (!confirm) return

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

  if (error) return <p className="p-4 text-red-500">⚠️ {error}</p>
  if (!dashboard) return <p className="p-4">Loading admin dashboard...</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛠️ Admin Dashboard</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">👤 All Users</h3>
        <ul className="list-disc pl-6 space-y-2">
          {dashboard.users.map(user => (
            <li key={user.id} className="flex items-center justify-between">
              <span>
                {user.username} ({user.email}) {user.is_admin && <strong>[ADMIN]</strong>}
              </span>
              {!user.is_admin && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">📚 All Books</h3>
        <ul className="list-disc pl-6">
          {dashboard.books.map(book => (
            <li key={book.id}>
              {book.title} by {book.author} (User ID: {book.owner_id})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">📖 All Book Clubs</h3>
        <ul className="list-disc pl-6 space-y-2">
          {dashboard.clubs.map(club => (
            <li key={club.id} className="flex items-center justify-between">
              <span>
                {club.name} – {club.description} (Creator ID: {club.creator_id})
              </span>
              <button
                onClick={() => handleDeleteClub(club.id)}
                className="text-red-600 hover:underline"
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


