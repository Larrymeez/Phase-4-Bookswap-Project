from flask import Blueprint, jsonify, request
from models import db, Book

api = Blueprint('api', __name__)

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
def create_book():
    data = request.get_json()

    title = data.get('title')
    author = data.get('author')
    genre = data.get('genre')
    condition = data.get('condition')
    owner_id = data.get('owner_id')  # will be replaced with JWT user ID later

    if not all([title, author, owner_id]):
        return {'error': 'Title, author, and owner_id are required.'}, 400

    new_book = Book(
        title=title,
        author=author,
        genre=genre,
        condition=condition,
        owner_id=owner_id
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

