import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, Save, Users } from 'lucide-react';

const ProviderForm = () => {
  const { 
    showProviderForm, 
    hideProviderForm, 
    selectedProvider, 
    createProvider, 
    updateProvider 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    services: [],
    experience: 'Intermediate',
    yearsExperience: '',
    location: '',
    state: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    status: 'Available'
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

  // Available services
  const availableServices = [
    'Coaching',
    'Choreography',
    'Judging',
    'Training',
    'Consulting',
    'Tumbling Instruction',
    'Stunt Training',
    'Dance Instruction',
    'Competition Prep',
    'Team Building',
    'Conditioning',
    'Private Lessons'
  ];

  // Load selected provider data when editing
  useEffect(() => {
    if (selectedProvider) {
      const services = Array.isArray(selectedProvider.services) 
        ? selectedProvider.services 
        : typeof selectedProvider.services === 'string' 
          ? selectedProvider.services.split(',').map(s => s.trim())
          : [];

      setFormData({
        name: selectedProvider.name || '',
        title: selectedProvider.title || '',
        bio: selectedProvider.bio || '',
        services: services,
        experience: selectedProvider.experience || 'Intermediate',
        yearsExperience: selectedProvider.yearsExperience || '',
        location: selectedProvider.location || '',
        state: selectedProvider.state || '',
        contactEmail: selectedProvider.contactEmail || '',
        contactPhone: selectedProvider.contactPhone || '',
        website: selectedProvider.website || '',
        status: selectedProvider.status || 'Available'
      });
    } else {
      // Reset form for new provider
      setFormData({
        name: '',
        title: '',
        bio: '',
        services: [],
        experience: 'Intermediate',
        yearsExperience: '',
        location: '',
        state: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        status: 'Available'
      });
    }
    setErrors({});
  }, [selectedProvider]);

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

  // Handle service selection
  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio/description is required';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.contactEmail && !formData.contactPhone) {
      newErrors.contactEmail = 'Either email or phone is required';
      newErrors.contactPhone = 'Either email or phone is required';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)';
    }

    if (formData.yearsExperience && (isNaN(formData.yearsExperience) || formData.yearsExperience < 0)) {
      newErrors.yearsExperience = 'Please enter a valid number of years';
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
      const providerData = {
        ...formData,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
        services: formData.services, // Keep as array
        createdAt: selectedProvider ? selectedProvider.createdAt : new Date().toISOString()
      };

      let result;
      if (selectedProvider) {
        result = await updateProvider(selectedProvider.id, providerData);
      } else {
        result = await createProvider(providerData);
      }

      if (result.success) {
        hideProviderForm();
      } else {
        setErrors({ submit: result.error.message });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showProviderForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-teal" />
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedProvider ? 'Edit Provider Profile' : 'Join as Service Provider'}
            </h2>
          </div>
          <button
            onClick={hideProviderForm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Sarah Johnson"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Certified Cheerleading Coach"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
              />
            </div>
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

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio/Description *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your experience, specialties, and what makes you unique..."
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                errors.bio ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Offered *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableServices.map(service => (
                <label key={service} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-teal focus:ring-teal"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
          </div>

          {/* Experience Level and Years */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                min="0"
                max="50"
                placeholder="e.g., 5"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.yearsExperience ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.yearsExperience && <p className="mt-1 text-sm text-red-600">{errors.yearsExperience}</p>}
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
                placeholder="your.email@example.com"
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

          {/* Website and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal focus:border-transparent ${
                  errors.website ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
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
              onClick={hideProviderForm}
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
              <span>{isSubmitting ? 'Saving...' : selectedProvider ? 'Update Profile' : 'Create Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderForm;
