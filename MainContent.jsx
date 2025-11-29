import React from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import JobCard from './JobCard.jsx';
import ServiceProviderCard from './ServiceProviderCard.jsx';
import { Briefcase, Users, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const MainContent = () => {
  const { 
    activeTab, 
    activeProgram,
    activeState,
    filteredJobs, 
    filteredServiceProviders,
    loading,
    actions: { deleteJob, deleteServiceProvider, setEditingJob, setEditingProvider, showJobForm, showProviderForm }
  } = useApp();

  const handleEditJob = (job) => {
    setEditingJob(job);
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
  };

  const EmptyState = ({ type }) => (
    <div className="text-center py-16">
      <div className="mb-6">
        {type === 'jobs' ? (
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto" />
        ) : (
          <Users className="h-16 w-16 text-gray-300 mx-auto" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No {type === 'jobs' ? 'jobs' : 'service providers'} found
      </h3>
      <p className="text-gray-500 mb-6">
        {type === 'jobs' 
          ? 'Be the first to post a job opportunity!' 
          : 'Be the first to join as a service provider!'
        }
      </p>
      <Button
        onClick={type === 'jobs' ? showJobForm : showProviderForm}
        className="btn-primary px-6 py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        {type === 'jobs' ? 'Post a Job' : 'Join as Provider'}
      </Button>
    </div>
  );

  const LoadingState = () => (
    <div className="flex justify-center items-center py-16">
      <div className="spinner"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === 'jobs' ? (
                <span className="flex items-center">
                  <Briefcase className="h-8 w-8 mr-3 text-[#002147]" />
                  Job Opportunities
                </span>
              ) : (
                <span className="flex items-center">
                  <Users className="h-8 w-8 mr-3 text-[#008080]" />
                  Service Providers
                </span>
              )}
            </h2>
            <p className="text-gray-600">
              {activeProgram === 'cheerleading' ? 'Cheerleading' : 'Dance/Pom'} 
              {activeState && ` in ${activeState}`}
              {activeTab === 'jobs' 
                ? ` • ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} available`
                : ` • ${filteredServiceProviders.length} provider${filteredServiceProviders.length !== 1 ? 's' : ''} available`
              }
            </p>
          </div>
          
          {/* Quick action button */}
          <Button
            onClick={activeTab === 'jobs' ? showJobForm : showProviderForm}
            className="btn-primary px-6 py-3 hidden sm:flex"
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === 'jobs' ? 'Post Job' : 'Join as Provider'}
          </Button>
        </div>

        {/* Results summary */}
        {(filteredJobs.length > 0 || filteredServiceProviders.length > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                Showing {activeTab === 'jobs' ? filteredJobs.length : filteredServiceProviders.length} result
                {(activeTab === 'jobs' ? filteredJobs.length : filteredServiceProviders.length) !== 1 ? 's' : ''}
                {activeProgram && (
                  <span> for {activeProgram === 'cheerleading' ? 'Cheerleading' : 'Dance/Pom'}</span>
                )}
                {activeState && <span> in {activeState}</span>}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content grid */}
      {activeTab === 'jobs' ? (
        filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={deleteJob}
                showActions={false} // Set to true if you want to show edit/delete buttons
              />
            ))}
          </div>
        ) : (
          <EmptyState type="jobs" />
        )
      ) : (
        filteredServiceProviders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServiceProviders.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                onEdit={handleEditProvider}
                onDelete={deleteServiceProvider}
                showActions={false} // Set to true if you want to show edit/delete buttons
              />
            ))}
          </div>
        ) : (
          <EmptyState type="providers" />
        )
      )}

      {/* Load more button (placeholder for pagination) */}
      {((activeTab === 'jobs' && filteredJobs.length > 0) || 
        (activeTab === 'providers' && filteredServiceProviders.length > 0)) && (
        <div className="text-center mt-12">
          <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-8 py-3">
            Load More Results
          </Button>
        </div>
      )}
    </main>
  );
};

export default MainContent;

