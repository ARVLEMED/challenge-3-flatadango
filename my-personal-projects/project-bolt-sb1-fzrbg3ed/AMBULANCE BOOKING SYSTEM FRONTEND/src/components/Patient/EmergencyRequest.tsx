import React, { useState } from 'react';
import { MapPin, Clock, AlertTriangle, User, Phone, Heart } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import type { EmergencyRequest, Patient } from '../../types';

interface EmergencyRequestProps {
  onSubmit: (request: Omit<EmergencyRequest, 'id' | 'requestTime' | 'status'>) => void;
}

export const EmergencyRequest: React.FC<EmergencyRequestProps> = ({ onSubmit }) => {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const [priority, setPriority] = useState<'critical' | 'urgent' | 'standard'>('urgent');
  const [description, setDescription] = useState('');
  const [patient, setPatient] = useState<Patient>({
    id: '',
    name: '',
    phone: '',
    emergencyContact: '',
    medicalConditions: '',
    allergies: '',
    medications: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    onSubmit({
      patient: { ...patient, id: Date.now().toString() },
      location,
      priority,
      description
    });
  };

  const priorityColors = {
    critical: 'bg-red-100 border-red-300 text-red-800',
    urgent: 'bg-orange-100 border-orange-300 text-orange-800',
    standard: 'bg-blue-100 border-blue-300 text-blue-800'
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Emergency Ambulance</h2>
            <p className="text-gray-600">Fill out the form below to request immediate medical assistance</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Location Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Your Location</span>
          </div>
          {locationLoading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Getting your location...</span>
            </div>
          )}
          {locationError && (
            <div className="text-red-600 text-sm">
              Location error: {locationError}
            </div>
          )}
          {location && (
            <div className="text-sm text-gray-700">
              <p>{location.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Emergency Priority Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['critical', 'urgent', 'standard'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setPriority(level)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  priority === level
                    ? priorityColors[level]
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-medium capitalize">{level}</div>
                <div className="text-xs mt-1">
                  {level === 'critical' && 'Life threatening'}
                  {level === 'urgent' && 'Serious injury'}
                  {level === 'standard' && 'Medical transport'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description of Emergency
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please describe the medical emergency or situation..."
            required
          />
        </div>

        {/* Patient Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Patient Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={patient.phone}
                onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={patient.emergencyContact}
                onChange={(e) => setPatient({ ...patient, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Conditions
              </label>
              <input
                type="text"
                value={patient.medicalConditions}
                onChange={(e) => setPatient({ ...patient, medicalConditions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Diabetes, heart condition, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <input
                type="text"
                value={patient.allergies}
                onChange={(e) => setPatient({ ...patient, allergies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Penicillin, nuts, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Medications
              </label>
              <input
                type="text"
                value={patient.medications}
                onChange={(e) => setPatient({ ...patient, medications: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Current medications"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center pt-4">
          <button
            type="submit"
            disabled={!location || !patient.name || !patient.phone}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Heart className="w-5 h-5" />
            <span>Request Emergency Ambulance</span>
          </button>
        </div>
      </form>
    </div>
  );
};