from flask import request, jsonify
from functools import wraps
import jwt
import os
from app.models.user import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header is missing'}), 401
        
        token = auth_header.split(' ')[1] if len(auth_header.split(' ')) > 1 else auth_header
        
        try:
            # Decode token
            payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            user_id = payload['user_id']
            
            # Get user
            current_user = User.query.get(user_id)
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def artist_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_artist:
            return jsonify({'error': 'Artist privileges required'}), 403
        
        return f(current_user, *args, **kwargs)
    
    return decorated 