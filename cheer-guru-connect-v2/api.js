import axios from 'axios';

// API base URL - will be configurable for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Jobs API
export const jobsAPI = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.program) params.append('program', filters.program);
    if (filters.type) params.append('type', filters.type);
    if (filters.state) params.append('state', filters.state);
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get a specific job by ID
  getJob: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create a new job posting
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update an existing job
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete a job
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // Get job statistics
  getJobStats: async () => {
    const response = await api.get('/jobs/stats');
    return response.data;
  }
};

// Service Providers API
export const providersAPI = {
  // Get all service providers with optional filters
  getProviders: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.services) params.append('services', filters.services);
    if (filters.experience) params.append('experience', filters.experience);
    if (filters.state) params.append('state', filters.state);
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    
    const response = await api.get(`/providers?${params.toString()}`);
    return response.data;
  },

  // Get a specific provider by ID
  getProvider: async (providerId) => {
    const response = await api.get(`/providers/${providerId}`);
    return response.data;
  },

  // Create a new service provider profile
  createProvider: async (providerData) => {
    const response = await api.post('/providers', providerData);
    return response.data;
  },

  // Update an existing provider
  updateProvider: async (providerId, providerData) => {
    const response = await api.put(`/providers/${providerId}`, providerData);
    return response.data;
  },

  // Delete a provider
  deleteProvider: async (providerId) => {
    const response = await api.delete(`/providers/${providerId}`);
    return response.data;
  }
};

// Scraper API
export const scraperAPI = {
  // Get scraper status
  getStatus: async () => {
    const response = await api.get('/scraper/status');
    return response.data;
  },

  // Start scraping jobs
  startScraping: async (sources = ['edjoin', 'k12jobspot']) => {
    const response = await api.post('/scraper/start', { sources });
    return response.data;
  },

  // Test scraping functionality
  testScraping: async (source = 'edjoin') => {
    const response = await api.post('/scraper/test', { source });
    return response.data;
  },

  // Get scraping history/logs
  getScrapingHistory: async () => {
    const response = await api.get('/scraper/history');
    return response.data;
  }
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      return {
        type: 'server_error',
        message,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        type: 'network_error',
        message: 'Unable to connect to server. Please check your internet connection.',
        error
      };
    } else {
      // Something else happened
      return {
        type: 'unknown_error',
        message: error.message || 'An unexpected error occurred',
        error
      };
    }
  },

  // Check if backend is available
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return { available: true, data: response.data };
    } catch (error) {
      return { available: false, error: apiUtils.handleError(error) };
    }
  }
};

export default api;
