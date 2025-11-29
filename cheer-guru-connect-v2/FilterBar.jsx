import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { US_STATES, JobType, ExperienceLevel } from '../types/index.js';
import { Search, Filter, X, MapPin } from 'lucide-react';

const FilterBar = () => {
  const { 
    filters, 
    activeTab, 
    activeState,
    actions: { updateFilter, clearFilters, setActiveState } 
  } = useApp();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('searchTerm', searchTerm);
  };

  const handleStateChange = (state) => {
    setActiveState(state);
  };

  const clearAllFilters = () => {
    clearFilters();
    setActiveState('');
    setSearchTerm('');
  };

  const hasActiveFilters = filters.searchTerm || filters.type || filters.experienceLevel || activeState;

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        {/* Search bar and main controls */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'jobs' ? 'jobs' : 'service providers'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all duration-300"
              />
            </div>
          </form>

          {/* State selector */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <select
              value={activeState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#008080] focus:border-transparent bg-white"
            >
              <option value="">All States</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Filter toggle */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              showFilters || hasActiveFilters
                ? 'bg-[#008080] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-white text-[#008080] px-2 py-1 rounded-full text-xs font-bold">
                Active
              </span>
            )}
          </Button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Job type filter (for jobs tab) */}
              {activeTab === 'jobs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value={JobType.COACHING}>Coaching</option>
                    <option value={JobType.CHOREOGRAPHY}>Choreography</option>
                    <option value={JobType.JUDGING}>Judging</option>
                    <option value={JobType.TRAINING}>Training</option>
                    <option value={JobType.CONSULTING}>Consulting</option>
                  </select>
                </div>
              )}

              {/* Experience level filter (for providers tab) */}
              {activeTab === 'providers' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel || ''}
                    onChange={(e) => updateFilter('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value={ExperienceLevel.BEGINNER}>Beginner</option>
                    <option value={ExperienceLevel.INTERMEDIATE}>Intermediate</option>
                    <option value={ExperienceLevel.ADVANCED}>Advanced</option>
                    <option value={ExperienceLevel.ELITE}>Elite</option>
                  </select>
                </div>
              )}

              {/* Additional filter placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008080] focus:border-transparent">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;

