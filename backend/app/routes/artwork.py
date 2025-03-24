from flask import Blueprint, request, jsonify
from app import db
from app.models.artwork import Artwork
from app.utils import token_required, artist_required

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

@artwork_bp.route('/artworks', methods=['POST'])
@token_required
@artist_required
def create_artwork(current_user):
    data = request.get_json()
    
    # Check if required fields are provided
    required_fields = ['title', 'image_url']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Create new artwork
    try:
        new_artwork = Artwork(
            title=data['title'],
            description=data.get('description'),
            image_url=data['image_url'],
            artist_id=current_user.id,
            category=data.get('category'),
            medium=data.get('medium'),
            dimensions=data.get('dimensions'),
            year=data.get('year'),
            location=data.get('location')
        )
        
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