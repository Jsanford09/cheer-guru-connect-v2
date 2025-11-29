import requests
from bs4 import BeautifulSoup
import re
import time
import hashlib
from datetime import datetime, timedelta
from urllib.parse import urljoin, urlparse, parse_qs
import logging

class K12JobSpotScraper:
    """
    Scraper for K12JobSpot.com education job board
    Focuses on cheerleading and coaching positions
    """
    
    def __init__(self):
        self.base_url = "https://www.k12jobspot.com"
        self.search_url = "https://www.k12jobspot.com/Search/Opportunities"
        self.session = requests.Session()
        
        # Set up headers to appear as a regular browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Rate limiting
        self.request_delay = 2  # seconds between requests
        self.last_request_time = 0
        
        # Keywords to search for
        self.cheerleading_keywords = [
            'cheerleading coach',
            'cheer coach', 
            'cheerleader coach',
            'spirit coach',
            'pep squad coach',
            'dance team coach',
            'pom coach'
        ]
        
        # Set up logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _rate_limit(self):
        """Implement rate limiting between requests"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.request_delay:
            sleep_time = self.request_delay - time_since_last
            time.sleep(sleep_time)
        self.last_request_time = time.time()
    
    def _make_request(self, url, params=None):
        """Make a rate-limited HTTP request"""
        self._rate_limit()
        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response
        except requests.RequestException as e:
            self.logger.error(f"Request failed for {url}: {e}")
            return None
    
    def search_jobs(self, keyword, max_results=50):
        """
        Search for jobs on K12JobSpot with a specific keyword
        
        Args:
            keyword: Search term (e.g., 'cheerleading coach')
            max_results: Maximum number of jobs to return
            
        Returns:
            List of job dictionaries
        """
        jobs = []
        
        # Search parameters for K12JobSpot
        search_params = {
            'keywords': keyword,
            'location': '',
            'locationRadius': '25'
        }
        
        self.logger.info(f"Searching K12JobSpot for: {keyword}")
        
        response = self._make_request(self.search_url, params=search_params)
        if not response:
            return jobs
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find job listings - based on the structure we observed
        # K12JobSpot uses div elements with specific classes for job listings
        job_containers = soup.find_all('div', class_=re.compile(r'job|opportunity|listing'))
        
        # Also look for links that might contain job details
        job_links = soup.find_all('a', href=re.compile(r'/job|/opportunity|/position'))
        
        processed_urls = set()
        
        # Process job containers
        for container in job_containers[:max_results]:
            job_data = self._extract_job_from_container(container)
            if job_data and job_data.get('sourceUrl') not in processed_urls:
                jobs.append(job_data)
                processed_urls.add(job_data.get('sourceUrl'))
        
        # Process job links if we didn't find enough jobs
        if len(jobs) < max_results:
            for link in job_links[:max_results - len(jobs)]:
                job_url = urljoin(self.base_url, link.get('href'))
                if job_url not in processed_urls:
                    job_data = self._scrape_job_details(job_url)
                    if job_data:
                        jobs.append(job_data)
                        processed_urls.add(job_url)
        
        self.logger.info(f"Found {len(jobs)} jobs for keyword: {keyword}")
        return jobs
    
    def _extract_job_from_container(self, container):
        """
        Extract job information from a job listing container
        
        Args:
            container: BeautifulSoup element containing job info
            
        Returns:
            Dictionary with job details or None
        """
        try:
            job_data = {
                'sourceSite': 'K12JobSpot',
                'scrapedAt': datetime.utcnow().isoformat()
            }
            
            # Extract title
            title_elem = container.find(['h1', 'h2', 'h3', 'h4']) or container.find('a')
            if title_elem:
                job_data['title'] = self._clean_text(title_elem.get_text())
                
                # If it's a link, get the URL
                if title_elem.name == 'a' and title_elem.get('href'):
                    job_data['sourceUrl'] = urljoin(self.base_url, title_elem.get('href'))
                    job_data['id'] = self._generate_job_id(job_data['sourceUrl'])
            
            # Extract organization/school
            org_elem = container.find(text=re.compile(r'School|District|Academy|College'))
            if org_elem:
                job_data['organization'] = self._clean_text(str(org_elem))
            
            # Extract location
            location_elem = container.find(text=re.compile(r'[A-Z]{2}|,\s*[A-Z]{2}'))
            if location_elem:
                location_text = self._clean_text(str(location_elem))
                location_info = self._parse_location(location_text)
                if location_info:
                    job_data.update(location_info)
            
            # Extract posted date
            date_elem = container.find(text=re.compile(r'\d+\s+(day|week|month)s?\s+ago'))
            if date_elem:
                job_data['postedDate'] = self._parse_relative_date(str(date_elem))
            
            # Set defaults
            job_data['type'] = self._classify_job_type(job_data.get('title', ''), '')
            job_data['program'] = self._classify_program_type(job_data.get('title', ''), '')
            job_data['status'] = 'Active'
            
            return job_data if job_data.get('title') else None
            
        except Exception as e:
            self.logger.error(f"Error extracting job from container: {e}")
            return None
    
    def _scrape_job_details(self, job_url):
        """
        Scrape detailed information from a specific job posting
        
        Args:
            job_url: URL of the job posting
            
        Returns:
            Dictionary with job details or None if scraping fails
        """
        response = self._make_request(job_url)
        if not response:
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        try:
            job_data = {
                'id': self._generate_job_id(job_url),
                'sourceUrl': job_url,
                'sourceSite': 'K12JobSpot',
                'scrapedAt': datetime.utcnow().isoformat()
            }
            
            # Job title
            title_elem = soup.find('h1') or soup.find('h2', class_=re.compile(r'title|job'))
            if title_elem:
                job_data['title'] = self._clean_text(title_elem.get_text())
            
            # Organization
            org_elem = soup.find(text=re.compile(r'School District|School|Academy|College'))
            if org_elem:
                # Look for the parent element that might contain the full organization name
                parent = org_elem.parent if hasattr(org_elem, 'parent') else None
                if parent:
                    job_data['organization'] = self._clean_text(parent.get_text())
            
            # Location
            location_elem = soup.find(text=re.compile(r'[A-Za-z\s]+,\s*[A-Z]{2}'))
            if location_elem:
                location_info = self._parse_location(str(location_elem))
                if location_info:
                    job_data.update(location_info)
            
            # Job description
            desc_elem = soup.find('div', class_=re.compile(r'description|content|details'))
            if desc_elem:
                job_data['description'] = self._clean_text(desc_elem.get_text())
            
            # Posted date
            date_elem = soup.find(text=re.compile(r'Posted|Date'))
            if date_elem:
                date_text = str(date_elem)
                if 'ago' in date_text:
                    job_data['postedDate'] = self._parse_relative_date(date_text)
                else:
                    job_data['postedDate'] = self._parse_date(date_text)
            
            # Salary/Compensation
            salary_elem = soup.find(text=re.compile(r'\$|salary|stipend|compensation', re.IGNORECASE))
            if salary_elem:
                job_data['compensation'] = self._clean_text(str(salary_elem))
            
            # Contact information
            contact_info = self._extract_contact_info(soup)
            if contact_info:
                job_data.update(contact_info)
            
            # Classify job
            job_data['type'] = self._classify_job_type(job_data.get('title', ''), job_data.get('description', ''))
            job_data['program'] = self._classify_program_type(job_data.get('title', ''), job_data.get('description', ''))
            job_data['status'] = 'Active'
            
            return job_data
            
        except Exception as e:
            self.logger.error(f"Error scraping job details from {job_url}: {e}")
            return None
    
    def _parse_location(self, location_text):
        """Parse location string into city and state"""
        # Look for patterns like "City, ST" or "City, State"
        patterns = [
            r'([A-Za-z\s]+),\s*([A-Z]{2})',  # City, ST
            r'([A-Za-z\s]+),\s*([A-Za-z\s]+)'  # City, State
        ]
        
        for pattern in patterns:
            match = re.search(pattern, location_text)
            if match:
                city = match.group(1).strip()
                state = match.group(2).strip()
                
                # Convert full state names to abbreviations if needed
                state_abbrev = self._get_state_abbreviation(state)
                
                return {
                    'location': f"{city}, {state_abbrev}",
                    'state': state_abbrev
                }
        
        return None
    
    def _get_state_abbreviation(self, state):
        """Convert state name to abbreviation"""
        state_map = {
            'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
            'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
            'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
            'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
            'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
            'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
            'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
            'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
            'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
            'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
            'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
            'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
            'Wisconsin': 'WI', 'Wyoming': 'WY'
        }
        
        return state_map.get(state, state)
    
    def _parse_relative_date(self, date_text):
        """Parse relative date like '5 days ago' into ISO format"""
        now = datetime.utcnow()
        
        # Extract number and unit
        match = re.search(r'(\d+)\s+(day|week|month)s?\s+ago', date_text, re.IGNORECASE)
        if match:
            number = int(match.group(1))
            unit = match.group(2).lower()
            
            if unit == 'day':
                date_obj = now - timedelta(days=number)
            elif unit == 'week':
                date_obj = now - timedelta(weeks=number)
            elif unit == 'month':
                date_obj = now - timedelta(days=number * 30)  # Approximate
            else:
                return None
            
            return date_obj.isoformat()
        
        return None
    
    def _parse_date(self, date_text):
        """Parse date string into ISO format"""
        # This is a simplified implementation
        # In practice, you'd want more robust date parsing
        return None
    
    def _extract_contact_info(self, soup):
        """Extract contact information"""
        contact_info = {}
        
        # Look for phone numbers
        phone_pattern = r'(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})'
        phone_match = re.search(phone_pattern, soup.get_text())
        if phone_match:
            contact_info['contactPhone'] = phone_match.group(1)
        
        # Look for email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, soup.get_text())
        if email_match:
            contact_info['contactEmail'] = email_match.group(0)
        
        return contact_info
    
    def _classify_job_type(self, title, description):
        """Classify the job type based on title and description"""
        text = f"{title} {description}".lower()
        
        if any(word in text for word in ['coach', 'coaching']):
            return 'Coaching'
        elif any(word in text for word in ['choreograph', 'choreography']):
            return 'Choreography'
        elif any(word in text for word in ['judge', 'judging', 'official']):
            return 'Judging'
        elif any(word in text for word in ['instructor', 'training', 'teach']):
            return 'Training'
        elif any(word in text for word in ['consultant', 'consulting', 'advisor']):
            return 'Consulting'
        else:
            return 'Coaching'  # Default
    
    def _classify_program_type(self, title, description):
        """Classify the program type based on title and description"""
        text = f"{title} {description}".lower()
        
        if any(word in text for word in ['dance', 'pom', 'drill team', 'jazz', 'hip hop']):
            return 'Dance/Pom'
        else:
            return 'Cheerleading'  # Default
    
    def _clean_text(self, text):
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Remove HTML entities
        text = text.replace('&nbsp;', ' ').replace('&amp;', '&')
        
        return text
    
    def _generate_job_id(self, url):
        """Generate a unique job ID from URL"""
        # Try to extract ID from URL
        match = re.search(r'/(\d+)/?$', url)
        if match:
            return f"k12jobspot-{match.group(1)}"
        
        # Fallback: hash the URL
        url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
        return f"k12jobspot-{url_hash}"
    
    def scrape_all_cheerleading_jobs(self, max_per_keyword=20):
        """
        Scrape all cheerleading-related jobs from K12JobSpot
        
        Args:
            max_per_keyword: Maximum jobs to scrape per keyword
            
        Returns:
            List of all scraped jobs
        """
        all_jobs = []
        seen_urls = set()
        
        for keyword in self.cheerleading_keywords:
            self.logger.info(f"Scraping jobs for keyword: {keyword}")
            jobs = self.search_jobs(keyword, max_per_keyword)
            
            # Deduplicate based on source URL
            for job in jobs:
                if job.get('sourceUrl') not in seen_urls:
                    all_jobs.append(job)
                    seen_urls.add(job.get('sourceUrl'))
        
        self.logger.info(f"Total unique jobs scraped: {len(all_jobs)}")
        return all_jobs
    
    def test_scrape(self, max_jobs=5):
        """
        Test the scraper with a small number of jobs
        
        Returns:
            Dictionary with test results
        """
        try:
            jobs = self.scrape_all_cheerleading_jobs(max_per_keyword=max_jobs)
            
            return {
                'success': True,
                'jobs_found': len(jobs),
                'sample_jobs': jobs[:3],  # Return first 3 as samples
                'keywords_tested': self.cheerleading_keywords,
                'message': f'Successfully scraped {len(jobs)} jobs from K12JobSpot'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Test scraping failed'
            }
