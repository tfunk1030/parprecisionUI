import { useState, useEffect, useMemo } from 'react';
import { WeatherData } from '../services/api';
import { physicsService, WindResult, WindParams } from '../services/physics-service';
import { ClubSettings } from './useShotCalculation';

export interface WindCalculationResult extends WindResult {
  isLoading: boolean;
  error: Error | null;
}

export function useWindCalculation(
  weather: WeatherData,
  club: ClubSettings,
  distance: number
): WindCalculationResult {
  const [result, setResult] = useState<WindCalculationResult>({
    isLoading: true,
    error: null,
    adjustedDistance: 0,
    trajectory: [],
    apex: 0,
    spinRate: 0,
    flightTime: 0,
    windEffect: {
      lateralOffset: 0,
      distanceEffect: 0,
      heightEffect: 0,
    },
  });

  const params: WindParams = useMemo(
    () => ({
      distance,
      clubType: club.type,
      loftAngle: club.loftAngle,
      temperature: weather.temperature,
      pressure: weather.pressure,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      windDirection: weather.windDirection,
    }),
    [distance, club, weather]
  );

  useEffect(() => {
    let isMounted = true;

    const calculateWind = async () => {
      try {
        setResult(prev => ({ ...prev, isLoading: true, error: null }));
        const windResult = await physicsService.calculateWindEffect(params);
        
        if (isMounted) {
          setResult({
            ...windResult,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setResult(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Unknown error occurred'),
          }));
        }
      }
    };

    calculateWind();

    return () => {
      isMounted = false;
    };
  }, [params]);

  return result;
} 