import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react';

const BackendStatus = () => {
  const { 
    backendAvailable, 
    backendChecking, 
    checkBackendHealth,
    scraperStatus,
    lastScrapingTime
  } = useApp();

  // Don't show anything if backend is available and working
  if (backendAvailable && !scraperStatus) {
    return null;
  }

  // Format last scraping time
  const formatLastScrapingTime = (timestamp) => {
    if (!timestamp) return 'Never';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Backend Connection Status */}
        {!backendAvailable && (
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {backendChecking ? (
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {backendChecking ? 'Connecting to backend...' : 'Backend Unavailable'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {backendChecking 
                      ? 'Checking connection status...'
                      : 'Running in offline mode with sample data. Some features may be limited.'
                    }
                  </p>
                </div>
              </div>

              {!backendChecking && (
                <button
                  onClick={checkBackendHealth}
                  className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scraper Status */}
        {backendAvailable && scraperStatus && (
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {scraperStatus === 'running' ? (
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                ) : scraperStatus === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {scraperStatus === 'running' && 'Updating job listings...'}
                    {scraperStatus === 'completed' && 'Job listings updated'}
                    {scraperStatus === 'idle' && 'Job scraper ready'}
                    {scraperStatus === 'error' && 'Job update failed'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last updated: {formatLastScrapingTime(lastScrapingTime)}
                  </p>
                </div>
              </div>

              {scraperStatus === 'completed' && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-300 rounded-md hover:bg-green-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Refresh to see new jobs</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendStatus;
