import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  createFilterOptions, 
  filterJobs, 
  filterServiceProviders,
  JobStatus,
  ServiceStatus 
} from '../types/index.js';

// Initial state
const initialState = {
  jobs: [],
  serviceProviders: [],
  filters: createFilterOptions(),
  activeTab: 'jobs', // 'jobs' or 'providers'
  activeProgram: 'cheerleading', // 'cheerleading' or 'dance_pom'
  activeState: '', // selected state filter
  loading: false,
  error: null,
  showJobForm: false,
  showProviderForm: false,
  editingJob: null,
  editingProvider: null
};

// Action types
const ActionTypes = {
  SET_JOBS: 'SET_JOBS',
  ADD_JOB: 'ADD_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB',
  SET_SERVICE_PROVIDERS: 'SET_SERVICE_PROVIDERS',
  ADD_SERVICE_PROVIDER: 'ADD_SERVICE_PROVIDER',
  UPDATE_SERVICE_PROVIDER: 'UPDATE_SERVICE_PROVIDER',
  DELETE_SERVICE_PROVIDER: 'DELETE_SERVICE_PROVIDER',
  SET_FILTERS: 'SET_FILTERS',
  UPDATE_FILTER: 'UPDATE_FILTER',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_ACTIVE_PROGRAM: 'SET_ACTIVE_PROGRAM',
  SET_ACTIVE_STATE: 'SET_ACTIVE_STATE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SHOW_JOB_FORM: 'SHOW_JOB_FORM',
  HIDE_JOB_FORM: 'HIDE_JOB_FORM',
  SHOW_PROVIDER_FORM: 'SHOW_PROVIDER_FORM',
  HIDE_PROVIDER_FORM: 'HIDE_PROVIDER_FORM',
  SET_EDITING_JOB: 'SET_EDITING_JOB',
  SET_EDITING_PROVIDER: 'SET_EDITING_PROVIDER'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_JOBS:
      return { ...state, jobs: action.payload };
    
    case ActionTypes.ADD_JOB:
      return { ...state, jobs: [...state.jobs, action.payload] };
    
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
    
    case ActionTypes.SET_SERVICE_PROVIDERS:
      return { ...state, serviceProviders: action.payload };
    
    case ActionTypes.ADD_SERVICE_PROVIDER:
      return { 
        ...state, 
        serviceProviders: [...state.serviceProviders, action.payload] 
      };
    
    case ActionTypes.UPDATE_SERVICE_PROVIDER:
      return {
        ...state,
        serviceProviders: state.serviceProviders.map(provider => 
          provider.id === action.payload.id ? action.payload : provider
        )
      };
    
    case ActionTypes.DELETE_SERVICE_PROVIDER:
      return {
        ...state,
        serviceProviders: state.serviceProviders.filter(
          provider => provider.id !== action.payload
        )
      };
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: action.payload };
    
    case ActionTypes.UPDATE_FILTER:
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value }
      };
    
    case ActionTypes.CLEAR_FILTERS:
      return { ...state, filters: createFilterOptions() };
    
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case ActionTypes.SET_ACTIVE_PROGRAM:
      return { ...state, activeProgram: action.payload };
    
    case ActionTypes.SET_ACTIVE_STATE:
      return { ...state, activeState: action.payload };
    
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ActionTypes.SHOW_JOB_FORM:
      return { ...state, showJobForm: true, editingJob: null };
    
    case ActionTypes.HIDE_JOB_FORM:
      return { ...state, showJobForm: false, editingJob: null };
    
    case ActionTypes.SHOW_PROVIDER_FORM:
      return { ...state, showProviderForm: true, editingProvider: null };
    
    case ActionTypes.HIDE_PROVIDER_FORM:
      return { ...state, showProviderForm: false, editingProvider: null };
    
    case ActionTypes.SET_EDITING_JOB:
      return { 
        ...state, 
        editingJob: action.payload, 
        showJobForm: action.payload !== null 
      };
    
    case ActionTypes.SET_EDITING_PROVIDER:
      return { 
        ...state, 
        editingProvider: action.payload, 
        showProviderForm: action.payload !== null 
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Computed values
  const filteredJobs = React.useMemo(() => {
    let jobs = state.jobs;
    
    // Filter by program
    if (state.activeProgram) {
      jobs = jobs.filter(job => job.program === state.activeProgram);
    }
    
    // Filter by state
    if (state.activeState) {
      jobs = jobs.filter(job => job.state === state.activeState);
    }
    
    // Apply additional filters
    return filterJobs(jobs, state.filters);
  }, [state.jobs, state.activeProgram, state.activeState, state.filters]);

  const filteredServiceProviders = React.useMemo(() => {
    let providers = state.serviceProviders;
    
    // Filter by program
    if (state.activeProgram) {
      providers = providers.filter(provider => 
        provider.programs.includes(state.activeProgram)
      );
    }
    
    // Filter by state
    if (state.activeState) {
      providers = providers.filter(provider => provider.state === state.activeState);
    }
    
    // Apply additional filters
    return filterServiceProviders(providers, state.filters);
  }, [state.serviceProviders, state.activeProgram, state.activeState, state.filters]);

  // Action creators
  const actions = {
    // Job actions
    setJobs: (jobs) => dispatch({ type: ActionTypes.SET_JOBS, payload: jobs }),
    addJob: (job) => dispatch({ type: ActionTypes.ADD_JOB, payload: job }),
    updateJob: (job) => dispatch({ type: ActionTypes.UPDATE_JOB, payload: job }),
    deleteJob: (jobId) => dispatch({ type: ActionTypes.DELETE_JOB, payload: jobId }),
    
    // Service provider actions
    setServiceProviders: (providers) => 
      dispatch({ type: ActionTypes.SET_SERVICE_PROVIDERS, payload: providers }),
    addServiceProvider: (provider) => 
      dispatch({ type: ActionTypes.ADD_SERVICE_PROVIDER, payload: provider }),
    updateServiceProvider: (provider) => 
      dispatch({ type: ActionTypes.UPDATE_SERVICE_PROVIDER, payload: provider }),
    deleteServiceProvider: (providerId) => 
      dispatch({ type: ActionTypes.DELETE_SERVICE_PROVIDER, payload: providerId }),
    
    // Filter actions
    setFilters: (filters) => dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),
    updateFilter: (key, value) => 
      dispatch({ type: ActionTypes.UPDATE_FILTER, payload: { key, value } }),
    clearFilters: () => dispatch({ type: ActionTypes.CLEAR_FILTERS }),
    
    // Navigation actions
    setActiveTab: (tab) => dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab }),
    setActiveProgram: (program) => 
      dispatch({ type: ActionTypes.SET_ACTIVE_PROGRAM, payload: program }),
    setActiveState: (state) => 
      dispatch({ type: ActionTypes.SET_ACTIVE_STATE, payload: state }),
    
    // UI actions
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    showJobForm: () => dispatch({ type: ActionTypes.SHOW_JOB_FORM }),
    hideJobForm: () => dispatch({ type: ActionTypes.HIDE_JOB_FORM }),
    showProviderForm: () => dispatch({ type: ActionTypes.SHOW_PROVIDER_FORM }),
    hideProviderForm: () => dispatch({ type: ActionTypes.HIDE_PROVIDER_FORM }),
    setEditingJob: (job) => dispatch({ type: ActionTypes.SET_EDITING_JOB, payload: job }),
    setEditingProvider: (provider) => 
      dispatch({ type: ActionTypes.SET_EDITING_PROVIDER, payload: provider })
  };

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem('cheerGuruJobs');
      const savedProviders = localStorage.getItem('cheerGuruProviders');
      
      if (savedJobs) {
        actions.setJobs(JSON.parse(savedJobs));
      }
      
      if (savedProviders) {
        actions.setServiceProviders(JSON.parse(savedProviders));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('cheerGuruJobs', JSON.stringify(state.jobs));
    } catch (error) {
      console.error('Error saving jobs to localStorage:', error);
    }
  }, [state.jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('cheerGuruProviders', JSON.stringify(state.serviceProviders));
    } catch (error) {
      console.error('Error saving providers to localStorage:', error);
    }
  }, [state.serviceProviders]);

  const value = {
    ...state,
    filteredJobs,
    filteredServiceProviders,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

