import requests
from bs4 import BeautifulSoup
import re
import time
import hashlib
from datetime import datetime, timedelta
from urllib.parse import urljoin, urlparse, parse_qs
import logging

class EdJoinScraper:
    """
    Scraper for EdJoin.org education job board
    Focuses on cheerleading and coaching positions
    """
    
    def __init__(self):
        self.base_url = "https://www.edjoin.org"
        self.search_url = "https://www.edjoin.org/Home/Jobs"
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
        Search for jobs on EdJoin with a specific keyword
        
        Args:
            keyword: Search term (e.g., 'cheerleading coach')
            max_results: Maximum number of jobs to return
            
        Returns:
            List of job dictionaries
        """
        jobs = []
        
        # Search parameters
        search_params = {
            'keywords': keyword,
            'searchType': 'all'
        }
        
        self.logger.info(f"Searching EdJoin for: {keyword}")
        
        response = self._make_request(self.search_url, params=search_params)
        if not response:
            return jobs
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find job listings - this is a simplified approach
        # In reality, EdJoin likely uses JavaScript for dynamic loading
        job_links = soup.find_all('a', href=re.compile(r'/Home/JobPosting/\d+'))
        
        for link in job_links[:max_results]:
            job_url = urljoin(self.base_url, link.get('href'))
            job_data = self._scrape_job_details(job_url)
            if job_data:
                jobs.append(job_data)
        
        self.logger.info(f"Found {len(jobs)} jobs for keyword: {keyword}")
        return jobs
    
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
            # Extract job details - these selectors are based on the structure
            # we observed in the sample EdJoin job posting
            job_data = {
                'id': self._generate_job_id(job_url),
                'sourceUrl': job_url,
                'sourceSite': 'EdJoin',
                'scrapedAt': datetime.utcnow().isoformat()
            }
            
            # Job title - usually in an h1 or h2 tag
            title_elem = soup.find('h1') or soup.find('h2')
            if title_elem:
                job_data['title'] = self._clean_text(title_elem.get_text())
            
            # Organization/District - look for district name
            org_elem = soup.find('a', href=re.compile(r'/Home/Jobs\?districtID='))
            if org_elem:
                job_data['organization'] = self._clean_text(org_elem.get_text())
            
            # Location - extract from various possible locations
            location = self._extract_location(soup)
            if location:
                job_data['location'] = location['city_state']
                job_data['state'] = location['state']
            
            # Application deadline
            deadline_text = self._find_text_by_label(soup, ['Application Deadline', 'Deadline'])
            if deadline_text:
                job_data['deadline'] = self._parse_date(deadline_text)
            
            # Posted date
            posted_text = self._find_text_by_label(soup, ['Date Posted', 'Posted'])
            if posted_text:
                job_data['postedDate'] = self._parse_date(posted_text)
            
            # Salary/Compensation
            salary_text = self._find_text_by_label(soup, ['Salary', 'Compensation', 'Stipend'])
            if salary_text:
                job_data['compensation'] = self._clean_text(salary_text)
            
            # Contact information
            contact_info = self._extract_contact_info(soup)
            if contact_info:
                job_data.update(contact_info)
            
            # Job description - look for main content area
            description = self._extract_description(soup)
            if description:
                job_data['description'] = description
            
            # Requirements - look for requirements section
            requirements = self._extract_requirements(soup)
            if requirements:
                job_data['requirements'] = requirements
            
            # Determine job type and program from title and description
            job_data['type'] = self._classify_job_type(job_data.get('title', ''), job_data.get('description', ''))
            job_data['program'] = self._classify_program_type(job_data.get('title', ''), job_data.get('description', ''))
            
            # Set status
            job_data['status'] = 'Active'  # Assume active if we found it
            
            return job_data
            
        except Exception as e:
            self.logger.error(f"Error scraping job details from {job_url}: {e}")
            return None
    
    def _extract_location(self, soup):
        """Extract location information from job posting"""
        # Look for various location indicators
        location_patterns = [
            r'([A-Za-z\s]+),\s*([A-Z]{2})\s*\d{5}',  # City, ST 12345
            r'([A-Za-z\s]+),\s*([A-Z]{2})',          # City, ST
        ]
        
        # Search in various elements
        text_content = soup.get_text()
        
        for pattern in location_patterns:
            match = re.search(pattern, text_content)
            if match:
                city = match.group(1).strip()
                state = match.group(2).strip()
                return {
                    'city_state': f"{city}, {state}",
                    'state': state
                }
        
        return None
    
    def _find_text_by_label(self, soup, labels):
        """Find text content by looking for specific labels"""
        for label in labels:
            # Look for the label followed by content
            label_elem = soup.find(text=re.compile(label, re.IGNORECASE))
            if label_elem:
                # Try to find the next text content
                parent = label_elem.parent
                if parent:
                    next_elem = parent.find_next_sibling()
                    if next_elem:
                        return self._clean_text(next_elem.get_text())
        return None
    
    def _extract_contact_info(self, soup):
        """Extract contact information from job posting"""
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
    
    def _extract_description(self, soup):
        """Extract the main job description"""
        # Look for common description containers
        desc_selectors = [
            'div.job-description',
            'div.description',
            'div.content',
            'div[class*="description"]',
            'div[class*="content"]'
        ]
        
        for selector in desc_selectors:
            elem = soup.select_one(selector)
            if elem:
                return self._clean_text(elem.get_text())
        
        # Fallback: look for the largest text block
        text_blocks = soup.find_all(['div', 'p'], text=True)
        if text_blocks:
            longest_block = max(text_blocks, key=lambda x: len(x.get_text()))
            return self._clean_text(longest_block.get_text())
        
        return None
    
    def _extract_requirements(self, soup):
        """Extract job requirements"""
        # Look for requirements section
        req_keywords = ['requirements', 'qualifications', 'must have', 'required']
        
        for keyword in req_keywords:
            req_elem = soup.find(text=re.compile(keyword, re.IGNORECASE))
            if req_elem:
                parent = req_elem.parent
                if parent:
                    # Look for list items or next content
                    req_list = parent.find_next('ul') or parent.find_next('ol')
                    if req_list:
                        items = [self._clean_text(li.get_text()) for li in req_list.find_all('li')]
                        return '; '.join(items)
                    else:
                        next_elem = parent.find_next_sibling()
                        if next_elem:
                            return self._clean_text(next_elem.get_text())
        
        return None
    
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
    
    def _parse_date(self, date_text):
        """Parse date string into ISO format"""
        if not date_text:
            return None
        
        # Clean the date text
        date_text = self._clean_text(date_text)
        
        # Common date patterns
        date_patterns = [
            r'(\d{1,2})/(\d{1,2})/(\d{4})',  # MM/DD/YYYY
            r'(\d{1,2})-(\d{1,2})-(\d{4})',  # MM-DD-YYYY
            r'(\d{4})-(\d{1,2})-(\d{1,2})',  # YYYY-MM-DD
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, date_text)
            if match:
                try:
                    if pattern == date_patterns[2]:  # YYYY-MM-DD
                        year, month, day = match.groups()
                    else:  # MM/DD/YYYY or MM-DD-YYYY
                        month, day, year = match.groups()
                    
                    date_obj = datetime(int(year), int(month), int(day))
                    return date_obj.isoformat()
                except ValueError:
                    continue
        
        return None
    
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
        # Extract job ID from URL if possible
        match = re.search(r'/JobPosting/(\d+)', url)
        if match:
            return f"edjoin-{match.group(1)}"
        
        # Fallback: hash the URL
        url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
        return f"edjoin-{url_hash}"
    
    def scrape_all_cheerleading_jobs(self, max_per_keyword=20):
        """
        Scrape all cheerleading-related jobs from EdJoin
        
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
                'message': f'Successfully scraped {len(jobs)} jobs from EdJoin'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Test scraping failed'
            }
