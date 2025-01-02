import { useState, useEffect, useMemo } from 'react';
import { WeatherData } from '../services/api';
import { physicsService, ShotResult, BasicShotParams } from '../services/physics-service';

export interface ClubSettings {
  type: string;
  loftAngle: number;
  distance: number;
}

export interface ShotCalculationResult {
  adjustedDistance: number;
  trajectory: number[][];
  apex: number;
  spinRate: number;
  flightTime: number;
}

export function useShotCalculation(
  weather: WeatherData,
  club: ClubSettings,
  distance: number
): ShotCalculationResult {
  const [result, setResult] = useState<ShotCalculationResult>({
    adjustedDistance: 0,
    trajectory: [],
    apex: 0,
    spinRate: 0,
    flightTime: 0,
  });

  const params: BasicShotParams = useMemo(
    () => ({
      distance,
      clubType: club.type,
      loftAngle: club.loftAngle,
      temperature: weather.temperature,
      pressure: weather.pressure,
      humidity: weather.humidity,
    }),
    [distance, club, weather]
  );

  useEffect(() => {
    let isMounted = true;

    const calculateShot = async () => {
      try {
        setResult(prev => ({ ...prev, isLoading: true, error: null }));
        const shotResult = await physicsService.calculateBasicShot(params);
        
        if (isMounted) {
          setResult({
            ...shotResult,
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

    calculateShot();

    return () => {
      isMounted = false;
    };
  }, [params]);

  return result;
} 