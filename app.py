from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins="*")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///cheer_guru.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize database
db = SQLAlchemy(app)

# Make db available to models
import app.models.job
import app.models.service_provider
app.models.job.db = db
app.models.service_provider.db = db

# Import models after db initialization
from app.models.job import Job, JobType, ProgramType, JobStatus
from app.models.service_provider import ServiceProvider, ExperienceLevel, ServiceStatus

# Import routes
from app.routes.jobs import jobs_bp
from app.routes.providers import providers_bp
from app.routes.scraper import scraper_bp

# Import services
from app.services.job_scraper import JobScraper

# Inject dependencies into routes
import app.routes.jobs as jobs_module
jobs_module.db = db
jobs_module.Job = Job
jobs_module.JobType = JobType
jobs_module.ProgramType = ProgramType
jobs_module.JobStatus = JobStatus

import app.routes.providers as providers_module
providers_module.db = db
providers_module.ServiceProvider = ServiceProvider
providers_module.ExperienceLevel = ExperienceLevel
providers_module.ServiceStatus = ServiceStatus

import app.routes.scraper as scraper_module
scraper_module.db = db
scraper_module.Job = Job
scraper_module.JobScraper = JobScraper

# Inject dependencies into services
import app.services.job_scraper as job_scraper_module
job_scraper_module.db = db
job_scraper_module.Job = Job
job_scraper_module.JobType = JobType
job_scraper_module.ProgramType = ProgramType
job_scraper_module.JobStatus = JobStatus

# Register blueprints
app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
app.register_blueprint(providers_bp, url_prefix='/api/providers')
app.register_blueprint(scraper_bp, url_prefix='/api/scraper')

@app.route('/')
def index():
    return {
        'message': 'Cheer Guru Connect API',
        'version': '2.0.0',
        'endpoints': {
            'jobs': '/api/jobs',
            'providers': '/api/providers',
            'scraper': '/api/scraper'
        }
    }

@app.route('/health')
def health_check():
    return {'status': 'healthy', 'database': 'connected'}

if __name__ == '__main__':
    with app.app_context():
        # Create all database tables
        db.create_all()
    
    # Run the app
    app.run(host='0.0.0.0', port=5000, debug=True)
