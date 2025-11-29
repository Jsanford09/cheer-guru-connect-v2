from flask import Flask, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins="*")

@app.route('/')
def index():
    return {
        'message': 'Cheer Guru Connect API',
        'version': '2.0.0',
        'status': 'Backend is running successfully!'
    }

@app.route('/health')
def health_check():
    return {'status': 'healthy'}

@app.route('/api/test')
def test_endpoint():
    return {
        'success': True,
        'message': 'API is working correctly',
        'endpoints': {
            'jobs': '/api/jobs (not implemented yet)',
            'providers': '/api/providers (not implemented yet)',
            'scraper': '/api/scraper (not implemented yet)'
        }
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
