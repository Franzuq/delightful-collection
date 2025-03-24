from flask import Blueprint, request, jsonify
import jwt
import datetime
import os

# Handle imports in a way that works both at runtime and for linters
try:
    from app import db
    from app.models.user import User
    from app.utils import token_required
except ImportError:
    # These will be properly imported when the Flask app runs
    pass

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are provided
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    # Create new user
    try:
        new_user = User(
            username=data['username'],
            email=data['email'],
            is_artist=data.get('is_artist', False)
        )
        
        # Set password using the secure method
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check if required fields are provided
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user.id,
        'username': user.username,
        'is_artist': user.is_artist,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, os.getenv('SECRET_KEY'))
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/user', methods=['GET'])
def get_user():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({'error': 'Authorization header is missing'}), 401
    
    token = auth_header.split(' ')[1] if len(auth_header.split(' ')) > 1 else auth_header
    
    try:
        # Decode token
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        user_id = payload['user_id']
        
        # Get user
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@auth_bp.route('/update-artist-status', methods=['PUT', 'OPTIONS'])
@token_required
def update_artist_status(current_user):
    """Update the artist status of the authenticated user"""
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    
    if 'is_artist' not in data:
        return jsonify({'error': 'is_artist field is required'}), 400
    
    try:
        current_user.is_artist = data['is_artist']
        db.session.commit()
        
        # Generate a new token with updated artist status
        token = jwt.encode({
            'user_id': current_user.id,
            'username': current_user.username,
            'is_artist': current_user.is_artist,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, os.getenv('SECRET_KEY'))
        
        return jsonify({
            'message': 'Artist status updated successfully',
            'token': token,
            'user': current_user.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 