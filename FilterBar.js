import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Search, Filter, MapPin, X } from 'lucide-react';

const FilterBar = () => {
  const {
    activeTab,
    activeProgram,
    setActiveProgram,
    selectedState,
    setSelectedState,
    searchQuery,
    setSearchQuery,
    loadJobs,
    loadProviders
  } = useApp();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  // US States list
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Update local search when global search changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search input
  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
    if (activeTab === 'jobs') {
      loadJobs();
    } else {
      loadProviders();
    }
  };

  // Handle program filter change
  const handleProgramChange = (program) => {
    setActiveProgram(program);
    if (activeTab === 'jobs') {
      loadJobs();
    }
  };

  // Handle state filter change
  const handleStateChange = (state) => {
    setSelectedState(state);
    if (activeTab === 'jobs') {
      loadJobs();
    } else {
      loadProviders();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setActiveProgram('all');
    setSelectedState('all');
    if (activeTab === 'jobs') {
      loadJobs();
    } else {
      loadProviders();
    }
  };

  const hasActiveFilters = searchQuery || activeProgram !== 'all' || selectedState !== 'all';

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Search Bar */}
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={handleSearchChange}
                placeholder={
                  activeTab === 'jobs' 
                    ? "Search jobs by title, school, or location..." 
                    : "Search providers by name, services, or location..."
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
              />
              {localSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearchQuery('');
                    setSearchQuery('');
                    if (activeTab === 'jobs') {
                      loadJobs();
                    } else {
                      loadProviders();
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? 'bg-teal text-white border-teal'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-white text-teal px-2 py-1 rounded-full text-xs font-bold">
                {[searchQuery, activeProgram !== 'all', selectedState !== 'all'].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Program Filter - Only for jobs */}
              {activeTab === 'jobs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Type
                  </label>
                  <select
                    value={activeProgram}
                    onChange={(e) => handleProgramChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
                  >
                    <option value="all">All Programs</option>
                    <option value="cheerleading">Cheerleading</option>
                    <option value="dance-pom">Dance/Pom</option>
                  </select>
                </div>
              )}

              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent"
                >
                  <option value="all">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter - Only for jobs */}
              {activeTab === 'jobs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-transparent">
                    <option value="all">All Types</option>
                    <option value="coaching">Coaching</option>
                    <option value="choreography">Choreography</option>
                    <option value="judging">Judging</option>
                    <option value="training">Training</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>
              )}
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Quick filters:</span>
                
                {activeTab === 'jobs' && (
                  <>
                    <button
                      onClick={() => {
                        setLocalSearchQuery('head coach');
                        setSearchQuery('head coach');
                        loadJobs();
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      Head Coach
                    </button>
                    <button
                      onClick={() => {
                        setLocalSearchQuery('assistant coach');
                        setSearchQuery('assistant coach');
                        loadJobs();
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      Assistant Coach
                    </button>
                    <button
                      onClick={() => {
                        setLocalSearchQuery('choreographer');
                        setSearchQuery('choreographer');
                        loadJobs();
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      Choreographer
                    </button>
                  </>
                )}

                {activeTab === 'providers' && (
                  <>
                    <button
                      onClick={() => {
                        setLocalSearchQuery('choreography');
                        setSearchQuery('choreography');
                        loadProviders();
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      Choreography
                    </button>
                    <button
                      onClick={() => {
                        setLocalSearchQuery('training');
                        setSearchQuery('training');
                        loadProviders();
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      Training
                    </button>
                    <button
                      onClick={() => {
                        setLocalSearchQuery('judging');
                        setSearchQuery('judging');
                        loadProviders();
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    >
                      Judging
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
