export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  emergencyContact: string;
  medicalConditions: string;
  allergies: string;
  medications: string;
}

export interface Ambulance {
  id: string;
  callSign: string;
  driver: string;
  paramedic: string;
  location: Location;
  status: 'available' | 'busy' | 'offline';
  eta?: number;
}

export interface EmergencyRequest {
  id: string;
  patient: Patient;
  location: Location;
  priority: 'critical' | 'urgent' | 'standard';
  description: string;
  status: 'requested' | 'dispatched' | 'en-route' | 'arrived' | 'completed';
  ambulance?: Ambulance;
  requestTime: Date;
  estimatedArrival?: Date;
}

export type UserRole = 'patient' | 'paramedic' | 'dispatcher';