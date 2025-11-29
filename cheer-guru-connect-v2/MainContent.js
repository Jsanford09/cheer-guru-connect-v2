import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import JobCard from './JobCard';
import ProviderCard from './ProviderCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { Briefcase, Users, AlertCircle, RefreshCw } from 'lucide-react';

const MainContent = () => {
  const {
    activeTab,
    jobs,
    jobsLoading,
    jobsError,
    providers,
    providersLoading,
    providersError,
    backendAvailable,
    loadJobs,
    loadProviders,
    showJobForm,
    showProviderForm,
    searchQuery,
    selectedState,
    activeProgram
  } = useApp();

  // Load data when filters change
  useEffect(() => {
    if (backendAvailable) {
      if (activeTab === 'jobs') {
        loadJobs();
      } else {
        loadProviders();
      }
    }
  }, [activeTab, searchQuery, selectedState, activeProgram, backendAvailable]);

  // Handle job card click
  const handleJobClick = (job) => {
    showJobForm(job);
  };

  // Handle provider card click
  const handleProviderClick = (provider) => {
    showProviderForm(provider);
  };

  // Retry loading data
  const handleRetry = () => {
    if (activeTab === 'jobs') {
      loadJobs();
    } else {
      loadProviders();
    }
  };

  // Render error state
  const renderError = (error, type) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Failed to load {type}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {error.message || `There was an error loading ${type}. Please try again.`}
        </p>
        <div className="mt-6">
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );

  // Render offline state
  const renderOfflineState = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Backend Unavailable
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The backend service is currently unavailable. Running in offline mode with sample data.
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-oxford-blue hover:bg-oxford-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford-blue"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-6 h-6 text-teal" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Jobs matching "${searchQuery}"` : 'Available Positions'}
                </h2>
              </div>
              
              {jobs.length > 0 && (
                <div className="text-sm text-gray-500">
                  {jobs.length} position{jobs.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>

            {/* Content */}
            {!backendAvailable ? (
              renderOfflineState()
            ) : jobsError ? (
              renderError(jobsError, 'jobs')
            ) : jobsLoading ? (
              <LoadingSpinner message="Loading jobs..." />
            ) : jobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No jobs found"
                description={
                  searchQuery || selectedState !== 'all' || activeProgram !== 'all'
                    ? "Try adjusting your search criteria or filters."
                    : "Be the first to post a job opportunity!"
                }
                actionLabel="Post a Job"
                onAction={() => showJobForm()}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={handleJobClick}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-teal" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Providers matching "${searchQuery}"` : 'Service Providers'}
                </h2>
              </div>
              
              {providers.length > 0 && (
                <div className="text-sm text-gray-500">
                  {providers.length} provider{providers.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>

            {/* Content */}
            {!backendAvailable ? (
              renderOfflineState()
            ) : providersError ? (
              renderError(providersError, 'providers')
            ) : providersLoading ? (
              <LoadingSpinner message="Loading providers..." />
            ) : providers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No providers found"
                description={
                  searchQuery || selectedState !== 'all'
                    ? "Try adjusting your search criteria or filters."
                    : "Be the first to join as a service provider!"
                }
                actionLabel="Join as Provider"
                onAction={() => showProviderForm()}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onClick={handleProviderClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default MainContent;
