from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    # Initialize the Flask application
    app = Flask(__name__)
    
    # Enable CORS for all routes with all origins
    CORS(app, 
         origins=["http://localhost:8080", "http://127.0.0.1:8080"], 
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Add a before_request handler to properly handle OPTIONS requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            return "", 200
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///instance/gallery.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_key_for_testing')
    
    # Initialize extensions with app
    db.init_app(app)
    
    # Import and initialize models after db is configured with app
    from app.models import artwork, user, favorite
    artwork.set_db(db)
    user.set_db(db)
    favorite.set_db(db)
    
    # Setup utils after models
    from app import utils
    utils.set_user_module(user)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.artwork import artwork_bp
    from app.routes.favorites import favorites_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(artwork_bp, url_prefix='/api')
    app.register_blueprint(favorites_bp, url_prefix='/api')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app 