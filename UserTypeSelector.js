import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Briefcase, Users, Search, Plus } from 'lucide-react';

const UserTypeSelector = () => {
  const { activeTab, setActiveTab, showJobForm, showProviderForm } = useApp();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Question */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What brings you to Cheer Guru Connect?
          </h2>
          <p className="text-lg text-gray-600">
            Choose your path to get started with the right tools and opportunities
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Job Seeker Card */}
          <div 
            className={`card p-8 cursor-pointer transition-all ${
              activeTab === 'jobs' 
                ? 'border-teal bg-teal/5 shadow-lg' 
                : 'hover:border-teal/50 hover:shadow-md'
            }`}
            onClick={() => setActiveTab('jobs')}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                activeTab === 'jobs' ? 'bg-teal text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Search className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seeking Jobs?
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Find coaching, choreography, judging, and training opportunities at schools and organizations nationwide.
              </p>
              
              <div className="space-y-3 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Browse job listings</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Filter by location & type</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Connect with schools</span>
                </div>
              </div>
              
              {activeTab === 'jobs' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-teal font-medium mb-3">
                    Ready to explore opportunities?
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Scroll to job listings
                      document.getElementById('job-listings')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    className="btn btn-primary"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Employer/Provider Card */}
          <div 
            className={`card p-8 cursor-pointer transition-all ${
              activeTab === 'providers' 
                ? 'border-oxford-blue bg-oxford-blue/5 shadow-lg' 
                : 'hover:border-oxford-blue/50 hover:shadow-md'
            }`}
            onClick={() => setActiveTab('providers')}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                activeTab === 'providers' ? 'bg-oxford-blue text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Users className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seeking a Coach, Choreographer, or Judge?
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Post job openings or find qualified service providers to help your cheerleading or dance program succeed.
              </p>
              
              <div className="space-y-3 text-sm text-gray-500 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Post job openings</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Find service providers</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Manage applications</span>
                </div>
              </div>
              
              {activeTab === 'providers' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-oxford-blue font-medium mb-3">
                    Get started with your needs:
                  </p>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showJobForm();
                      }}
                      className="btn btn-primary bg-oxford-blue hover:bg-oxford-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post a Job
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Scroll to provider listings
                        document.getElementById('provider-listings')?.scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      }}
                      className="btn btn-secondary"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Providers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            New to Cheer Guru Connect? Both options are free to explore. 
            <span className="text-teal font-medium"> Join thousands of cheerleading professionals</span> already using our platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
