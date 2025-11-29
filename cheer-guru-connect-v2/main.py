#!/usr/bin/env python3
"""
Cheer Guru Connect Backend - Main Application Entry Point
A Flask-based API server for the national cheerleading jobs board.
"""

import os
import sys
from pathlib import Path

# Add the parent directory to the Python path so we can import our modules
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

try:
    from simple_app import app
except ImportError:
    # Fallback: create a minimal Flask app if simple_app is not available
    from flask import Flask, jsonify
    from flask_cors import CORS
    
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/')
    def home():
        return jsonify({
            "message": "Cheer Guru Connect API",
            "status": "Backend is running successfully!",
            "version": "2.0.0"
        })
    
    @app.route('/api/health')
    def health():
        return jsonify({
            "status": "healthy",
            "message": "Backend service is operational"
        })

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run the Flask application
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False  # Set to False for production
    )
