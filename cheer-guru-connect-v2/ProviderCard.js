import React from 'react';
import { MapPin, Star, Award, Phone, Mail, ExternalLink } from 'lucide-react';

const ProviderCard = ({ provider, onClick }) => {
  // Get experience level color
  const getExperienceColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Parse services array
  const services = Array.isArray(provider.services) 
    ? provider.services 
    : typeof provider.services === 'string' 
      ? provider.services.split(',').map(s => s.trim())
      : [];

  return (
    <div 
      onClick={() => onClick && onClick(provider)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-teal cursor-pointer group"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal transition-colors">
              {provider.name || 'Unnamed Provider'}
            </h3>
            {provider.title && (
              <p className="text-sm text-gray-600 mt-1">{provider.title}</p>
            )}
          </div>
          
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(provider.status)}`}>
            {provider.status || 'Available'}
          </span>
        </div>

        {/* Location */}
        {provider.location && (
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{provider.location}</span>
          </div>
        )}

        {/* Experience Level */}
        {provider.experience && (
          <div className="flex items-center mb-3">
            <Award className="w-4 h-4 mr-2 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getExperienceColor(provider.experience)}`}>
              {provider.experience} Level
            </span>
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-teal/10 text-teal text-xs rounded-full"
                >
                  {service}
                </span>
              ))}
              {services.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bio Preview */}
        {provider.bio && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {provider.bio}
          </p>
        )}

        {/* Rating */}
        {provider.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(provider.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {provider.rating.toFixed(1)}
            </span>
            {provider.reviewCount && (
              <span className="ml-1 text-sm text-gray-500">
                ({provider.reviewCount} reviews)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between">
          {/* Contact Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {provider.contactPhone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span className="truncate">{provider.contactPhone}</span>
              </div>
            )}
            {provider.contactEmail && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span className="truncate">{provider.contactEmail}</span>
              </div>
            )}
          </div>

          {/* Website Link */}
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-sm text-teal hover:text-oxford-blue transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              <span>Website</span>
            </a>
          )}
        </div>

        {/* Years of Experience */}
        {provider.yearsExperience && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {provider.yearsExperience} years of experience
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-oxford-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
    </div>
  );
};

export default ProviderCard;
