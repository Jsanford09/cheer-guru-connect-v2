from flask import Blueprint, request, jsonify
import sys
import os
from datetime import datetime, timedelta

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# These will be injected from app.py
db = None
Job = None
JobScraper = None

scraper_bp = Blueprint('scraper', __name__)

@scraper_bp.route('/status', methods=['GET'])
def get_scraper_status():
    """Get the current status of the job scraper"""
    try:
        # Get last scrape information
        last_job = Job.query.order_by(Job.scraped_at.desc()).first()
        last_scrape = last_job.scraped_at if last_job else None
        
        # Get counts by source
        sources = db.session.query(
            Job.source_site,
            db.func.count(Job.id).label('count')
        ).group_by(Job.source_site).all()
        
        source_counts = {source[0]: source[1] for source in sources if source[0]}
        
        return jsonify({
            'success': True,
            'status': {
                'last_scrape': last_scrape.isoformat() if last_scrape else None,
                'total_scraped_jobs': Job.query.filter(Job.source_url.isnot(None)).count(),
                'sources': source_counts,
                'available_scrapers': JobScraper.get_available_scrapers()
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scraper_bp.route('/run', methods=['POST'])
def run_scraper():
    """Manually trigger the job scraper"""
    try:
        data = request.get_json() or {}
        sources = data.get('sources', ['all'])  # Default to all sources
        max_jobs = data.get('max_jobs', 50)     # Limit to prevent overload
        
        scraper = JobScraper()
        results = scraper.scrape_jobs(sources=sources, max_jobs=max_jobs)
        
        return jsonify({
            'success': True,
            'results': results,
            'message': f'Scraping completed. Found {results.get("total_new_jobs", 0)} new jobs.'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scraper_bp.route('/test/<source>', methods=['GET'])
def test_scraper(source):
    """Test a specific scraper source"""
    try:
        scraper = JobScraper()
        
        if not scraper.is_source_available(source):
            return jsonify({
                'success': False,
                'error': f'Scraper source "{source}" is not available'
            }), 400
        
        # Test scrape (limit to 5 jobs for testing)
        results = scraper.test_scrape(source, max_jobs=5)
        
        return jsonify({
            'success': True,
            'source': source,
            'test_results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scraper_bp.route('/clean', methods=['POST'])
def clean_old_jobs():
    """Clean up old or expired job postings"""
    try:
        data = request.get_json() or {}
        days_old = data.get('days_old', 90)  # Default to 90 days
        
        # Calculate cutoff date
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        
        # Find old jobs
        old_jobs = Job.query.filter(
            db.or_(
                Job.deadline < datetime.utcnow(),  # Expired jobs
                Job.scraped_at < cutoff_date       # Old scraped jobs
            )
        ).all()
        
        deleted_count = len(old_jobs)
        
        # Delete old jobs
        for job in old_jobs:
            db.session.delete(job)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'deleted_count': deleted_count,
            'message': f'Cleaned up {deleted_count} old job postings'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@scraper_bp.route('/sources', methods=['GET'])
def get_scraper_sources():
    """Get available scraper sources and their configurations"""
    try:
        scraper = JobScraper()
        sources = scraper.get_source_configs()
        
        return jsonify({
            'success': True,
            'sources': sources
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
