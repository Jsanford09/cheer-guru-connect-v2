import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { jobsAPI, providersAPI, scraperAPI, apiUtils } from '../services/api';

// Initial state
const initialState = {
  // Jobs data
  jobs: [],
  jobsLoading: false,
  jobsError: null,
  
  // Service providers data
  providers: [],
  providersLoading: false,
  providersError: null,
  
  // UI state
  activeTab: 'jobs', // 'jobs' or 'providers'
  activeProgram: 'all', // 'all', 'cheerleading', 'dance-pom'
  selectedState: 'all',
  searchQuery: '',
  
  // Modal states
  showJobForm: false,
  showProviderForm: false,
  selectedJob: null,
  selectedProvider: null,
  
  // Backend connection
  backendAvailable: false,
  backendChecking: true,
  
  // Scraper status
  scraperStatus: null,
  lastScrapingTime: null,
  
  // Statistics
  stats: {
    totalJobs: 0,
    totalProviders: 0,
    activeJobs: 0,
    newJobsToday: 0
  }
};

// Action types
const ActionTypes = {
  // Jobs actions
  SET_JOBS_LOADING: 'SET_JOBS_LOADING',
  SET_JOBS: 'SET_JOBS',
  SET_JOBS_ERROR: 'SET_JOBS_ERROR',
  ADD_JOB: 'ADD_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB',
  
  // Providers actions
  SET_PROVIDERS_LOADING: 'SET_PROVIDERS_LOADING',
  SET_PROVIDERS: 'SET_PROVIDERS',
  SET_PROVIDERS_ERROR: 'SET_PROVIDERS_ERROR',
  ADD_PROVIDER: 'ADD_PROVIDER',
  UPDATE_PROVIDER: 'UPDATE_PROVIDER',
  DELETE_PROVIDER: 'DELETE_PROVIDER',
  
  // UI actions
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_ACTIVE_PROGRAM: 'SET_ACTIVE_PROGRAM',
  SET_SELECTED_STATE: 'SET_SELECTED_STATE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  
  // Modal actions
  SHOW_JOB_FORM: 'SHOW_JOB_FORM',
  HIDE_JOB_FORM: 'HIDE_JOB_FORM',
  SHOW_PROVIDER_FORM: 'SHOW_PROVIDER_FORM',
  HIDE_PROVIDER_FORM: 'HIDE_PROVIDER_FORM',
  SET_SELECTED_JOB: 'SET_SELECTED_JOB',
  SET_SELECTED_PROVIDER: 'SET_SELECTED_PROVIDER',
  
  // Backend actions
  SET_BACKEND_STATUS: 'SET_BACKEND_STATUS',
  SET_SCRAPER_STATUS: 'SET_SCRAPER_STATUS',
  SET_STATS: 'SET_STATS'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_JOBS_LOADING:
      return { ...state, jobsLoading: action.payload, jobsError: null };
    
    case ActionTypes.SET_JOBS:
      return { 
        ...state, 
        jobs: action.payload, 
        jobsLoading: false, 
        jobsError: null 
      };
    
    case ActionTypes.SET_JOBS_ERROR:
      return { 
        ...state, 
        jobsError: action.payload, 
        jobsLoading: false 
      };
    
    case ActionTypes.ADD_JOB:
      return { 
        ...state, 
        jobs: [action.payload, ...state.jobs] 
      };
    
    case ActionTypes.UPDATE_JOB:
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? action.payload : job
        )
      };
    
    case ActionTypes.DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload)
      };
    
    case ActionTypes.SET_PROVIDERS_LOADING:
      return { ...state, providersLoading: action.payload, providersError: null };
    
    case ActionTypes.SET_PROVIDERS:
      return { 
        ...state, 
        providers: action.payload, 
        providersLoading: false, 
        providersError: null 
      };
    
    case ActionTypes.SET_PROVIDERS_ERROR:
      return { 
        ...state, 
        providersError: action.payload, 
        providersLoading: false 
      };
    
    case ActionTypes.ADD_PROVIDER:
      return { 
        ...state, 
        providers: [action.payload, ...state.providers] 
      };
    
    case ActionTypes.UPDATE_PROVIDER:
      return {
        ...state,
        providers: state.providers.map(provider => 
          provider.id === action.payload.id ? action.payload : provider
        )
      };
    
    case ActionTypes.DELETE_PROVIDER:
      return {
        ...state,
        providers: state.providers.filter(provider => provider.id !== action.payload)
      };
    
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case ActionTypes.SET_ACTIVE_PROGRAM:
      return { ...state, activeProgram: action.payload };
    
    case ActionTypes.SET_SELECTED_STATE:
      return { ...state, selectedState: action.payload };
    
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ActionTypes.SHOW_JOB_FORM:
      return { ...state, showJobForm: true, selectedJob: action.payload || null };
    
    case ActionTypes.HIDE_JOB_FORM:
      return { ...state, showJobForm: false, selectedJob: null };
    
    case ActionTypes.SHOW_PROVIDER_FORM:
      return { ...state, showProviderForm: true, selectedProvider: action.payload || null };
    
    case ActionTypes.HIDE_PROVIDER_FORM:
      return { ...state, showProviderForm: false, selectedProvider: null };
    
    case ActionTypes.SET_SELECTED_JOB:
      return { ...state, selectedJob: action.payload };
    
    case ActionTypes.SET_SELECTED_PROVIDER:
      return { ...state, selectedProvider: action.payload };
    
    case ActionTypes.SET_BACKEND_STATUS:
      return { 
        ...state, 
        backendAvailable: action.payload.available,
        backendChecking: false
      };
    
    case ActionTypes.SET_SCRAPER_STATUS:
      return { 
        ...state, 
        scraperStatus: action.payload.status,
        lastScrapingTime: action.payload.lastScrapingTime
      };
    
    case ActionTypes.SET_STATS:
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check backend availability on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Load initial data when backend becomes available
  useEffect(() => {
    if (state.backendAvailable) {
      loadJobs();
      loadProviders();
      loadStats();
      checkScraperStatus();
    }
  }, [state.backendAvailable]);

  // Backend health check
  const checkBackendHealth = async () => {
    try {
      const health = await apiUtils.checkHealth();
      dispatch({
        type: ActionTypes.SET_BACKEND_STATUS,
        payload: { available: health.available }
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_BACKEND_STATUS,
        payload: { available: false }
      });
    }
  };

  // Jobs actions
  const loadJobs = async (filters = {}) => {
    dispatch({ type: ActionTypes.SET_JOBS_LOADING, payload: true });
    
    try {
      const jobs = await jobsAPI.getJobs({
        program: state.activeProgram !== 'all' ? state.activeProgram : undefined,
        state: state.selectedState !== 'all' ? state.selectedState : undefined,
        search: state.searchQuery || undefined,
        ...filters
      });
      
      dispatch({ type: ActionTypes.SET_JOBS, payload: jobs });
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      dispatch({ type: ActionTypes.SET_JOBS_ERROR, payload: errorInfo });
    }
  };

  const createJob = async (jobData) => {
    try {
      const newJob = await jobsAPI.createJob(jobData);
      dispatch({ type: ActionTypes.ADD_JOB, payload: newJob });
      dispatch({ type: ActionTypes.HIDE_JOB_FORM });
      return { success: true, job: newJob };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  const updateJob = async (jobId, jobData) => {
    try {
      const updatedJob = await jobsAPI.updateJob(jobId, jobData);
      dispatch({ type: ActionTypes.UPDATE_JOB, payload: updatedJob });
      dispatch({ type: ActionTypes.HIDE_JOB_FORM });
      return { success: true, job: updatedJob };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await jobsAPI.deleteJob(jobId);
      dispatch({ type: ActionTypes.DELETE_JOB, payload: jobId });
      return { success: true };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  // Providers actions
  const loadProviders = async (filters = {}) => {
    dispatch({ type: ActionTypes.SET_PROVIDERS_LOADING, payload: true });
    
    try {
      const providers = await providersAPI.getProviders({
        state: state.selectedState !== 'all' ? state.selectedState : undefined,
        search: state.searchQuery || undefined,
        ...filters
      });
      
      dispatch({ type: ActionTypes.SET_PROVIDERS, payload: providers });
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      dispatch({ type: ActionTypes.SET_PROVIDERS_ERROR, payload: errorInfo });
    }
  };

  const createProvider = async (providerData) => {
    try {
      const newProvider = await providersAPI.createProvider(providerData);
      dispatch({ type: ActionTypes.ADD_PROVIDER, payload: newProvider });
      dispatch({ type: ActionTypes.HIDE_PROVIDER_FORM });
      return { success: true, provider: newProvider };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  const updateProvider = async (providerId, providerData) => {
    try {
      const updatedProvider = await providersAPI.updateProvider(providerId, providerData);
      dispatch({ type: ActionTypes.UPDATE_PROVIDER, payload: updatedProvider });
      dispatch({ type: ActionTypes.HIDE_PROVIDER_FORM });
      return { success: true, provider: updatedProvider };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  const deleteProvider = async (providerId) => {
    try {
      await providersAPI.deleteProvider(providerId);
      dispatch({ type: ActionTypes.DELETE_PROVIDER, payload: providerId });
      return { success: true };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  // UI actions
  const setActiveTab = (tab) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
  };

  const setActiveProgram = (program) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_PROGRAM, payload: program });
  };

  const setSelectedState = (state) => {
    dispatch({ type: ActionTypes.SET_SELECTED_STATE, payload: state });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
  };

  // Modal actions
  const showJobForm = (job = null) => {
    dispatch({ type: ActionTypes.SHOW_JOB_FORM, payload: job });
  };

  const hideJobForm = () => {
    dispatch({ type: ActionTypes.HIDE_JOB_FORM });
  };

  const showProviderForm = (provider = null) => {
    dispatch({ type: ActionTypes.SHOW_PROVIDER_FORM, payload: provider });
  };

  const hideProviderForm = () => {
    dispatch({ type: ActionTypes.HIDE_PROVIDER_FORM });
  };

  // Scraper actions
  const checkScraperStatus = async () => {
    try {
      const status = await scraperAPI.getStatus();
      dispatch({ 
        type: ActionTypes.SET_SCRAPER_STATUS, 
        payload: { 
          status: status.status,
          lastScrapingTime: status.lastScrapingTime
        }
      });
    } catch (error) {
      console.error('Failed to check scraper status:', error);
    }
  };

  const startScraping = async (sources = ['edjoin', 'k12jobspot']) => {
    try {
      const result = await scraperAPI.startScraping(sources);
      await checkScraperStatus();
      await loadJobs(); // Refresh jobs after scraping
      return { success: true, result };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  const testScraping = async (source = 'edjoin') => {
    try {
      const result = await scraperAPI.testScraping(source);
      return { success: true, result };
    } catch (error) {
      const errorInfo = apiUtils.handleError(error);
      return { success: false, error: errorInfo };
    }
  };

  // Statistics
  const loadStats = async () => {
    try {
      const stats = await jobsAPI.getJobStats();
      dispatch({ type: ActionTypes.SET_STATS, payload: stats });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Jobs actions
    loadJobs,
    createJob,
    updateJob,
    deleteJob,
    
    // Providers actions
    loadProviders,
    createProvider,
    updateProvider,
    deleteProvider,
    
    // UI actions
    setActiveTab,
    setActiveProgram,
    setSelectedState,
    setSearchQuery,
    
    // Modal actions
    showJobForm,
    hideJobForm,
    showProviderForm,
    hideProviderForm,
    
    // Backend actions
    checkBackendHealth,
    
    // Scraper actions
    checkScraperStatus,
    startScraping,
    testScraping,
    
    // Statistics
    loadStats
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
