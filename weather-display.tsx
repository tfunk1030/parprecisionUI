import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Thermometer, Droplets, Mountain, ArrowUpRight } from 'lucide-react';

export default function WeatherDisplay({ onWeatherChange }) {
  const [weather, setWeather] = useState({
    temperature: 72,
    humidity: 60,
    windSpeed: 0,
    windDirection: 0,
    altitude: 0,
    pressure: 29.92
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const response = await window.fs.readFile('weather-api.js');
      const data = JSON.parse(new TextDecoder().decode(response));
      setWeather({
        temperature: data.temperature || weather.temperature,
        humidity: data.humidity || weather.humidity,
        windSpeed: data.windSpeed || weather.windSpeed,
        windDirection: data.windDirection || weather.windDirection,
        altitude: data.altitude || weather.altitude,
        pressure: data.pressure || weather.pressure
      });
      setLastUpdated(new Date());
      onWeatherChange?.(weather);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const WeatherCard = ({ icon: Icon, label, value, unit, color = 'blue' }) => (
    <div className={`bg-${color}-900/10 backdrop-blur-sm p-4 rounded-xl border border-${color}-900/20`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`text-${color}-400`} size={24} />
        <span className="text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">
        {value}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Weather Conditions</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <button
          onClick={fetchWeatherData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowUpRight size={18} />
          {isLoading ? 'Updating...' : 'Update Now'}
        </button>
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <WeatherCard
          icon={Thermometer}
          label="Temperature"
          value={weather.temperature}
          unit="°F"
          color="red"
        />
        
        <WeatherCard
          icon={Wind}
          label="Wind"
          value={`${weather.windSpeed} @ ${weather.windDirection}°`}
          unit="mph"
          color="blue"
        />
        
        <WeatherCard
          icon={Droplets}
          label="Humidity"
          value={weather.humidity}
          unit="%"
          color="green"
        />
        
        <WeatherCard
          icon={Mountain}
          label="Altitude"
          value={weather.altitude}
          unit="ft"
          color="purple"
        />
        
        <WeatherCard
          icon={Cloud}
          label="Pressure"
          value={weather.pressure}
          unit="inHg"
          color="indigo"
        />
      </div>

      {/* Shot Impact Panel */}
      <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Shot Impact Factors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Air Density',
              value: ((weather.pressure / 29.92) * (459.67 / (weather.temperature + 459.67))).toFixed(3),
              impact: 'Affects ball flight and distance'
            },
            {
              label: 'Wind Effect',
              value: `${Math.round(Math.cos(weather.windDirection * Math.PI / 180) * weather.windSpeed)} mph`,
              impact: 'Headwind/tailwind component'
            },
            {
              label: 'Altitude Effect',
              value: `${(weather.altitude / 1000 * 2).toFixed(1)}%`,
              impact: 'Distance increase per 1000ft'
            }
          ].map(factor => (
            <div key={factor.label} className="bg-black/30 rounded-lg p-3">
              <div className="text-gray-400 text-sm">{factor.label}</div>
              <div className="text-white font-bold mb-1">{factor.value}</div>
              <div className="text-xs text-gray-500">{factor.impact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
