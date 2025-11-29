import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { 
  createServiceProvider, 
  validateServiceProvider, 
  generateId, 
  ProgramType, 
  ExperienceLevel,
  US_STATES 
} from '../types/index.js';
import { X, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';

const ServiceProviderForm = () => {
  const { 
    showProviderForm, 
    editingProvider,
    actions: { hideProviderForm, addServiceProvider, updateServiceProvider }
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialties: [],
    programs: [],
    experienceLevel: '',
    location: '',
    state: '',
    services: [],
    rates: '',
    availability: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    socialMedia: '',
    certifications: [],
    experience: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newService, setNewService] = useState({ name: '', rate: '' });
  const [newCertification, setNewCertification] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (editingProvider) {
      setFormData({
        name: editingProvider.name || '',
        bio: editingProvider.bio || '',
        specialties: editingProvider.specialties || [],
        programs: editingProvider.programs || [],
        experienceLevel: editingProvider.experienceLevel || '',
        location: editingProvider.location || '',
        state: editingProvider.state || '',
        services: editingProvider.services || [],
        rates: editingProvider.rates || '',
        availability: editingProvider.availability || '',
        contactEmail: editingProvider.contactEmail || '',
        contactPhone: editingProvider.contactPhone || '',
        website: editingProvider.website || '',
        socialMedia: editingProvider.socialMedia || '',
        certifications: editingProvider.certifications || [],
        experience: editingProvider.experience || ''
      });
    } else {
      // Reset form for new provider
      setFormData({
        name: '',
        bio: '',
        specialties: [],
        programs: [],
        experienceLevel: '',
        location: '',
        state: '',
        services: [],
        rates: '',
        availability: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        socialMedia: '',
        certifications: [],
        experience: ''
      });
    }
    setErrors({});
  }, [editingProvider, showProviderForm]);

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

  const handleProgramChange = (program) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.includes(program)
        ? prev.programs.filter(p => p !== program)
        : [...prev.programs, program]
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.name.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, name: newService.name.trim() }]
      }));
      setNewService({ name: '', rate: '' });
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const validation = validateServiceProvider(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingProvider) {
        // Update existing provider
        const updatedProvider = {
          ...editingProvider,
          ...formData
        };
        updateServiceProvider(updatedProvider);
      } else {
        // Create new provider
        const newProvider = createServiceProvider({
          id: generateId(),
          ...formData
        });
        addServiceProvider(newProvider);
      }

      // Close form and reset
      hideProviderForm();
      setFormData({
        name: '',
        bio: '',
        specialties: [],
        programs: [],
        experienceLevel: '',
        location: '',
        state: '',
        services: [],
        rates: '',
        availability: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        socialMedia: '',
        certifications: [],
        experience: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving provider:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showProviderForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="gradient-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {editingProvider ? 'Edit Provider Profile' : 'Join as Service Provider'}
            </h2>
            <Button
              onClick={hideProviderForm}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/90 mt-2">
            {editingProvider ? 'Update your service provider profile' : 'Create your professional profile to connect with teams and organizations'}
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

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                  errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select experience level</option>
                <option value={ExperienceLevel.BEGINNER}>Beginner</option>
                <option value={ExperienceLevel.INTERMEDIATE}>Intermediate</option>
                <option value={ExperienceLevel.ADVANCED}>Advanced</option>
                <option value={ExperienceLevel.ELITE}>Elite</option>
              </select>
              {errors.experienceLevel && <p className="text-red-600 text-sm mt-1">{errors.experienceLevel}</p>}
            </div>
          </div>

          {/* Location */}
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
                placeholder="City"
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

          {/* Programs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programs *
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.programs.includes(ProgramType.CHEERLEADING)}
                  onChange={() => handleProgramChange(ProgramType.CHEERLEADING)}
                  className="mr-2 h-4 w-4 text-[#008080] focus:ring-[#008080] border-gray-300 rounded"
                />
                <span className="text-gray-700">🏆 Cheerleading</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.programs.includes(ProgramType.DANCE_POM)}
                  onChange={() => handleProgramChange(ProgramType.DANCE_POM)}
                  className="mr-2 h-4 w-4 text-[#008080] focus:ring-[#008080] border-gray-300 rounded"
                />
                <span className="text-gray-700">💃 Dance/Pom</span>
              </label>
            </div>
            {errors.programs && <p className="text-red-600 text-sm mt-1">{errors.programs}</p>}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300 ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about your background, experience, and what makes you unique as a service provider..."
            />
            {errors.bio && <p className="text-red-600 text-sm mt-1">{errors.bio}</p>}
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-[#008080] text-white px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="ml-2 text-white hover:text-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                placeholder="e.g., Tumbling, Stunting, Choreography"
              />
              <Button
                type="button"
                onClick={addSpecialty}
                className="bg-[#008080] text-white px-4 py-2 rounded-lg hover:bg-[#20b2aa]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.specialties && <p className="text-red-600 text-sm mt-1">{errors.specialties}</p>}
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Offered
            </label>
            <div className="space-y-2 mb-3">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    {service.rate && <span className="text-gray-600 ml-2">- {service.rate}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                placeholder="Service name"
              />
              <input
                type="text"
                value={newService.rate}
                onChange={(e) => setNewService(prev => ({ ...prev, rate: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                placeholder="Rate (optional)"
              />
              <Button
                type="button"
                onClick={addService}
                className="bg-[#008080] text-white px-4 py-2 rounded-lg hover:bg-[#20b2aa]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>

          {/* Experience and Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
                placeholder="e.g., 5+ years coaching high school cheer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
                placeholder="e.g., Weekends, Evenings, Summer camps"
              />
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="ml-2 text-yellow-600 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                placeholder="e.g., USASF Safety Certification, CPR Certified"
              />
              <Button
                type="button"
                onClick={addCertification}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
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
                placeholder="your.email@example.com"
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

          {/* Website and Social Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media
              </label>
              <input
                type="text"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
                placeholder="@yourusername or social media links"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              onClick={hideProviderForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary px-6 py-3 rounded-lg flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner mr-2 w-4 h-4"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingProvider ? 'Update Profile' : 'Create Profile'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderForm;

