from flask import Blueprint, jsonify
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
