from datetime import datetime
from enum import Enum

# db will be injected from app.py
db = None

class ExperienceLevel(Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    ELITE = "Elite"

class ServiceStatus(Enum):
    AVAILABLE = "Available"
    BUSY = "Busy"
    UNAVAILABLE = "Unavailable"

class ProgramType(Enum):
    CHEERLEADING = "Cheerleading"
    DANCE_POM = "Dance/Pom"

class ServiceProvider(db.Model):
    __tablename__ = 'service_providers'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.Text)
    specialties = db.Column(db.JSON)  # List of specialties
    programs = db.Column(db.JSON)    # List of program types
    experience_level = db.Column(db.Enum(ExperienceLevel))
    location = db.Column(db.String(100))
    state = db.Column(db.String(50))
    services = db.Column(db.JSON)    # List of services with rates
    rates = db.Column(db.String(200))
    availability = db.Column(db.String(500))
    contact_email = db.Column(db.String(200))
    contact_phone = db.Column(db.String(20))
    website = db.Column(db.String(300))
    social_media = db.Column(db.String(200))
    certifications = db.Column(db.JSON)  # List of certifications
    experience = db.Column(db.String(500))
    status = db.Column(db.Enum(ServiceStatus), default=ServiceStatus.AVAILABLE)
    rating = db.Column(db.Float, default=0.0)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'bio': self.bio,
            'specialties': self.specialties or [],
            'programs': self.programs or [],
            'experienceLevel': self.experience_level.value if self.experience_level else None,
            'location': self.location,
            'state': self.state,
            'services': self.services or [],
            'rates': self.rates,
            'availability': self.availability,
            'contactEmail': self.contact_email,
            'contactPhone': self.contact_phone,
            'website': self.website,
            'socialMedia': self.social_media,
            'certifications': self.certifications or [],
            'experience': self.experience,
            'status': self.status.value if self.status else None,
            'rating': self.rating,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        provider = cls()
        provider.id = data.get('id')
        provider.name = data.get('name')
        provider.bio = data.get('bio')
        provider.specialties = data.get('specialties', [])
        provider.programs = data.get('programs', [])
        provider.experience_level = ExperienceLevel(data.get('experienceLevel')) if data.get('experienceLevel') else None
        provider.location = data.get('location')
        provider.state = data.get('state')
        provider.services = data.get('services', [])
        provider.rates = data.get('rates')
        provider.availability = data.get('availability')
        provider.contact_email = data.get('contactEmail')
        provider.contact_phone = data.get('contactPhone')
        provider.website = data.get('website')
        provider.social_media = data.get('socialMedia')
        provider.certifications = data.get('certifications', [])
        provider.experience = data.get('experience')
        provider.status = ServiceStatus(data.get('status')) if data.get('status') else ServiceStatus.AVAILABLE
        provider.rating = data.get('rating', 0.0)
        
        return provider
