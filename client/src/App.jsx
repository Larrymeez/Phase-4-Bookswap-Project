import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 font-sans">
      <header className="bg-amber-200 shadow p-4">
        <h1 className="text-3xl font-bold text-amber-900">📚 BookSwap</h1>
        <nav className="mt-2 flex gap-4 text-lg">
          <Link to="/my-books" className="hover:text-amber-600">My Books</Link>
          <Link to="/clubs" className="hover:text-amber-600">Book Clubs</Link>
          <Link to="/profile" className="hover:text-amber-600">Profile</Link>
        </nav>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App
