from datetime import datetime

# Import db using a function to avoid circular import
db = None  # This will be replaced by the set_db function

def set_db(database):
    global db
    db = database

class Artwork(db.Model):
    __tablename__ = 'artworks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(50), nullable=True)
    medium = db.Column(db.String(50), nullable=True)
    dimensions = db.Column(db.String(50), nullable=True)
    year = db.Column(db.Integer, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    favorites = db.relationship('Favorite', backref='artwork', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url,
            'artist_id': self.artist_id,
            'artist_name': self.artist.username if self.artist else None,
            'category': self.category,
            'medium': self.medium,
            'dimensions': self.dimensions,
            'year': self.year,
            'location': self.location,
            'likes': self.likes,
            'dislikes': self.dislikes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 