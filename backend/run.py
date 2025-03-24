import subprocess
import os
import sys
import time

# Handle imports in a way that works both at runtime and for linters
try:
    from app import create_app, db
    
    # Create Flask app
    app = create_app()
    
    # Import models after app is created
    from app.models.artwork import Artwork
    from app.models.user import User
except ImportError:
    # These will be properly imported when the Flask app runs
    pass

def setup_and_run():
    """Set up and run the Flask application."""
    print("Setting up Flask backend...")
    
    # Create a virtual environment if it doesn't exist
    if not os.path.exists('venv'):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', 'venv'], check=True)
    
    # Determine command prefix based on OS
    if os.name == 'nt':  # Windows
        python_path = os.path.join('venv', 'Scripts', 'python')
        pip_path = os.path.join('venv', 'Scripts', 'pip')
    else:  # Unix/Linux/Mac
        python_path = os.path.join('venv', 'bin', 'python')
        pip_path = os.path.join('venv', 'bin', 'pip')
    
    # Install dependencies
    print("Installing dependencies...")
    subprocess.run([pip_path, 'install', '-r', 'requirements.txt'], check=True)
    
    # Run the Flask application
    print("Starting Flask server...")
    subprocess.run([python_path, 'app.py'])

# Function to seed the database with mock data
def seed_database():
    with app.app_context():
        # Check if database is already seeded
        if Artwork.query.first() is not None:
            print("Database already has data, skipping seed.")
            return
        
        # Create a test user
        if User.query.filter_by(email="test@example.com").first() is None:
            test_user = User(
                username="testuser",
                email="test@example.com",
                is_artist=True
            )
            test_user.set_password("password123")
            db.session.add(test_user)
            db.session.commit()
            print("Created test user")
        else:
            test_user = User.query.filter_by(email="test@example.com").first()
        
        # Create sample artworks
        artworks = [
            Artwork(
                title="Ethereal Dreams",
                description="This mesmerizing abstract piece explores the fluid boundary between dreams and reality.",
                image_url="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                artist_id=test_user.id,
                category="Abstract",
                medium="Acrylic on Canvas",
                dimensions="36 × 48 inches",
                year=2023,
                location="New York, USA"
            ),
            Artwork(
                title="Urban Symphony",
                description="A vibrant depiction of city life with its energy and constant movement.",
                image_url="https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                artist_id=test_user.id,
                category="Urban",
                medium="Mixed Media",
                dimensions="24 × 36 inches",
                year=2022,
                location="Chicago, USA"
            ),
            Artwork(
                title="Celestial Harmony",
                description="An exploration of cosmic themes with swirling galaxies and celestial bodies.",
                image_url="https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                artist_id=test_user.id,
                category="Abstract",
                medium="Digital Art",
                dimensions="30 × 40 inches",
                year=2023,
                location="Online"
            ),
            Artwork(
                title="Whispers of Nature",
                description="A serene landscape capturing the tranquility of untouched wilderness.",
                image_url="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                artist_id=test_user.id,
                category="Landscape",
                medium="Oil on Canvas",
                dimensions="36 × 24 inches",
                year=2021,
                location="Portland, USA"
            )
        ]
        
        for artwork in artworks:
            db.session.add(artwork)
        
        db.session.commit()
        print(f"Added {len(artworks)} sample artworks to the database")

if __name__ == "__main__":
    # Seed the database with mock data
    seed_database()
    
    # Run the Flask application
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() in ("true", "1", "t")
    
    app.run(host=host, port=port, debug=debug) 