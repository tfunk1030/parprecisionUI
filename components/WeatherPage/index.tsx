import React, { useCallback, useEffect, useState } from 'react';
import { useWeather } from '../../hooks/useWeather';

interface WeatherPageProps {
  className?: string;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ className = '' }) => {
  const { data: weather, isLoading, error, refresh, timeUntilNextUpdate, lastUpdated } = useWeather();
  const [countdown, setCountdown] = useState<number>(0);

  // Update countdown timer
  useEffect(() => {
    if (!lastUpdated) return;

    const timer = setInterval(() => {
      setCountdown(timeUntilNextUpdate);
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdated, timeUntilNextUpdate]);

  const formatCountdown = useCallback((ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }, []);

  const getWindDirection = useCallback((degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }, []);

  if (isLoading) {
    return (
      <div className={`weather-page-loading ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`weather-page-error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Weather Data</h3>
          <p className="text-red-600 mt-2">{error.message}</p>
          <button
            onClick={() => refresh()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className={`weather-page ${className}`}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">Current Weather</h2>
            <div className="text-sm text-gray-500">
              Updates in: {formatCountdown(countdown)}
              <button
                onClick={() => refresh()}
                className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="weather-primary bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Temperature & Humidity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temperature</span>
                  <span className="text-2xl font-medium">{weather.temperature}°F</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Humidity</span>
                  <span className="text-2xl font-medium">{weather.humidity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pressure</span>
                  <span className="text-2xl font-medium">{weather.pressure} hPa</span>
                </div>
              </div>
            </div>

            <div className="weather-wind bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Wind Conditions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wind Speed</span>
                  <span className="text-2xl font-medium">{weather.windSpeed} mph</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Direction</span>
                  <span className="text-2xl font-medium">
                    {getWindDirection(weather.windDirection)} ({weather.windDirection}°)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Playing Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="condition-item">
                  <span className="text-gray-600">Density Altitude</span>
                  <span className="block text-lg font-medium">
                    {Math.round((weather.temperature - 59) * 120)} ft
                  </span>
                </div>
                <div className="condition-item">
                  <span className="text-gray-600">Ball Flight</span>
                  <span className="block text-lg font-medium">
                    {weather.humidity > 70 ? 'Heavy' : weather.humidity < 30 ? 'Light' : 'Normal'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated || Date.now()).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}; 