from datetime import datetime
from enum import Enum

# db will be injected from app.py
db = None

class JobType(Enum):
    COACHING = "Coaching"
    CHOREOGRAPHY = "Choreography"
    JUDGING = "Judging"
    TRAINING = "Training"
    CONSULTING = "Consulting"

class ProgramType(Enum):
    CHEERLEADING = "Cheerleading"
    DANCE_POM = "Dance/Pom"

class JobStatus(Enum):
    ACTIVE = "Active"
    FILLED = "Filled"
    EXPIRED = "Expired"
    URGENT = "Urgent"

class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum(JobType), nullable=False)
    program = db.Column(db.Enum(ProgramType), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    organization = db.Column(db.String(200), nullable=False)
    requirements = db.Column(db.Text)
    compensation = db.Column(db.String(200))
    contact_email = db.Column(db.String(200))
    contact_phone = db.Column(db.String(20))
    posted_date = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime)
    status = db.Column(db.Enum(JobStatus), default=JobStatus.ACTIVE)
    
    # Scraping metadata
    source_url = db.Column(db.String(500))
    source_site = db.Column(db.String(100))
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type.value if self.type else None,
            'program': self.program.value if self.program else None,
            'location': self.location,
            'state': self.state,
            'organization': self.organization,
            'requirements': self.requirements,
            'compensation': self.compensation,
            'contactEmail': self.contact_email,
            'contactPhone': self.contact_phone,
            'postedDate': self.posted_date.isoformat() if self.posted_date else None,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'status': self.status.value if self.status else None,
            'sourceUrl': self.source_url,
            'sourceSite': self.source_site,
            'scrapedAt': self.scraped_at.isoformat() if self.scraped_at else None,
            'lastUpdated': self.last_updated.isoformat() if self.last_updated else None
        }
    
    @classmethod
    def from_dict(cls, data):
        job = cls()
        job.id = data.get('id')
        job.title = data.get('title')
        job.description = data.get('description')
        job.type = JobType(data.get('type')) if data.get('type') else None
        job.program = ProgramType(data.get('program')) if data.get('program') else None
        job.location = data.get('location')
        job.state = data.get('state')
        job.organization = data.get('organization')
        job.requirements = data.get('requirements')
        job.compensation = data.get('compensation')
        job.contact_email = data.get('contactEmail')
        job.contact_phone = data.get('contactPhone')
        
        # Handle datetime fields
        if data.get('postedDate'):
            job.posted_date = datetime.fromisoformat(data['postedDate'].replace('Z', '+00:00'))
        if data.get('deadline'):
            job.deadline = datetime.fromisoformat(data['deadline'].replace('Z', '+00:00'))
            
        job.status = JobStatus(data.get('status')) if data.get('status') else JobStatus.ACTIVE
        job.source_url = data.get('sourceUrl')
        job.source_site = data.get('sourceSite')
        
        return job
