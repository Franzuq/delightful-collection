# Art Gallery Backend

This is the Flask backend for the Art Gallery project. It provides APIs for user authentication, artwork management, and favorites.

## Database Models

- **User**: Stores user information including username, email, password, and artist status.
- **Artwork**: Stores artwork details including title, description, image URL, and metadata.
- **Favorite**: Stores user-artwork favorites relationships.

## API Endpoints

### Authentication

- POST `/api/register`: Register a new user
- POST `/api/login`: Log in a user
- GET `/api/user`: Get current user information

### Artworks

- GET `/api/artworks`: Get all artworks
- GET `/api/artworks/<id>`: Get a specific artwork
- POST `/api/artworks`: Create a new artwork (requires artist privileges)
- PUT `/api/artworks/<id>`: Update an artwork (requires ownership)
- DELETE `/api/artworks/<id>`: Delete an artwork (requires ownership)
- POST `/api/artworks/<id>/like`: Like an artwork
- POST `/api/artworks/<id>/dislike`: Dislike an artwork

### Favorites

- GET `/api/favorites`: Get all favorites for the current user
- POST `/api/favorites/<artwork_id>`: Add an artwork to favorites
- DELETE `/api/favorites/<artwork_id>`: Remove an artwork from favorites
- GET `/api/artworks/<artwork_id>/is_favorite`: Check if an artwork is in favorites

## Setup and Running

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the setup script:
   ```
   python run.py
   ```

This will:
- Create a virtual environment
- Install all required dependencies
- Start the Flask server

## Testing with Postman

You can test the APIs using Postman:

1. Register a user:
   - POST `/api/register`
   - Body: `{ "username": "testuser", "email": "test@example.com", "password": "password", "is_artist": true }`

2. Login:
   - POST `/api/login`
   - Body: `{ "email": "test@example.com", "password": "password" }`
   - Save the token from the response

3. Use the token for authenticated requests:
   - Add an Authorization header: `Bearer <token>` 