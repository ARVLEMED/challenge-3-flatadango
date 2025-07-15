import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { EmergencyRequest } from './components/Patient/EmergencyRequest';
import { RequestStatus } from './components/Patient/RequestStatus';
import { ParamedicDashboard } from './components/Paramedic/Dashboard';
import type { EmergencyRequest as EmergencyRequestType, Ambulance, UserRole } from './types';

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [requests, setRequests] = useState<EmergencyRequestType[]>([]);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequestType | null>(null);

  // Mock ambulance data
  const mockAmbulances: Ambulance[] = [
    {
      id: 'amb-001',
      callSign: 'A-101',
      driver: 'Mike Johnson',
      paramedic: 'Dr. Sarah Wilson',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York, NY'
      },
      status: 'available'
    },
    {
      id: 'amb-002',
      callSign: 'A-102',
      driver: 'Tom Brown',
      paramedic: 'Dr. Lisa Chen',
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: '456 Park Ave, New York, NY'
      },
      status: 'available'
    }
  ];

  const [currentAmbulance] = useState<Ambulance>(mockAmbulances[0]);

  const handleEmergencyRequest = (requestData: Omit<EmergencyRequestType, 'id' | 'requestTime' | 'status'>) => {
    const newRequest: EmergencyRequestType = {
      ...requestData,
      id: Date.now().toString(),
      requestTime: new Date(),
      status: 'requested'
    };

    setRequests(prev => [...prev, newRequest]);
    setActiveRequest(newRequest);

    // Auto-dispatch after 2 seconds for demo
    setTimeout(() => {
      const ambulance = mockAmbulances.find(amb => amb.status === 'available');
      if (ambulance) {
        const updatedRequest = {
          ...newRequest,
          status: 'dispatched' as const,
          ambulance,
          estimatedArrival: new Date(Date.now() + 15 * 60000) // 15 minutes from now
        };
        
        setRequests(prev => prev.map(req => 
          req.id === newRequest.id ? updatedRequest : req
        ));
        setActiveRequest(updatedRequest);
      }
    }, 2000);
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = requests.find(req => req.id === requestId);
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'dispatched' as const,
        ambulance: currentAmbulance,
        estimatedArrival: new Date(Date.now() + 15 * 60000)
      };

      setRequests(prev => prev.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
    }
  };

  const handleUpdateStatus = (requestId: string, status: EmergencyRequestType['status']) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status } : req
    ));

    if (activeRequest?.id === requestId) {
      setActiveRequest(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleCancelRequest = () => {
    if (activeRequest) {
      setRequests(prev => prev.filter(req => req.id !== activeRequest.id));
      setActiveRequest(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'patient' && (
          <>
            {!activeRequest ? (
              <EmergencyRequest onSubmit={handleEmergencyRequest} />
            ) : (
              <RequestStatus 
                request={activeRequest} 
                onCancel={handleCancelRequest}
              />
            )}
          </>
        )}

        {currentRole === 'paramedic' && (
          <ParamedicDashboard
            requests={requests}
            ambulance={currentAmbulance}
            onAcceptRequest={handleAcceptRequest}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Emergency Footer */}
      <footer className="bg-red-900 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">
                <strong>Emergency Services:</strong> For life-threatening emergencies, call 911 immediately
              </p>
            </div>
            <div className="text-sm">
              <p>24/7 Emergency Response • MediConnect System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;