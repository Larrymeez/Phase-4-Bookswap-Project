from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import check_password_hash
from models import db, Book, User
import traceback
from club_routes import club_api
club_api = Blueprint("club_api", __name__)
api = Blueprint('api', __name__)

# ---------------------

@api.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    book_list = [
        {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'condition': book.condition,
            'owner_id': book.owner_id
        }
        for book in books
    ]
    return jsonify(book_list), 200


@api.route('/books', methods=['POST'])
@jwt_required()
def create_book():
    user_id = get_jwt_identity()  # Get ID from token
    data = request.get_json()

    title = data.get('title')
    author = data.get('author')
    genre = data.get('genre')
    condition = data.get('condition')

    if not all([title, author]):
        return {'error': 'Title and author are required.'}, 400

    new_book = Book(
        title=title,
        author=author,
        genre=genre,
        condition=condition,
        owner_id=user_id
    )

    db.session.add(new_book)
    db.session.commit()

    return {
        'id': new_book.id,
        'title': new_book.title,
        'author': new_book.author,
        'genre': new_book.genre,
        'condition': new_book.condition,
        'owner_id': new_book.owner_id
    }, 201


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    location = data.get('location')

    if not all([username, email, password]):
        return {'error': 'Username, email, and password are required.'}, 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return {'error': 'Username or email already exists.'}, 409

    new_user = User(username=username, email=email, location=location)
    new_user.password = password  # hashed via setter

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=new_user.id)
    return {'token': token, 'user_id': new_user.id}, 201


@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return {"error": "Username and password required."}, 400

        user = User.query.filter_by(username=username).first()

        if not user or not user.verify_password(password):
            return {"error": "Invalid credentials."}, 401

        access_token = create_access_token(identity=user.id)
        return jsonify(token=access_token, is_admin=user.is_admin), 200

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}, 500


@api.route('/my-books', methods=['GET'])
@jwt_required()
def get_my_books():
    user_id = get_jwt_identity()
    books = Book.query.filter_by(owner_id=user_id).all()

    book_list = [
        {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'condition': book.condition
        }
        for book in books
    ]

    return jsonify(book_list), 200

@api.route('/books/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_book(id):
    user_id = get_jwt_identity()
    book = Book.query.get(id)

    if not book:
        return {'error': 'Book not found'}, 404

    if book.owner_id != user_id:
        return {'error': 'Unauthorized'}, 403

    db.session.delete(book)
    db.session.commit()
    return {'message': 'Book deleted'}, 200
    
@api.route('/admin/books', methods=['GET'])
@jwt_required()
def get_all_books():
    user_id = get_jwt_identity()

    # Simple check — assume user with ID 1 is admin
    if user_id != 1:
        return {'error': 'Unauthorized'}, 403

    books = Book.query.all()
    book_list = [
        {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'condition': book.condition,
            'owner_id': book.owner_id
        }
        for book in books
    ]

    return jsonify(book_list), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return {'error': 'User not found'}, 404

    return {
        'username': user.username,
        'email': user.email,
        'location': user.location,
        'is_admin': user.is_admin,
        'books': [
            {
                'id': b.id,
                'title': b.title,
                'author': b.author,
                'genre': b.genre,
                'condition': b.condition
            } for b in user.books
        ]
    }, 200

@club_api.route('/clubs', methods=['POST'])
@jwt_required()
def create_club():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return {'error': 'Club name is required.'}, 400

    new_club = BookClub(name=name, description=description, creator_id=user_id)
    db.session.add(new_club)
    db.session.commit()

    # Add creator as first member
    membership = Membership(user_id=user_id, club_id=new_club.id)
    db.session.add(membership)
    db.session.commit()

    return jsonify({'id': new_club.id, 'name': new_club.name, 'description': new_club.description}), 201

# Get all clubs
@club_api.route('/clubs', methods=['GET'])
@jwt_required()
def get_clubs():
    clubs = BookClub.query.all()
    return jsonify([
        {'id': club.id, 'name': club.name, 'description': club.description}
        for club in clubs
    ])

# Join a club
@club_api.route('/clubs/<int:club_id>/join', methods=['POST'])
@jwt_required()
def join_club(club_id):
    user_id = get_jwt_identity()
    existing = Membership.query.filter_by(user_id=user_id, club_id=club_id).first()
    if existing:
        return {'message': 'Already a member.'}, 200

    membership = Membership(user_id=user_id, club_id=club_id)
    db.session.add(membership)
    db.session.commit()
    return {'message': 'Joined club successfully.'}, 201

# Leave a club
@club_api.route('/clubs/<int:club_id>/leave', methods=['DELETE'])
@jwt_required()
def leave_club(club_id):
    user_id = get_jwt_identity()
    membership = Membership.query.filter_by(user_id=user_id, club_id=club_id).first()
    if not membership:
        return {'error': 'You are not a member of this club.'}, 404

    db.session.delete(membership)
    db.session.commit()
    return {'message': 'Left club successfully.'}, 200

# Get club members
@club_api.route('/clubs/<int:club_id>/members', methods=['GET'])
@jwt_required()
def get_members(club_id):
    members = Membership.query.filter_by(club_id=club_id).all()
    users = [User.query.get(m.user_id) for m in members]
    return jsonify([
        {'id': u.id, 'username': u.username, 'email': u.email}
        for u in users if u
    ])

    # Get single club details
@club_api.route('/clubs/<int:club_id>', methods=['GET'])
@jwt_required()
def get_club_details(club_id):
    club = BookClub.query.get_or_404(club_id)
    creator = User.query.get(club.creator_id)

    members = Membership.query.filter_by(club_id=club_id).all()
    member_count = len(members)

    return jsonify({
        'id': club.id,
        'name': club.name,
        'description': club.description,
        'creator': {
            'id': creator.id,
            'username': creator.username,
            'email': creator.email
        },
        'member_count': member_count
    }), 200





