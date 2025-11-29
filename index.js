// Type definitions for Cheer Guru Connect

// Enums for different categories
export const JobType = {
  COACHING: 'coaching',
  CHOREOGRAPHY: 'choreography',
  JUDGING: 'judging',
  TRAINING: 'training',
  CONSULTING: 'consulting'
};

export const ProgramType = {
  CHEERLEADING: 'cheerleading',
  DANCE_POM: 'dance_pom'
};

export const ExperienceLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  ELITE: 'elite'
};

export const JobStatus = {
  ACTIVE: 'active',
  FILLED: 'filled',
  EXPIRED: 'expired'
};

export const ServiceStatus = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  UNAVAILABLE: 'unavailable'
};

// US States for regional filtering
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Job listing data structure
export const createJob = ({
  id,
  title,
  description,
  type,
  program,
  location,
  state,
  organization,
  requirements,
  compensation,
  contactEmail,
  contactPhone,
  postedDate,
  deadline,
  status = JobStatus.ACTIVE
}) => ({
  id,
  title,
  description,
  type,
  program,
  location,
  state,
  organization,
  requirements,
  compensation,
  contactEmail,
  contactPhone,
  postedDate,
  deadline,
  status
});

// Service provider profile data structure
export const createServiceProvider = ({
  id,
  name,
  bio,
  specialties,
  programs,
  experienceLevel,
  location,
  state,
  services,
  rates,
  availability,
  contactEmail,
  contactPhone,
  website,
  socialMedia,
  certifications,
  experience,
  status = ServiceStatus.AVAILABLE
}) => ({
  id,
  name,
  bio,
  specialties,
  programs,
  experienceLevel,
  location,
  state,
  services,
  rates,
  availability,
  contactEmail,
  contactPhone,
  website,
  socialMedia,
  certifications,
  experience,
  status
});

// Filter options structure
export const createFilterOptions = () => ({
  program: '',
  state: '',
  type: '',
  experienceLevel: '',
  searchTerm: ''
});

// Form validation helpers
export const validateJob = (job) => {
  const errors = {};
  
  if (!job.title?.trim()) errors.title = 'Title is required';
  if (!job.description?.trim()) errors.description = 'Description is required';
  if (!job.type) errors.type = 'Job type is required';
  if (!job.program) errors.program = 'Program type is required';
  if (!job.location?.trim()) errors.location = 'Location is required';
  if (!job.state) errors.state = 'State is required';
  if (!job.organization?.trim()) errors.organization = 'Organization is required';
  if (!job.contactEmail?.trim()) errors.contactEmail = 'Contact email is required';
  if (job.contactEmail && !/\S+@\S+\.\S+/.test(job.contactEmail)) {
    errors.contactEmail = 'Valid email is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateServiceProvider = (provider) => {
  const errors = {};
  
  if (!provider.name?.trim()) errors.name = 'Name is required';
  if (!provider.bio?.trim()) errors.bio = 'Bio is required';
  if (!provider.specialties?.length) errors.specialties = 'At least one specialty is required';
  if (!provider.programs?.length) errors.programs = 'At least one program is required';
  if (!provider.location?.trim()) errors.location = 'Location is required';
  if (!provider.state) errors.state = 'State is required';
  if (!provider.contactEmail?.trim()) errors.contactEmail = 'Contact email is required';
  if (provider.contactEmail && !/\S+@\S+\.\S+/.test(provider.contactEmail)) {
    errors.contactEmail = 'Valid email is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const filterJobs = (jobs, filters) => {
  return jobs.filter(job => {
    const matchesProgram = !filters.program || job.program === filters.program;
    const matchesState = !filters.state || job.state === filters.state;
    const matchesType = !filters.type || job.type === filters.type;
    const matchesSearch = !filters.searchTerm || 
      job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.organization.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesProgram && matchesState && matchesType && matchesSearch;
  });
};

export const filterServiceProviders = (providers, filters) => {
  return providers.filter(provider => {
    const matchesProgram = !filters.program || provider.programs.includes(filters.program);
    const matchesState = !filters.state || provider.state === filters.state;
    const matchesExperience = !filters.experienceLevel || provider.experienceLevel === filters.experienceLevel;
    const matchesSearch = !filters.searchTerm || 
      provider.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      provider.bio.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      provider.specialties.some(specialty => 
        specialty.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    
    return matchesProgram && matchesState && matchesExperience && matchesSearch;
  });
};

