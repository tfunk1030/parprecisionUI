import React, { useMemo } from 'react';
import { WeatherData } from '../../services/api';
import { ClubSettings } from '../../hooks/useShotCalculation';
import { useWindCalculation } from '../../hooks/useWindCalculation';

interface WindCalculatorProps {
  weather: WeatherData;
  club: ClubSettings;
  distance: number;
  onResultChange?: (adjustedDistance: number) => void;
  className?: string;
}

export const WindCalculator: React.FC<WindCalculatorProps> = ({
  weather,
  club,
  distance,
  onResultChange,
  className = '',
}) => {
  const {
    isLoading,
    error,
    adjustedDistance,
    apex,
    spinRate,
    flightTime,
    windEffect,
  } = useWindCalculation(weather, club, distance);

  // Notify parent component of distance changes
  React.useEffect(() => {
    onResultChange?.(adjustedDistance);
  }, [adjustedDistance, onResultChange]);

  const formattedResults = useMemo(() => ({
    distance: `${Math.round(adjustedDistance)} yards`,
    height: `${Math.round(apex)} feet`,
    spin: `${Math.round(spinRate)} rpm`,
    time: `${flightTime.toFixed(1)} seconds`,
    lateral: `${Math.abs(Math.round(windEffect.lateralOffset))} yards ${windEffect.lateralOffset > 0 ? 'right' : 'left'}`,
    carry: `${Math.round(windEffect.distanceEffect)} yards ${windEffect.distanceEffect > 0 ? 'longer' : 'shorter'}`,
    height_effect: `${Math.abs(Math.round(windEffect.heightEffect))} feet ${windEffect.heightEffect > 0 ? 'higher' : 'lower'}`,
  }), [adjustedDistance, apex, spinRate, flightTime, windEffect]);

  if (isLoading) {
    return (
      <div className={`wind-calculator-loading ${className}`} data-testid="wind-calculator-loading">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`wind-calculator-error ${className}`} data-testid="wind-calculator-error">
        <div className="text-red-500">
          Error calculating wind effect: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`wind-calculator ${className}`} data-testid="wind-calculator">
      <div className="grid grid-cols-2 gap-4">
        <div className="wind-stats" data-testid="wind-stats">
          <h3 className="text-lg font-semibold mb-4">Wind Effects</h3>
          <div className="space-y-2">
            <div className="stat-item">
              <span className="font-medium">Lateral Movement:</span>
              <span className="ml-2" data-testid="lateral-movement">{formattedResults.lateral}</span>
            </div>
            <div className="stat-item">
              <span className="font-medium">Carry Effect:</span>
              <span className="ml-2" data-testid="carry-effect">{formattedResults.carry}</span>
            </div>
            <div className="stat-item">
              <span className="font-medium">Height Effect:</span>
              <span className="ml-2" data-testid="height-effect">{formattedResults.height_effect}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Shot Statistics</h3>
          <div className="space-y-2">
            <div className="stat-item">
              <span className="font-medium">Total Distance:</span>
              <span className="ml-2" data-testid="total-distance">{formattedResults.distance}</span>
            </div>
            <div className="stat-item">
              <span className="font-medium">Max Height:</span>
              <span className="ml-2" data-testid="max-height">{formattedResults.height}</span>
            </div>
            <div className="stat-item">
              <span className="font-medium">Flight Time:</span>
              <span className="ml-2" data-testid="flight-time">{formattedResults.time}</span>
            </div>
          </div>
        </div>
        
        <div className="wind-visualization" data-testid="wind-visualization">
          <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-testid="wind-conditions">
            <h4 className="text-sm font-medium text-blue-800">Wind Conditions</h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <span className="text-gray-600">Speed:</span>
                <span className="ml-2" data-testid="wind-speed">{weather.windSpeed} mph</span>
              </div>
              <div>
                <span className="text-gray-600">Direction:</span>
                <span className="ml-2" data-testid="wind-direction">{weather.windDirection}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-testid="environmental-factors">
        <h4 className="text-sm font-medium text-blue-800">Environmental Factors</h4>
        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
          <div>
            <span className="text-gray-600">Temperature:</span>
            <span className="ml-2" data-testid="temperature">{weather.temperature}°F</span>
          </div>
          <div>
            <span className="text-gray-600">Humidity:</span>
            <span className="ml-2" data-testid="humidity">{weather.humidity}%</span>
          </div>
          <div>
            <span className="text-gray-600">Pressure:</span>
            <span className="ml-2" data-testid="pressure">{weather.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
} 