from flask import Blueprint, request, jsonify
from app import db
from app.models.favorite import Favorite
from app.models.artwork import Artwork
from app.utils import token_required
from sqlalchemy.exc import IntegrityError

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['GET'])
@token_required
def get_user_favorites(current_user):
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    
    # Get the artwork details for each favorite
    favorite_artworks = []
    for favorite in favorites:
        artwork = Artwork.query.get(favorite.artwork_id)
        if artwork:
            artwork_dict = artwork.to_dict()
            artwork_dict['favorite_id'] = favorite.id
            favorite_artworks.append(artwork_dict)
    
    return jsonify({
        'favorites': favorite_artworks,
        'count': len(favorite_artworks)
    }), 200

@favorites_bp.route('/favorites/<int:artwork_id>', methods=['POST'])
@token_required
def add_favorite(current_user, artwork_id):
    # Check if artwork exists
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({'error': 'Artwork not found'}), 404
    
    # Check if already favorited
    existing_favorite = Favorite.query.filter_by(
        user_id=current_user.id,
        artwork_id=artwork_id
    ).first()
    
    if existing_favorite:
        return jsonify({'error': 'Artwork already in favorites'}), 409
    
    # Create new favorite
    try:
        new_favorite = Favorite(
            user_id=current_user.id,
            artwork_id=artwork_id
        )
        
        db.session.add(new_favorite)
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork added to favorites',
            'favorite': new_favorite.to_dict()
        }), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Artwork already in favorites'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@favorites_bp.route('/favorites/<int:artwork_id>', methods=['DELETE'])
@token_required
def remove_favorite(current_user, artwork_id):
    # Find the favorite
    favorite = Favorite.query.filter_by(
        user_id=current_user.id,
        artwork_id=artwork_id
    ).first()
    
    if not favorite:
        return jsonify({'error': 'Artwork not in favorites'}), 404
    
    # Delete favorite
    try:
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            'message': 'Artwork removed from favorites'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@favorites_bp.route('/artworks/<int:artwork_id>/is_favorite', methods=['GET'])
@token_required
def check_if_favorite(current_user, artwork_id):
    # Check if artwork is in user's favorites
    favorite = Favorite.query.filter_by(
        user_id=current_user.id,
        artwork_id=artwork_id
    ).first()
    
    return jsonify({
        'is_favorite': favorite is not None
    }), 200 