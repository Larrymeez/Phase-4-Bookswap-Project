from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import db
from routes import api
from club_routes import club_api  # ✅ Import your club blueprint here

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookswap.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret'

    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(api)
    app.register_blueprint(club_api)  # ✅ THIS SHOULD BE INSIDE create_app()

    @app.route('/')
    def home():
        return {'message': 'Welcome to BookSwap API 🎉'}

    return app


