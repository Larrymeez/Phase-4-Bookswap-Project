import { Link } from 'react-router-dom'

function App() {
  return (
    <div>
      <h1>📚 BookSwap</h1>
      <nav>
        <Link to="/books">Books</Link> |{' '}
        <Link to="/clubs">Book Clubs</Link> |{' '}
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  )
}

export default App
