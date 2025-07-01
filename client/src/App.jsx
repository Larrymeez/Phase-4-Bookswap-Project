import { Link } from 'react-router-dom'
import './index.css';


function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:text-white font-sans">
      <header className="bg-indigo-700 text-white px-6 py-4 shadow-md">
        <h1 className="text-3xl font-bold">📚 BookSwap</h1>
        <nav className="mt-2 space-x-4">
          <Link to="/books" className="hover:underline">
            My Books
          </Link>
          <Link to="/clubs" className="hover:underline">
            Book Clubs
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
        </nav>
      </header>


      <main className="p-6">
        {/* Your routes will render here */}
      </main>
    </div>
  )
}

export default App
