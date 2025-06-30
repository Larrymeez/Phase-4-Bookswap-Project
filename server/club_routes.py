from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, BookClub, Membership, User

club_api = Blueprint('clubs', __name__)

# Create a new club
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

    # Add creator as member
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

@club_api.route('/seed/clubs', methods=['POST'])
def seed_clubs():
    sample_clubs = [
        {"name": "Sci-Fi Explorers", "description": "Exploring distant galaxies through books."},
        {"name": "Mystery Maniacs", "description": "Solving fictional crimes one book at a time."},
        {"name": "History Buffs", "description": "Diving into the past with historical novels."},
        {"name": "African Voices", "description": "Celebrating literature from across Africa."},
        {"name": "Weekend Readers", "description": "Casual weekend book lovers unite!"}
    ]

    for club_data in sample_clubs:
        exists = BookClub.query.filter_by(name=club_data['name']).first()
        if not exists:
            new_club = BookClub(name=club_data['name'], description=club_data['description'], creator_id=1)
            db.session.add(new_club)
            db.session.commit()
            # Optionally add creator as a member
            db.session.add(Membership(user_id=1, club_id=new_club.id))
            db.session.commit()

    return jsonify({'message': '✅ Sample book clubs added!'}), 201
