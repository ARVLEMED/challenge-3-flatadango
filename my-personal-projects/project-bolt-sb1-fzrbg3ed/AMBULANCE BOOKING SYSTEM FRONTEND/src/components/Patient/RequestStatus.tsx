import React from 'react';
import { Clock, MapPin, Phone, User, CheckCircle, Truck, Navigation } from 'lucide-react';
import type { EmergencyRequest } from '../../types';

interface RequestStatusProps {
  request: EmergencyRequest;
  onCancel: () => void;
}

export const RequestStatus: React.FC<RequestStatusProps> = ({ request, onCancel }) => {
  const getStatusInfo = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'requested':
        return {
          icon: Clock,
          color: 'text-orange-600 bg-orange-100',
          title: 'Request Submitted',
          description: 'Searching for available ambulance...'
        };
      case 'dispatched':
        return {
          icon: Truck,
          color: 'text-blue-600 bg-blue-100',
          title: 'Ambulance Dispatched',
          description: 'Ambulance has been assigned to your request'
        };
      case 'en-route':
        return {
          icon: Navigation,
          color: 'text-purple-600 bg-purple-100',
          title: 'En Route',
          description: 'Ambulance is on the way to your location'
        };
      case 'arrived':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          title: 'Arrived',
          description: 'Ambulance has arrived at your location'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          title: 'Completed',
          description: 'Emergency response completed'
        };
    }
  };

  const statusInfo = getStatusInfo(request.status);
  const StatusIcon = statusInfo.icon;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${statusInfo.color}`}>
            <StatusIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{statusInfo.title}</h2>
            <p className="text-gray-600 mt-1">{statusInfo.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Request submitted at {formatTime(request.requestTime)}
            </p>
          </div>
        </div>

        {request.estimatedArrival && request.status !== 'arrived' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                Estimated Arrival: {formatTime(request.estimatedArrival)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ambulance Information */}
      {request.ambulance && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Ambulance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Unit {request.ambulance.callSign}</p>
                <p className="text-sm text-gray-600">Ambulance ID</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{request.ambulance.paramedic}</p>
                <p className="text-sm text-gray-600">Lead Paramedic</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">+1 (555) 0123</p>
                <p className="text-sm text-gray-600">Direct Line</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{request.ambulance.location.address}</p>
                <p className="text-sm text-gray-600">Current Location</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-900">{request.patient.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-gray-900">{request.patient.phone}</p>
          </div>
          {request.patient.emergencyContact && (
            <div>
              <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
              <p className="text-gray-900">{request.patient.emergencyContact}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Priority</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              request.priority === 'critical' ? 'bg-red-100 text-red-800' :
              request.priority === 'urgent' ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {request.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {request.description && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900 mt-1">{request.description}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {request.status === 'requested' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel Request
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Call 911 Direct
            </button>
          </div>
        </div>
      )}
    </div>
  );
};