from datetime import datetime

# Import db using a function to avoid circular import
db = None  # This will be replaced by the set_db function

def set_db(database):
    global db
    db = database

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    artwork_id = db.Column(db.Integer, db.ForeignKey('artworks.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure a user can only favorite an artwork once
    __table_args__ = (db.UniqueConstraint('user_id', 'artwork_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'artwork_id': self.artwork_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 