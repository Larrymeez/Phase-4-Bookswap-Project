from flask import request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from werkzeug.security import check_password_hash
import traceback

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

        if not user or not check_password_hash(user.password_hash, password):
            return {"error": "Invalid credentials."}, 401

        access_token = create_access_token(identity=user.id)
        return jsonify(token=access_token), 200

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}, 500

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}, 500


@api.route('/my-books', methods=['GET'])
@jwt_required()
def my_books():
    user_id = get_jwt_identity()
    books = Book.query.filter_by(owner_id=user_id).all()
    return jsonify([
        {
            'id': b.id,
            'title': b.title,
            'author': b.author,
            'genre': b.genre,
            'condition': b.condition
        } for b in books
    ])        

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



