import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { formatDate } from '../types/index.js';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building, 
  Mail, 
  Phone, 
  Edit, 
  Trash2,
  Clock,
  Star
} from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, showActions = false }) => {
  const getJobTypeIcon = (type) => {
    switch (type) {
      case 'coaching': return '🏆';
      case 'choreography': return '💃';
      case 'judging': return '⚖️';
      case 'training': return '🎯';
      case 'consulting': return '💼';
      default: return '📋';
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'coaching': return 'bg-blue-100 text-blue-800';
      case 'choreography': return 'bg-purple-100 text-purple-800';
      case 'judging': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-orange-100 text-orange-800';
      case 'consulting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgramBadge = (program) => {
    return program === 'cheerleading' 
      ? 'bg-[#002147] text-white' 
      : 'bg-[#008080] text-white';
  };

  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const isUrgent = job.deadline && new Date(job.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 card-hover overflow-hidden ${
      isExpired ? 'opacity-60' : ''
    }`}>
      {/* Header with job type and program */}
      <div className="gradient-primary p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getJobTypeIcon(job.type)}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeColor(job.type)}`}>
              {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProgramBadge(job.program)}`}>
            {job.program === 'cheerleading' ? 'Cheerleading' : 'Dance/Pom'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Title and organization */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building className="h-4 w-4 mr-2" />
            <span className="font-semibold">{job.organization}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.location}, {job.state}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{job.requirements}</p>
          </div>
        )}

        {/* Compensation */}
        {job.compensation && (
          <div className="flex items-center text-green-600 mb-4">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-semibold">{job.compensation}</span>
          </div>
        )}

        {/* Dates and urgency */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Posted {formatDate(job.postedDate)}</span>
          </div>
          {job.deadline && (
            <div className={`flex items-center ${isUrgent ? 'text-red-600' : ''}`}>
              <Clock className="h-4 w-4 mr-1" />
              <span>Deadline {formatDate(job.deadline)}</span>
              {isUrgent && !isExpired && (
                <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                  Urgent
                </span>
              )}
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {job.status === 'filled' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                Position Filled
              </span>
            )}
            {isExpired && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                Expired
              </span>
            )}
            {job.status === 'active' && !isExpired && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Contact information and actions */}
        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Contact info */}
            <div className="flex flex-col space-y-1 text-sm text-gray-600">
              {job.contactEmail && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  <a 
                    href={`mailto:${job.contactEmail}`}
                    className="text-[#008080] hover:underline"
                  >
                    {job.contactEmail}
                  </a>
                </div>
              )}
              {job.contactPhone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  <a 
                    href={`tel:${job.contactPhone}`}
                    className="text-[#008080] hover:underline"
                  >
                    {job.contactPhone}
                  </a>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {!isExpired && job.status === 'active' && (
                <Button className="btn-primary px-4 py-2 text-sm">
                  Apply Now
                </Button>
              )}
              {showActions && (
                <>
                  <Button
                    onClick={() => onEdit(job)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(job.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

