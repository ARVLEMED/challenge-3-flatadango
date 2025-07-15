import React from 'react';
import { Heart, Phone, User } from 'lucide-react';

interface HeaderProps {
  currentRole: 'patient' | 'paramedic' | 'dispatcher';
  onRoleChange: (role: 'patient' | 'paramedic' | 'dispatcher') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediConnect</h1>
              <p className="text-xs text-gray-500">Emergency Response System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onRoleChange('patient')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentRole === 'patient'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => onRoleChange('paramedic')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentRole === 'paramedic'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Paramedic
              </button>
            </div>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency: 911</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};