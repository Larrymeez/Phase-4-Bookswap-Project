from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Association Table
class Membership(db.Model):
    __tablename__ = 'memberships'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey('book_clubs.id'), nullable=False)

    user = db.relationship('User', back_populates='memberships')
    club = db.relationship('BookClub', back_populates='memberships')

    __table_args__ = (db.UniqueConstraint('user_id', 'club_id', name='unique_membership'),)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    is_admin = db.Column(db.Boolean, default=False)

    books = db.relationship('Book', backref='owner', lazy=True)
    memberships = db.relationship('Membership', back_populates='user', cascade="all, delete-orphan")
    created_clubs = db.relationship('BookClub', back_populates='creator', lazy=True)

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, plain_text):
        self._password_hash = generate_password_hash(plain_text)

    def verify_password(self, password_input):
        return check_password_hash(self._password_hash, password_input)


class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    condition = db.Column(db.String)

    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class BookClub(db.Model):
    __tablename__ = 'book_clubs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    description = db.Column(db.Text)

    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    creator = db.relationship('User', back_populates='created_clubs')
    memberships = db.relationship('Membership', back_populates='club', cascade="all, delete-orphan")
