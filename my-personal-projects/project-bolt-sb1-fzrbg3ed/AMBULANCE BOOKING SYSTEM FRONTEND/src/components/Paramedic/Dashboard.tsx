import React from 'react';
import { MapPin, Clock, AlertTriangle, Phone, Navigation, CheckCircle } from 'lucide-react';
import type { EmergencyRequest, Ambulance } from '../../types';

interface ParamedicDashboardProps {
  requests: EmergencyRequest[];
  ambulance: Ambulance;
  onAcceptRequest: (requestId: string) => void;
  onUpdateStatus: (requestId: string, status: EmergencyRequest['status']) => void;
}

export const ParamedicDashboard: React.FC<ParamedicDashboardProps> = ({
  requests,
  ambulance,
  onAcceptRequest,
  onUpdateStatus
}) => {
  const availableRequests = requests.filter(req => req.status === 'requested');
  const assignedRequests = requests.filter(req => req.ambulance?.id === ambulance.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'urgent': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getStatusActions = (request: EmergencyRequest) => {
    switch (request.status) {
      case 'dispatched':
        return (
          <button
            onClick={() => onUpdateStatus(request.id, 'en-route')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Navigation className="w-4 h-4" />
            <span>En Route</span>
          </button>
        );
      case 'en-route':
        return (
          <button
            onClick={() => onUpdateStatus(request.id, 'arrived')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark Arrived</span>
          </button>
        );
      case 'arrived':
        return (
          <button
            onClick={() => onUpdateStatus(request.id, 'completed')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Paramedic Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Unit {ambulance.callSign}</h2>
            <p className="text-gray-600">{ambulance.paramedic} • {ambulance.driver}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                ambulance.status === 'available' ? 'bg-green-500' :
                ambulance.status === 'busy' ? 'bg-orange-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {ambulance.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <MapPin className="w-4 h-4 inline mr-1" />
              {ambulance.location.address}
            </div>
          </div>
        </div>
      </div>

      {/* Available Requests */}
      {availableRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Available Emergency Requests</h3>
            <p className="text-gray-600">New requests in your area</p>
          </div>
          <div className="p-6 space-y-4">
            {availableRequests.map((request) => (
              <div key={request.id} className={`border-2 rounded-lg p-4 ${getPriorityColor(request.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">{request.priority.toUpperCase()} Priority</span>
                      <Clock className="w-4 h-4 ml-4" />
                      <span className="text-sm">
                        {new Date(request.requestTime).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium">Patient</p>
                        <p className="text-sm">{request.patient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm">{request.location.address}</p>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{request.description}</p>

                    {request.patient.medicalConditions && (
                      <div className="text-sm">
                        <span className="font-medium">Medical Conditions: </span>
                        {request.patient.medicalConditions}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => onAcceptRequest(request.id)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Accept Call
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned Requests */}
      {assignedRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Active Calls</h3>
            <p className="text-gray-600">Requests assigned to your unit</p>
          </div>
          <div className="p-6 space-y-4">
            {assignedRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Status: {request.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Patient</p>
                        <p className="text-sm text-gray-900">{request.patient.name}</p>
                        <p className="text-xs text-gray-500">{request.patient.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-900">{request.location.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Time</p>
                        <p className="text-sm text-gray-900">
                          {new Date(request.requestTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{request.description}</p>

                    {(request.patient.medicalConditions || request.patient.allergies) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                        {request.patient.medicalConditions && (
                          <p><span className="font-medium">Conditions:</span> {request.patient.medicalConditions}</p>
                        )}
                        {request.patient.allergies && (
                          <p><span className="font-medium">Allergies:</span> {request.patient.allergies}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    {getStatusActions(request)}
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableRequests.length === 0 && assignedRequests.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear</h3>
          <p className="text-gray-600">No active emergency requests at this time</p>
        </div>
      )}
    </div>
  );
};