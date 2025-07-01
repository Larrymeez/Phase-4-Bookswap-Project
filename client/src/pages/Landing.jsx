import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(to bottom right, #fdf6e3, #e0c097)',
        fontFamily: "'Georgia', serif"
      }}
    >
      <div
        className="text-center p-5 rounded shadow-lg"
        style={{
          maxWidth: 650,
          backgroundColor: '#fffaf0',
          border: '2px solid #deb887',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      >
        <h1
          className="display-4 fw-bold"
          style={{ color: '#8B0000' }}
        >
          📚 Welcome to <span style={{ color: '#A0522D' }}>BookSwap</span>
        </h1>
        <p className="lead text-muted mt-3">
          Discover, exchange, and connect through your love for books. <br />
          Join cozy clubs, share treasured reads, and build your virtual shelf.
        </p>
        <div className="mt-4 d-flex justify-content-center gap-3">
          <Link to="/signup" className="btn btn-lg" style={{
            backgroundColor: '#8B0000',
            color: 'white',
            borderRadius: '12px'
          }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-dark btn-lg" style={{
            borderColor: '#8B0000',
            color: '#8B0000',
            borderRadius: '12px'
          }}>
            Login
          </Link>
        </div>
      </div>

      <footer className="mt-5 text-center text-muted">
        <small>&copy; {new Date().getFullYear()} BookSwap. Crafted with warmth and words.</small>
      </footer>
    </div>
  )
}

export default Landing
