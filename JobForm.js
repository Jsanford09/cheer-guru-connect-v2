import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, Save, Briefcase } from 'lucide-react';

const JobForm = () => {
  const { 
    showJobForm, 
    hideJobForm, 
    selectedJob, 
    createJob, 
    updateJob 
  } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Coaching',
    program: 'Cheerleading',
    location: '',
    state: '',
    organization: '',
    requirements: '',
    compensation: '',
    contactEmail: '',
    contactPhone: '',
    deadline: '',
    status: 'Active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // US States
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Load selected job data when editing
  useEffect(() => {
    if (selectedJob) {
      setFormData({
        title: selectedJob.title || '',
        description: selectedJob.description || '',
        type: selectedJob.type || 'Coaching',
        program: selectedJob.program || 'Cheerleading',
        location: selectedJob.location || '',
        state: selectedJob.state || '',
        organization: selectedJob.organization || '',
        requirements: selectedJob.requirements || '',
        compensation: selectedJob.compensation || '',
        contactEmail: selectedJob.contactEmail || '',
        contactPhone: selectedJob.contactPhone || '',
        deadline: selectedJob.deadline ? selectedJob.deadline.split('T')[0] : '',
        status: selectedJob.status || 'Active'
      });
    } else {
      // Reset form for new job
      setFormData({
        title: '',
        description: '',
        type: 'Coaching',
        program: 'Cheerleading',
        location: '',
        state: '',
        organization: '',
        requirements: '',
        compensation: '',
        contactEmail: '',
        contactPhone: '',
        deadline: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [selectedJob]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.contactEmail && !formData.contactPhone) {
      newErrors.contactEmail = 'Either email or phone is required';
      newErrors.contactPhone = 'Either email or phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        postedDate: selectedJob ? selectedJob.postedDate : new Date().toISOString()
      };

      let result;
      if (selectedJob) {
        result = await updateJob(selectedJob.id, jobData);
      } else {
        result = await createJob(jobData);
      }

      if (result.success) {
        hideJobForm();
      } else {
        setErrors({ submit: result.error.message });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showJobForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-teal" />
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedJob ? 'Edit Job Posting' : 'Post New Job'}
            </h2>
          </div>
          <button
            onClick={hideJobForm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Head Cheerleading Coach"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School/Organization *
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="e.g., Lincoln High School"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                errors.organization ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
          </div>

          {/* Location and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Springfield"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.state ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>
          </div>

          {/* Job Type and Program */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="Coaching">Coaching</option>
                <option value="Choreography">Choreography</option>
                <option value="Judging">Judging</option>
                <option value="Training">Training</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Type
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="Cheerleading">Cheerleading</option>
                <option value="Dance/Pom">Dance/Pom</option>
              </select>
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
              onChange={handleChange}
              rows={4}
              placeholder="Describe the position, responsibilities, and what you're looking for..."
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              placeholder="List any specific requirements, qualifications, or experience needed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
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
                onChange={handleChange}
                placeholder="e.g., $2,500 stipend, Volunteer, $25/hour"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@school.edu"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Urgent">Urgent</option>
              <option value="Filled">Filled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={hideJobForm}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-teal border border-transparent rounded-md hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : selectedJob ? 'Update Job' : 'Post Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
