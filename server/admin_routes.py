from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin  # ✅ Add this
from models import User, Book, BookClub

admin_api = Blueprint('admin', __name__)

@admin_api.route('/admin/dashboard', methods=['GET'])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)  # ✅ CORS Fix
@jwt_required()  # ✅ Keep this after cross_origin
def admin_dashboard():
    user_id = get_jwt_identity()
    admin_user = User.query.get(user_id)

    if not admin_user or not admin_user.is_admin:
        return jsonify({'error': 'Unauthorized access. Admins only.'}), 403

    all_users = User.query.all()
    all_books = Book.query.all()
    all_clubs = BookClub.query.all()

    return jsonify({
        'users': [
            {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'is_admin': u.is_admin
            } for u in all_users
        ],
        'books': [
            {
                'id': b.id,
                'title': b.title,
                'author': b.author,
                'owner_id': b.owner_id

            } for b in all_books
        ],
        'clubs': [
            {
                'id': c.id,
                'name': c.name,
                'description': c.description,
                'creator_id': c.creator_id
            } for c in all_clubs
        ]
    }), 200
