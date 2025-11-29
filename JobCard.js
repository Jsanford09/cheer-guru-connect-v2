import React from 'react';
import { MapPin, Calendar, DollarSign, Clock, ExternalLink, Building, Tag } from 'lucide-react';

const JobCard = ({ job, onClick }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'filled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get program type color
  const getProgramColor = (program) => {
    switch (program?.toLowerCase()) {
      case 'cheerleading':
        return 'bg-oxford-blue text-white';
      case 'dance/pom':
      case 'dance-pom':
        return 'bg-teal text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get job type icon and color
  const getJobTypeInfo = (type) => {
    switch (type?.toLowerCase()) {
      case 'coaching':
        return { icon: '🏆', color: 'bg-blue-50 text-blue-700' };
      case 'choreography':
        return { icon: '💃', color: 'bg-purple-50 text-purple-700' };
      case 'judging':
        return { icon: '⚖️', color: 'bg-green-50 text-green-700' };
      case 'training':
        return { icon: '📚', color: 'bg-orange-50 text-orange-700' };
      case 'consulting':
        return { icon: '💼', color: 'bg-gray-50 text-gray-700' };
      default:
        return { icon: '🎯', color: 'bg-gray-50 text-gray-700' };
    }
  };

  const jobTypeInfo = getJobTypeInfo(job.type);

  return (
    <div 
      onClick={() => onClick && onClick(job)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-teal cursor-pointer group"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal transition-colors line-clamp-2">
              {job.title || 'Untitled Position'}
            </h3>
            {job.organization && (
              <div className="flex items-center mt-1 text-gray-600">
                <Building className="w-4 h-4 mr-1" />
                <span className="text-sm">{job.organization}</span>
              </div>
            )}
          </div>
          
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
            {job.status || 'Active'}
          </span>
        </div>

        {/* Program and Job Type Tags */}
        <div className="flex items-center space-x-2 mb-3">
          {job.program && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramColor(job.program)}`}>
              {job.program}
            </span>
          )}
          {job.type && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${jobTypeInfo.color}`}>
              <span className="mr-1">{jobTypeInfo.icon}</span>
              {job.type}
            </span>
          )}
        </div>

        {/* Location */}
        {job.location && (
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{job.location}</span>
          </div>
        )}

        {/* Description Preview */}
        {job.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Posted Date */}
            {job.postedDate && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Posted {formatDate(job.postedDate)}</span>
              </div>
            )}

            {/* Deadline */}
            {job.deadline && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Due {formatDate(job.deadline)}</span>
              </div>
            )}
          </div>

          {/* Compensation */}
          {job.compensation && (
            <div className="flex items-center text-green-600 font-medium">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{job.compensation}</span>
            </div>
          )}
        </div>

        {/* Source Attribution */}
        {job.sourceSite && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-400">
              <Tag className="w-3 h-3 mr-1" />
              <span>Source: {job.sourceSite}</span>
            </div>
            
            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center text-xs text-teal hover:text-oxford-blue transition-colors"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                <span>View Original</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-oxford-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
    </div>
  );
};

export default JobCard;
