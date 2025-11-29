import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { 
  MapPin, 
  Star, 
  Award, 
  Mail, 
  Phone, 
  Globe, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const ServiceProviderCard = ({ provider, onEdit, onDelete, showActions = false }) => {
  const getExperienceBadge = (level) => {
    const badges = {
      beginner: { color: 'bg-green-100 text-green-800', icon: '🌱' },
      intermediate: { color: 'bg-blue-100 text-blue-800', icon: '⭐' },
      advanced: { color: 'bg-purple-100 text-purple-800', icon: '🏆' },
      elite: { color: 'bg-yellow-100 text-yellow-800', icon: '👑' }
    };
    return badges[level] || badges.beginner;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-3 w-3" />;
      case 'busy': return <Clock className="h-3 w-3" />;
      case 'unavailable': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const experienceBadge = getExperienceBadge(provider.experienceLevel);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 card-hover overflow-hidden">
      {/* Header with gradient background */}
      <div className="gradient-secondary p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{provider.name}</h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${experienceBadge.color}`}>
                {experienceBadge.icon} {provider.experienceLevel.charAt(0).toUpperCase() + provider.experienceLevel.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(provider.status)}`}>
                {getStatusIcon(provider.status)}
                <span>{provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}</span>
              </span>
            </div>
            <div className="flex items-center text-white/90">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{provider.location}, {provider.state}</span>
            </div>
          </div>
          
          {/* Rating placeholder */}
          <div className="flex items-center space-x-1 text-yellow-300">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4" />
            <span className="text-white/90 text-sm ml-1">4.0</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Bio */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {provider.bio}
        </p>

        {/* Programs */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Programs:</h4>
          <div className="flex flex-wrap gap-2">
            {provider.programs.map((program, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  program === 'cheerleading' 
                    ? 'bg-[#002147] text-white' 
                    : 'bg-[#008080] text-white'
                }`}
              >
                {program === 'cheerleading' ? '🏆 Cheerleading' : '💃 Dance/Pom'}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {provider.specialties.slice(0, 4).map((specialty, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
            {provider.specialties.length > 4 && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                +{provider.specialties.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Services and rates */}
        {provider.services && provider.services.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Services:</h4>
            <div className="space-y-2">
              {provider.services.slice(0, 3).map((service, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{service.name}</span>
                  {service.rate && (
                    <span className="text-green-600 font-semibold flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {service.rate}
                    </span>
                  )}
                </div>
              ))}
              {provider.services.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{provider.services.length - 3} more services
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience and certifications */}
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {provider.experience && (
              <div>
                <span className="font-semibold text-gray-900">Experience:</span>
                <p className="text-gray-600">{provider.experience}</p>
              </div>
            )}
            {provider.certifications && provider.certifications.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Certifications:</span>
                <div className="flex items-center text-gray-600">
                  <Award className="h-3 w-3 mr-1" />
                  <span>{provider.certifications.length} certification{provider.certifications.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        {provider.availability && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Availability:</h4>
            <p className="text-sm text-gray-600">{provider.availability}</p>
          </div>
        )}

        {/* Contact information and actions */}
        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Contact info */}
            <div className="flex flex-col space-y-1 text-sm text-gray-600">
              {provider.contactEmail && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  <a 
                    href={`mailto:${provider.contactEmail}`}
                    className="text-[#008080] hover:underline"
                  >
                    {provider.contactEmail}
                  </a>
                </div>
              )}
              {provider.contactPhone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  <a 
                    href={`tel:${provider.contactPhone}`}
                    className="text-[#008080] hover:underline"
                  >
                    {provider.contactPhone}
                  </a>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center">
                  <Globe className="h-3 w-3 mr-2" />
                  <a 
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#008080] hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {provider.status === 'available' && (
                <Button className="btn-primary px-4 py-2 text-sm">
                  Contact Provider
                </Button>
              )}
              {showActions && (
                <>
                  <Button
                    onClick={() => onEdit(provider)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(provider.id)}
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

export default ServiceProviderCard;

