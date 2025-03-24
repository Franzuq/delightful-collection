from flask import request, jsonify
from functools import wraps
import jwt
import os
import cloudinary
import cloudinary.uploader

# For avoiding circular imports
user_module = None

def set_user_module(module):
    global user_module
    user_module = module

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'demo'),
    api_key=os.getenv('CLOUDINARY_API_KEY', ''),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', ''),
    secure=True
)

def upload_image_to_cloudinary(image_file, folder="artwork"):
    """Upload an image to Cloudinary and return the URL."""
    try:
        # Upload the image
        result = cloudinary.uploader.upload(
            image_file,
            folder=folder,
            resource_type="image"
        )
        # Return the secure URL
        return result['secure_url']
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        # Return a fallback URL in case of error
        return f"https://images.unsplash.com/photo-{1550000000000}?ixlib=rb-4.0.3"

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
            
            # Get user using the user module passed in from app/__init__.py
            User = user_module.User
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