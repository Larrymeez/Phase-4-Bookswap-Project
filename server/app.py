from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from models import db

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookswap.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Register blueprints (routes will go here later)
    # from routes import api
    # app.register_blueprint(api)

    @app.route('/')
    def home():
        return {'message': 'Welcome to BookSwap API 🎉'}

    return app
