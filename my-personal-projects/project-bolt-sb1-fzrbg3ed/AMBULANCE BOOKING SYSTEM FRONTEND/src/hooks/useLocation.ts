import { useState, useEffect } from 'react';
import type { Location } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simulate reverse geocoding for demo
        const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setLocation({
          lat: latitude,
          lng: longitude,
          address: address
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, loading, error, refetch: getCurrentLocation };
};