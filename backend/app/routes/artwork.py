from flask import Blueprint, request, jsonify
import os
import tempfile

# Handle imports in a way that works both at runtime and for linters
try:
    from app import db
    from app.models.artwork import Artwork
    from app.utils import token_required, artist_required, upload_image_to_cloudinary
except ImportError:
    # These will be properly imported when the Flask app runs
    pass

artwork_bp = Blueprint('artwork', __name__)

@artwork_bp.route('/artworks', methods=['GET'])
def get_artworks():
    # Get query parameters for filtering
    category = request.args.get('category')
    artist_id = request.args.get('artist_id')
    
    # Base query
    query = Artwork.query
    
    # Apply filters if provided
    if category:
        query = query.filter_by(category=category)
    if artist_id:
        query = query.filter_by(artist_id=artist_id)
    
    # Get artworks
    artworks = query.order_by(Artwork.created_at.desc()).all()
    
    return jsonify({
        'artworks': [artwork.to_dict() for artwork in artworks],
        'count': len(artworks)
    }), 200

@artwork_bp.route('/artworks/<int:artwork_id>', methods=['GET'])
def get_artwork(artwork_id):
    artwork = Artwork.query.get(artwork_id)
    
    if not artwork:
        return jsonify({'error': 'Artwork not found'}), 404
    
    return jsonify({'artwork': artwork.to_dict()}), 200

@artwork_bp.route('/artworks', methods=['POST', 'OPTIONS'])
@token_required
@artist_required
def create_artwork(current_user):
    """Create a new artwork."""
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
        
    # Check if we're receiving form data or JSON
    if request.content_type and 'multipart/form-data' in request.content_type:
        # Handle form data
        data = request.form
        image_file = request.files.get('image')
        
        # Check if required fields are provided
        if not data.get('title'):
            return jsonify({'error': 'Missing required field: title'}), 400
            
        if not image_file:
            return jsonify({'error': 'Missing required field: image'}), 400
        
        # Upload image to Cloudinary
        try:
            # Save the file temporarily
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            image_file.save(temp_file.name)
            temp_file.close()
            
            # Upload to Cloudinary
            image_url = upload_image_to_cloudinary(temp_file.name)
            
            # Clean up temporary file
            os.unlink(temp_file.name)
        except Exception as e:
            return jsonify({'error': f'Error uploading image: {str(e)}'}), 500
        
    else:
        # Handle JSON data
        data = request.get_json()
        
        # Check if required fields are provided
        required_fields = ['title', 'image_url']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        image_url = data['image_url']
    
    # Create new artwork
    try:
        new_artwork = Artwork(
            title=data['title'],
            description=data.get('description', ''),
            image_url=image_url,
            artist_id=current_user.id,
            category=data.get('category'),
            medium=data.get('medium'),
            dimensions=data.get('dimensions'),
            year=data.get('year', None),
            location=data.get('location')
        )
        
        # Process tags if present
        if 'tags' in request.form:
            # Handle tags from form data
            pass
        
        db.session.add(new_artwork)
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork created successfully',
            'artwork': new_artwork.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@artwork_bp.route('/artworks/<int:artwork_id>', methods=['PUT'])
@token_required
def update_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    
    if not artwork:
        return jsonify({'error': 'Artwork not found'}), 404
    
    # Check if user is the artist
    if artwork.artist_id != current_user.id:
        return jsonify({'error': 'You can only update your own artworks'}), 403
    
    data = request.get_json()
    
    # Update artwork fields
    try:
        if 'title' in data:
            artwork.title = data['title']
        if 'description' in data:
            artwork.description = data['description']
        if 'image_url' in data:
            artwork.image_url = data['image_url']
        if 'category' in data:
            artwork.category = data['category']
        if 'medium' in data:
            artwork.medium = data['medium']
        if 'dimensions' in data:
            artwork.dimensions = data['dimensions']
        if 'year' in data:
            artwork.year = data['year']
        if 'location' in data:
            artwork.location = data['location']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork updated successfully',
            'artwork': artwork.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@artwork_bp.route('/artworks/<int:artwork_id>', methods=['DELETE'])
@token_required
def delete_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    
    if not artwork:
        return jsonify({'error': 'Artwork not found'}), 404
    
    # Check if user is the artist
    if artwork.artist_id != current_user.id:
        return jsonify({'error': 'You can only delete your own artworks'}), 403
    
    try:
        db.session.delete(artwork)
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@artwork_bp.route('/artworks/<int:artwork_id>/like', methods=['POST'])
@token_required
def like_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    
    if not artwork:
        return jsonify({'error': 'Artwork not found'}), 404
    
    try:
        artwork.likes += 1
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork liked successfully',
            'artwork': artwork.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@artwork_bp.route('/artworks/<int:artwork_id>/dislike', methods=['POST'])
@token_required
def dislike_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    
    if not artwork:
        return jsonify({'error': 'Artwork not found'}), 404
    
    try:
        artwork.dislikes += 1
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork disliked successfully',
            'artwork': artwork.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 