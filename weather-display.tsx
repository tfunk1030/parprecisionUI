'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Wind, Thermometer, Droplets, Mountain, ArrowUpRight } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { api } from './services/api';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  altitude: number;
}

interface WeatherDisplayProps {
  onWeatherChange?: (weather: WeatherData) => void;
}

export default function WeatherDisplay({ onWeatherChange }: WeatherDisplayProps) {
  const [locationDenied, setLocationDenied] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  const { data: weatherData, isLoading, error, refresh, setLocation: setWeatherLocation } = useWeather();

  const weather = weatherData || {
    temperature: 72,
    humidity: 60,
    pressure: 29.92,
    windSpeed: 10,
    windDirection: 45,
    altitude: 0
  };

  const handleManualLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualLocation(event.target.value);
    setGeocodingError(null);
  };

  const fetchWeatherForManualLocation = useCallback(
    async (location: string) => {
      setIsGeocoding(true);
      setGeocodingError(null);
      const coordinates = await api.geocodeLocation(location);
      setIsGeocoding(false);

      if (coordinates) {
        setWeatherLocation(location);
      } else {
        setGeocodingError('Failed to geocode location. Please try again.');
      }
    },
    [setWeatherLocation]
  );

  useEffect(() => {
    if (error && error.message === 'Could not determine user location') {
      setLocationDenied(true);
    } else {
      setLocationDenied(false);
    }
  }, [error]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (manualLocation && manualLocation.length > 2) {
        fetchWeatherForManualLocation(manualLocation);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [manualLocation, fetchWeatherForManualLocation]);

  useEffect(() => {
    onWeatherChange?.(weather);
  }, [weather, onWeatherChange]);

  if (isLoading || isGeocoding) {
    return <div>Loading weather data...</div>;
  }

  if (locationDenied) {
    return (
      <div>
        <p>Weather data is not available without location access.</p>
        <div>
          <input
            type="text"
            placeholder="Enter city or zip code"
            value={manualLocation}
            onChange={handleManualLocationChange}
          />
          <button onClick={() => fetchWeatherForManualLocation(manualLocation)}>Search</button>
        </div>
        {geocodingError && <p className="error">{geocodingError}</p>}
      </div>
    );
  }
  if (error) {
    return <div>Error fetching weather data: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">Temperature</span>
          </div>
          <div className="text-3xl text-white font-bold">{weather.temperature}°F</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Humidity</span>
          </div>
          <div className="text-3xl text-white font-bold">{weather.humidity}%</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Wind Speed</span>
          </div>
          <div className="text-3xl text-white font-bold">{weather.windSpeed} mph</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">Wind Direction</span>
          </div>
          <div className="text-3xl text-white font-bold">{weather.windDirection}°</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Cloud className="w-4 h-4" />
            <span className="text-sm">Pressure</span>
          </div>
          <div className="text-3xl text-white font-bold">{weather.pressure} inHg</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Mountain className="w-4 h-4" />
            <span className="text-sm">Altitude</span>
          </div>
          <div className="text-3xl text-white font-bold">{weather.altitude} ft</div>
        </div>
      </div>
    </div>
  );
}
