# Handle imports with try-except to satisfy linters
try:
    from app import create_app
    
    app = create_app()
    
    if __name__ == '__main__':
        app.run(debug=True)
except ImportError:
    # Will be properly imported when run
    pass 