import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re
import uuid
import sys
import os

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.services.edjoin_scraper import EdJoinScraper

# db will be injected from the routes
db = None
Job = None
JobType = None
ProgramType = None
JobStatus = None

class JobScraper:
    """Service for scraping job postings from various education job sites"""
    
    def __init__(self):
        self.sources = {
            'edjoin': {
                'name': 'EdJoin',
                'base_url': 'https://www.edjoin.org',
                'search_url': 'https://www.edjoin.org/Home/Jobs',
                'enabled': True,
                'description': 'Education job board with cheerleading and coaching positions'
            },
            'schoolspring': {
                'name': 'SchoolSpring',
                'base_url': 'https://www.schoolspring.com',
                'search_url': 'https://www.schoolspring.com/jobs',
                'enabled': False,  # Will implement later
                'description': 'K-12 education job board'
            },
            'k12jobspot': {
                'name': 'K12JobSpot',
                'base_url': 'https://www.k12jobspot.com',
                'search_url': 'https://www.k12jobspot.com/jobs',
                'enabled': False,  # Will implement later
                'description': 'K-12 education career center'
            }
        }
    
    def get_available_scrapers(self):
        """Get list of available scraper sources"""
        return [source for source, config in self.sources.items() if config['enabled']]
    
    def is_source_available(self, source):
        """Check if a scraper source is available"""
        return source in self.sources and self.sources[source]['enabled']
    
    def get_source_configs(self):
        """Get configuration for all scraper sources"""
        return self.sources
    
    def scrape_jobs(self, sources=['all'], max_jobs=50):
        """
        Scrape jobs from specified sources
        
        Args:
            sources: List of source names or ['all'] for all sources
            max_jobs: Maximum number of jobs to scrape per source
            
        Returns:
            Dictionary with scraping results
        """
        if sources == ['all']:
            sources = self.get_available_scrapers()
        
        results = {
            'sources_scraped': [],
            'total_new_jobs': 0,
            'total_updated_jobs': 0,
            'errors': []
        }
        
        for source in sources:
            if not self.is_source_available(source):
                results['errors'].append(f'Source "{source}" is not available')
                continue
            
            try:
                if source == 'edjoin':
                    source_results = self._scrape_edjoin(max_jobs)
                else:
                    source_results = {'new_jobs': 0, 'updated_jobs': 0, 'error': 'Not implemented'}
                
                results['sources_scraped'].append({
                    'source': source,
                    'new_jobs': source_results.get('new_jobs', 0),
                    'updated_jobs': source_results.get('updated_jobs', 0),
                    'error': source_results.get('error')
                })
                
                results['total_new_jobs'] += source_results.get('new_jobs', 0)
                results['total_updated_jobs'] += source_results.get('updated_jobs', 0)
                
            except Exception as e:
                results['errors'].append(f'Error scraping {source}: {str(e)}')
        
        return results
    
    def test_scrape(self, source, max_jobs=5):
        """Test scraping from a specific source"""
        if not self.is_source_available(source):
            return {'error': f'Source "{source}" is not available'}
        
        try:
            if source == 'edjoin':
                return self._test_scrape_edjoin(max_jobs)
            else:
                return {'error': 'Test scraping not implemented for this source'}
        except Exception as e:
            return {'error': str(e)}
    
    def _scrape_edjoin(self, max_jobs=50):
        """
        Scrape jobs from EdJoin using the dedicated scraper
        """
        results = {'new_jobs': 0, 'updated_jobs': 0}
        
        try:
            scraper = EdJoinScraper()
            jobs_data = scraper.scrape_all_cheerleading_jobs(max_per_keyword=max_jobs//len(scraper.cheerleading_keywords))
            
            for job_data in jobs_data:
                try:
                    # Check if job already exists
                    existing_job = Job.query.get(job_data['id'])
                    
                    if existing_job:
                        # Update existing job
                        for key, value in job_data.items():
                            if hasattr(existing_job, key) and key != 'id':
                                setattr(existing_job, key, value)
                        existing_job.last_updated = datetime.utcnow()
                        results['updated_jobs'] += 1
                    else:
                        # Create new job
                        new_job = Job.from_dict(job_data)
                        db.session.add(new_job)
                        results['new_jobs'] += 1
                    
                    db.session.commit()
                    
                except Exception as e:
                    db.session.rollback()
                    print(f"Error processing job {job_data.get('id', 'unknown')}: {e}")
                    continue
            
            results['total_processed'] = len(jobs_data)
            
        except Exception as e:
            results['error'] = str(e)
        
        return results
    
    def _test_scrape_edjoin(self, max_jobs=5):
        """Test scraping from EdJoin"""
        try:
            scraper = EdJoinScraper()
            test_results = scraper.test_scrape(max_jobs)
            return test_results
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'EdJoin test scraping failed'
            }
    
    def _extract_job_type(self, title, description):
        """Extract job type from title and description"""
        title_lower = title.lower()
        desc_lower = description.lower()
        
        if any(word in title_lower for word in ['coach', 'coaching']):
            return JobType.COACHING
        elif any(word in title_lower for word in ['choreograph', 'choreography']):
            return JobType.CHOREOGRAPHY
        elif any(word in title_lower for word in ['judge', 'judging', 'official']):
            return JobType.JUDGING
        elif any(word in title_lower for word in ['instructor', 'training', 'teach']):
            return JobType.TRAINING
        elif any(word in title_lower for word in ['consultant', 'consulting', 'advisor']):
            return JobType.CONSULTING
        else:
            return JobType.COACHING  # Default
    
    def _extract_program_type(self, title, description):
        """Extract program type from title and description"""
        text = f"{title} {description}".lower()
        
        if any(word in text for word in ['dance', 'pom', 'drill team', 'jazz', 'hip hop']):
            return ProgramType.DANCE_POM
        else:
            return ProgramType.CHEERLEADING  # Default for most positions
    
    def _clean_text(self, text):
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Remove HTML entities
        text = text.replace('&nbsp;', ' ').replace('&amp;', '&')
        
        return text
    
    def _generate_job_id(self, title, organization, source_url):
        """Generate a unique job ID"""
        # Create a hash-based ID that's consistent for the same job
        import hashlib
        content = f"{title}-{organization}-{source_url}"
        hash_id = hashlib.md5(content.encode()).hexdigest()[:8]
        return f"scraped-{hash_id}"
