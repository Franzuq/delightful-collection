from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'API server is running'
    })

@app.route('/api/artworks', methods=['GET'])
def get_artworks():
    # Return mock data
    mock_artworks = [
        {
            "id": 1,
            "title": "Ethereal Dreams",
            "artist_name": "Sophia Chen",
            "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "description": "This mesmerizing abstract piece explores the fluid boundary between dreams and reality."
        },
        {
            "id": 2,
            "title": "Urban Symphony",
            "artist_name": "Marcus Lee",
            "image_url": "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "description": "A vibrant depiction of city life with its energy and constant movement."
        }
    ]
    
    return jsonify({
        'artworks': mock_artworks,
        'count': len(mock_artworks)
    })

if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True) 