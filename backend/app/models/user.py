from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Import db using a function to avoid circular import
db = None  # This will be replaced by the set_db function

def set_db(database):
    global db
    db = database

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_artist = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    artworks = db.relationship('Artwork', backref='artist', lazy=True, cascade="all, delete-orphan")
    favorites = db.relationship('Favorite', backref='user', lazy=True, cascade="all, delete-orphan")
    
    def __init__(self, username, email, is_artist=False):
        self.username = username
        self.email = email
        self.is_artist = is_artist
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_artist': self.is_artist,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 