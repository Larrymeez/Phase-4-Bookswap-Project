from app import create_app
from models import db, User, Book, BookClub, Membership
from datetime import datetime

app = create_app()

with app.app_context():
    print("🌱 Seeding data...")

    # Clear existing data
    Membership.query.delete()
    Book.query.delete()
    BookClub.query.delete()
    User.query.delete()

    # Create Users
    user1 = User(username="booklover01", email="booklover01@example.com", location="Nairobi", is_admin=False)
    user1.password = "password123"

    admin = User(username="adminuser", email="admin@example.com", location="Nairobi", is_admin=True)
    admin.password = "adminpass"

    db.session.add_all([user1, admin])
    db.session.commit()

    # Create Books
    book1 = Book(title="Things Fall Apart", author="Chinua Achebe", genre="Fiction", condition="Good", owner=user1)
    book2 = Book(title="Sapiens", author="Yuval Noah Harari", genre="Non-Fiction", condition="Like New", owner=user1)

    db.session.add_all([book1, book2])
    db.session.commit()

    # Create Book Clubs
    club1 = BookClub(name="African Classics", genre="Fiction", description="Reading timeless African literature.", creator=admin)
    club2 = BookClub(name="History Buffs", genre="Non-Fiction", description="For lovers of historical narratives.", creator=user1)

    db.session.add_all([club1, club2])
    db.session.commit()

    # Create Memberships
    membership1 = Membership(user=user1, book_club=club1, role="member", joined_on=datetime.utcnow())
    membership2 = Membership(user=admin, book_club=club2, role="moderator", joined_on=datetime.utcnow())

    db.session.add_all([membership1, membership2])
    db.session.commit()

    print("✅ Seeding complete!")
