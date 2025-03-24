from flask import Flask
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
    
    # Configure CORS to allow requests from the frontend
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}})
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///instance/gallery.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_key_for_testing')
    
    # Initialize extensions with app
    db.init_app(app)
    
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