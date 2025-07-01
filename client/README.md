# 📚 Bookswap

Bookswap is a full-stack web application for book enthusiasts to share, swap, and manage their book collections. Built with a Flask API backend and a Vite + React + Tailwind CSS frontend.

---

## 🚀 Project Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Flask + SQLAlchemy + Marshmallow
- **Database**: SQLite (for development)
- **Authentication**: Token-based (JWT or similar)

---

## 🧱 Models Overview

### User
- `id`: Integer (Primary Key)
- `username`: String (Unique)
- `email`: String (Unique)
- `password_hash`: String  
- Relationships:  
  - One-to-many with `Book`
  - Many-to-many with `SwapRequest` via association table

### Book
- `id`: Integer (Primary Key)
- `title`: String
- `author`: String
- `genre`: String
- `owner_id`: ForeignKey → User  
- Relationships:  
  - Belongs to one User (owner)
  - One-to-many with `SwapRequest` (as requested/swapped book)

### SwapRequest
- `id`: Integer (Primary Key)
- `book_id`: ForeignKey → Book
- `requester_id`: ForeignKey → User
- `status`: String (`pending`, `accepted`, `declined`)
- `message`: Optional user-submittable message  
- Relationships:
  - Many-to-many link between Users and Books

---

## 🛠 Setup Instructions

### Backend

```bash
cd server
pipenv install
pipenv shell
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
python seed.py  # Optional: Seed the DB with sample data
flask run
