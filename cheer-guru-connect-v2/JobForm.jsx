import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { 
  createJob, 
  validateJob, 
  generateId, 
  JobType, 
  ProgramType, 
  US_STATES 
} from '../types/index.js';
import { X, Save, AlertCircle } from 'lucide-react';

const JobForm = () => {
  const { 
    showJobForm, 
    editingJob,
    actions: { hideJobForm, addJob, updateJob }
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    program: '',
    location: '',
    state: '',
    organization: '',
    requirements: '',
    compensation: '',
    contactEmail: '',
    contactPhone: '',
    deadline: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        description: editingJob.description || '',
        type: editingJob.type || '',
        program: editingJob.program || '',
        location: editingJob.location || '',
        state: editingJob.state || '',
        organization: editingJob.organization || '',
        requirements: editingJob.requirements || '',
        compensation: editingJob.compensation || '',
        contactEmail: editingJob.contactEmail || '',
        contactPhone: editingJob.contactPhone || '',
        deadline: editingJob.deadline ? editingJob.deadline.split('T')[0] : ''
      });
    } else {
      // Reset form for new job
      setFormData({
        title: '',
        description: '',
        type: '',
        program: '',
        location: '',
        state: '',
        organization: '',
        requirements: '',
        compensation: '',
        contactEmail: '',
        contactPhone: '',
        deadline: ''
      });
    }
    setErrors({});
  }, [editingJob, showJobForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create job object for validation
    const jobData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
    };

    // Validate form
    const validation = validateJob(jobData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingJob) {
        // Update existing job
        const updatedJob = {
          ...editingJob,
          ...jobData
        };
        updateJob(updatedJob);
      } else {
        // Create new job
        const newJob = createJob({
          id: generateId(),
          ...jobData,
          postedDate: new Date().toISOString()
        });
        addJob(newJob);
      }

      // Close form and reset
      hideJobForm();
      setFormData({
        title: '',
        description: '',
        type: '',
        program: '',
        location: '',
        state: '',
        organization: '',
        requirements: '',
        compensation: '',
        contactEmail: '',
        contactPhone: '',
        deadline: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving job:', error);
      setErrors({ submit: 'Failed to save job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showJobForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="gradient-primary p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {editingJob ? 'Edit Job Posting' : 'Post a New Job'}
            </h2>
            <Button
              onClick={hideJobForm}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/90 mt-2">
            {editingJob ? 'Update your job posting details' : 'Fill out the details to post your job opportunity'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700">{errors.submit}</span>
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Head Cheerleading Coach"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Job Type and Program */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select job type</option>
                <option value={JobType.COACHING}>Coaching</option>
                <option value={JobType.CHOREOGRAPHY}>Choreography</option>
                <option value={JobType.JUDGING}>Judging</option>
                <option value={JobType.TRAINING}>Training</option>
                <option value={JobType.CONSULTING}>Consulting</option>
              </select>
              {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program *
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.program ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select program</option>
                <option value={ProgramType.CHEERLEADING}>Cheerleading</option>
                <option value={ProgramType.DANCE_POM}>Dance/Pom</option>
              </select>
              {errors.program && <p className="text-red-600 text-sm mt-1">{errors.program}</p>}
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization *
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                errors.organization ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Springfield High School"
            />
            {errors.organization && <p className="text-red-600 text-sm mt-1">{errors.organization}</p>}
          </div>

          {/* Location and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Springfield"
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select state</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the job responsibilities, expectations, and what makes this opportunity special..."
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
              placeholder="List the qualifications, experience, and skills required for this position..."
            />
          </div>

          {/* Compensation and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compensation
              </label>
              <input
                type="text"
                name="compensation"
                value={formData.compensation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
                placeholder="e.g., $50/hour, $5000/season, Volunteer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@organization.com"
              />
              {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              onClick={hideJobForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-3 rounded-lg flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner mr-2 w-4 h-4"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingJob ? 'Update Job' : 'Post Job'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;

