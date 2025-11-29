from flask import Blueprint, request, jsonify
import sys
import os
from datetime import datetime
import uuid

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# These will be injected from app.py
db = None
ServiceProvider = None
ExperienceLevel = None
ServiceStatus = None

providers_bp = Blueprint('providers', __name__)

@providers_bp.route('/', methods=['GET'])
def get_providers():
    """Get all service providers with optional filtering"""
    try:
        # Get query parameters
        program = request.args.get('program')
        state = request.args.get('state')
        experience_level = request.args.get('experience')
        status = request.args.get('status')
        search = request.args.get('search')
        
        # Build query
        query = ServiceProvider.query
        
        if program and program != 'all':
            # Filter providers who work with this program type
            query = query.filter(ServiceProvider.programs.contains([program]))
        
        if state and state != 'all':
            query = query.filter(ServiceProvider.state == state)
            
        if experience_level and experience_level != 'all':
            query = query.filter(ServiceProvider.experience_level == ExperienceLevel(experience_level))
            
        if status and status != 'all':
            query = query.filter(ServiceProvider.status == ServiceStatus(status))
            
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    ServiceProvider.name.ilike(search_term),
                    ServiceProvider.bio.ilike(search_term),
                    ServiceProvider.location.ilike(search_term)
                )
            )
        
        # Order by rating (highest first), then by name
        providers = query.order_by(ServiceProvider.rating.desc(), ServiceProvider.name).all()
        
        return jsonify({
            'success': True,
            'providers': [provider.to_dict() for provider in providers],
            'count': len(providers)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@providers_bp.route('/<provider_id>', methods=['GET'])
def get_provider(provider_id):
    """Get a specific service provider by ID"""
    try:
        provider = ServiceProvider.query.get(provider_id)
        if not provider:
            return jsonify({
                'success': False,
                'error': 'Service provider not found'
            }), 404
            
        return jsonify({
            'success': True,
            'provider': provider.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@providers_bp.route('/', methods=['POST'])
def create_provider():
    """Create a new service provider profile"""
    try:
        data = request.get_json()
        
        # Generate ID if not provided
        if not data.get('id'):
            data['id'] = f"provider-{str(uuid.uuid4())[:8]}"
        
        # Create provider from data
        provider = ServiceProvider.from_dict(data)
        
        # Save to database
        db.session.add(provider)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'provider': provider.to_dict(),
            'message': 'Service provider created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@providers_bp.route('/<provider_id>', methods=['PUT'])
def update_provider(provider_id):
    """Update an existing service provider"""
    try:
        provider = ServiceProvider.query.get(provider_id)
        if not provider:
            return jsonify({
                'success': False,
                'error': 'Service provider not found'
            }), 404
        
        data = request.get_json()
        
        # Update provider fields
        for key, value in data.items():
            if hasattr(provider, key) and key != 'id':
                if key == 'experienceLevel' and value:
                    provider.experience_level = ExperienceLevel(value)
                elif key == 'status' and value:
                    provider.status = ServiceStatus(value)
                else:
                    snake_case_key = key.replace('Email', '_email').replace('Phone', '_phone')
                    setattr(provider, snake_case_key, value)
        
        provider.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'provider': provider.to_dict(),
            'message': 'Service provider updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@providers_bp.route('/<provider_id>', methods=['DELETE'])
def delete_provider(provider_id):
    """Delete a service provider"""
    try:
        provider = ServiceProvider.query.get(provider_id)
        if not provider:
            return jsonify({
                'success': False,
                'error': 'Service provider not found'
            }), 404
        
        db.session.delete(provider)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service provider deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@providers_bp.route('/stats', methods=['GET'])
def get_provider_stats():
    """Get service provider statistics"""
    try:
        total_providers = ServiceProvider.query.count()
        available_providers = ServiceProvider.query.filter(ServiceProvider.status == ServiceStatus.AVAILABLE).count()
        
        # Providers by experience level
        experience_levels = {}
        for level in ExperienceLevel:
            count = ServiceProvider.query.filter(ServiceProvider.experience_level == level).count()
            experience_levels[level.value] = count
        
        # Average rating
        avg_rating = db.session.query(db.func.avg(ServiceProvider.rating)).scalar() or 0.0
        
        return jsonify({
            'success': True,
            'stats': {
                'total': total_providers,
                'available': available_providers,
                'by_experience': experience_levels,
                'average_rating': round(avg_rating, 2)
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
