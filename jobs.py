from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from datetime import datetime
import uuid

# These will be injected from app.py
db = None
Job = None
JobType = None
ProgramType = None
JobStatus = None

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET'])
def get_jobs():
    """Get all jobs with optional filtering"""
    try:
        # Get query parameters
        program = request.args.get('program')
        state = request.args.get('state')
        job_type = request.args.get('type')
        status = request.args.get('status')
        search = request.args.get('search')
        
        # Build query
        query = Job.query
        
        if program and program != 'all':
            query = query.filter(Job.program == ProgramType(program))
        
        if state and state != 'all':
            query = query.filter(Job.state == state)
            
        if job_type and job_type != 'all':
            query = query.filter(Job.type == JobType(job_type))
            
        if status and status != 'all':
            query = query.filter(Job.status == JobStatus(status))
            
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Job.title.ilike(search_term),
                    Job.description.ilike(search_term),
                    Job.organization.ilike(search_term),
                    Job.location.ilike(search_term)
                )
            )
        
        # Order by posted date (newest first)
        jobs = query.order_by(Job.posted_date.desc()).all()
        
        return jsonify({
            'success': True,
            'jobs': [job.to_dict() for job in jobs],
            'count': len(jobs)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    """Get a specific job by ID"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({
                'success': False,
                'error': 'Job not found'
            }), 404
            
        return jsonify({
            'success': True,
            'job': job.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@jobs_bp.route('/', methods=['POST'])
def create_job():
    """Create a new job posting"""
    try:
        data = request.get_json()
        
        # Generate ID if not provided
        if not data.get('id'):
            data['id'] = f"job-{str(uuid.uuid4())[:8]}"
        
        # Create job from data
        job = Job.from_dict(data)
        
        # Save to database
        db.session.add(job)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'job': job.to_dict(),
            'message': 'Job created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@jobs_bp.route('/<job_id>', methods=['PUT'])
def update_job(job_id):
    """Update an existing job"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({
                'success': False,
                'error': 'Job not found'
            }), 404
        
        data = request.get_json()
        
        # Update job fields
        for key, value in data.items():
            if hasattr(job, key) and key != 'id':
                if key == 'type' and value:
                    job.type = JobType(value)
                elif key == 'program' and value:
                    job.program = ProgramType(value)
                elif key == 'status' and value:
                    job.status = JobStatus(value)
                elif key in ['postedDate', 'deadline'] and value:
                    setattr(job, key.replace('Date', '_date').replace('line', 'line'), 
                           datetime.fromisoformat(value.replace('Z', '+00:00')))
                else:
                    setattr(job, key.replace('Email', '_email').replace('Phone', '_phone'), value)
        
        job.last_updated = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'job': job.to_dict(),
            'message': 'Job updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@jobs_bp.route('/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({
                'success': False,
                'error': 'Job not found'
            }), 404
        
        db.session.delete(job)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@jobs_bp.route('/stats', methods=['GET'])
def get_job_stats():
    """Get job statistics"""
    try:
        total_jobs = Job.query.count()
        active_jobs = Job.query.filter(Job.status == JobStatus.ACTIVE).count()
        
        # Jobs by program
        cheerleading_jobs = Job.query.filter(Job.program == ProgramType.CHEERLEADING).count()
        dance_jobs = Job.query.filter(Job.program == ProgramType.DANCE_POM).count()
        
        # Jobs by type
        job_types = {}
        for job_type in JobType:
            count = Job.query.filter(Job.type == job_type).count()
            job_types[job_type.value] = count
        
        return jsonify({
            'success': True,
            'stats': {
                'total': total_jobs,
                'active': active_jobs,
                'by_program': {
                    'Cheerleading': cheerleading_jobs,
                    'Dance/Pom': dance_jobs
                },
                'by_type': job_types
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
