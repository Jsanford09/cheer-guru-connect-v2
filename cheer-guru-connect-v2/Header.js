import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Users, Briefcase, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const Header = () => {
  const { 
    activeTab, 
    setActiveTab, 
    showJobForm, 
    showProviderForm,
    backendAvailable,
    backendChecking,
    scraperStatus,
    startScraping,
    stats
  } = useApp();

  const handleStartScraping = async () => {
    const result = await startScraping(['edjoin', 'k12jobspot']);
    if (result.success) {
      alert('Scraping started successfully!');
    } else {
      alert(`Scraping failed: ${result.error.message}`);
    }
  };

  return (
    <header className="bg-gradient-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Cheer Guru Connect</h1>
              <p className="text-white opacity-80 text-sm">National Cheerleading Jobs Board</p>
            </div>
          </div>

          {/* Backend Status Indicator */}
          <div className="flex items-center space-x-4">
            {backendChecking ? (
              <div className="flex items-center space-x-2 text-white opacity-80">
                <RefreshCw className="w-4 h-4 spinner" />
                <span className="text-sm">Connecting...</span>
              </div>
            ) : backendAvailable ? (
              <div className="flex items-center space-x-2 text-white opacity-90">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-white opacity-70">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Offline Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2 bg-white bg-opacity-10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-white text-oxford-blue shadow-lg'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Find Jobs</span>
              {stats.totalJobs > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'jobs' 
                    ? 'bg-oxford-blue text-white' 
                    : 'bg-white bg-opacity-20 text-white'
                }`}>
                  {stats.totalJobs}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('providers')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'providers'
                  ? 'bg-white text-oxford-blue shadow-lg'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Find Providers</span>
              {stats.totalProviders > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'providers' 
                    ? 'bg-oxford-blue text-white' 
                    : 'bg-white bg-opacity-20 text-white'
                }`}>
                  {stats.totalProviders}
                </span>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Scraping Controls */}
            {backendAvailable && (
              <button
                onClick={handleStartScraping}
                disabled={scraperStatus === 'running'}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20 disabled:bg-white disabled:bg-opacity-5 disabled:cursor-not-allowed text-white rounded-lg transition-all border border-white border-opacity-20"
              >
                <RefreshCw className={`w-4 h-4 ${scraperStatus === 'running' ? 'spinner' : ''}`} />
                <span className="text-sm">
                  {scraperStatus === 'running' ? 'Updating...' : 'Update Jobs'}
                </span>
              </button>
            )}

            {/* Primary Action Buttons */}
            {activeTab === 'jobs' ? (
              <button
                onClick={() => showJobForm()}
                className="btn btn-primary bg-white text-oxford-blue hover:bg-gray-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Post Job</span>
              </button>
            ) : (
              <button
                onClick={() => showProviderForm()}
                className="btn btn-primary bg-white text-oxford-blue hover:bg-gray-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Join as Provider</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        {(stats.totalJobs > 0 || stats.totalProviders > 0) && (
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-8 text-white opacity-80 text-sm">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>{stats.activeJobs || stats.totalJobs} Active Jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{stats.totalProviders} Service Providers</span>
              </div>
              {stats.newJobsToday > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{stats.newJobsToday} New Today</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Powered by footer */}
      <div className="bg-oxford-blue bg-opacity-20 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-center text-white opacity-60 text-xs">
            Powered by Cheer Guru Nation
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
