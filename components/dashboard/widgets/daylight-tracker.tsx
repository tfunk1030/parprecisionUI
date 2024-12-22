'use client'

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DaylightInfo {
  sunrise: Date;
  sunset: Date;
  dayLength: number;
  isDaylight: boolean;
  timeUntilChange: string;
}

export default function DaylightTracker() {
  const [daylightInfo, setDaylightInfo] = useState<DaylightInfo>({
    sunrise: new Date(),
    sunset: new Date(),
    dayLength: 0,
    isDaylight: false,
    timeUntilChange: ''
  });

  useEffect(() => {
    const calculateDaylightInfo = () => {
      // This is a simplified calculation. For more accuracy, you'd want to use a library like SunCalc
      const now = new Date('2024-12-21T23:40:26-05:00');
      const winterSolstice = now.getMonth() === 11 && now.getDate() === 21;
      
      // Approximate sunrise and sunset times for winter solstice
      const sunrise = new Date(now);
      sunrise.setHours(7, 15, 0, 0); // Approximate winter solstice sunrise
      
      const sunset = new Date(now);
      sunset.setHours(16, 45, 0, 0); // Approximate winter solstice sunset
      
      const isDaylight = now >= sunrise && now <= sunset;
      const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60); // in hours
      
      // Calculate time until next change (sunrise or sunset)
      let timeUntil;
      if (isDaylight) {
        timeUntil = Math.max(0, sunset.getTime() - now.getTime());
      } else {
        const nextSunrise = new Date(sunrise);
        if (now > sunset) {
          nextSunrise.setDate(nextSunrise.getDate() + 1);
        }
        timeUntil = Math.max(0, nextSunrise.getTime() - now.getTime());
      }
      
      const hours = Math.floor(timeUntil / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
      const timeUntilChange = `${hours}h ${minutes}m`;

      return {
        sunrise,
        sunset,
        dayLength,
        isDaylight,
        timeUntilChange
      };
    };

    const updateDaylightInfo = () => {
      setDaylightInfo(calculateDaylightInfo());
    };

    // Initial calculation
    updateDaylightInfo();

    // Update every minute
    const interval = setInterval(updateDaylightInfo, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {daylightInfo.isDaylight ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400" />
          )}
          Daylight Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Sunrise className="h-5 w-5" />
              <span className="text-sm font-medium">Sunrise</span>
            </div>
            <span className="text-2xl font-bold">
              {daylightInfo.sunrise.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Sunset className="h-5 w-5" />
              <span className="text-sm font-medium">Sunset</span>
            </div>
            <span className="text-2xl font-bold">
              {daylightInfo.sunset.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Day Length</span>
            <span className="font-medium">{daylightInfo.dayLength.toFixed(1)} hours</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {daylightInfo.isDaylight ? 'Time until sunset' : 'Time until sunrise'}
            </span>
            <span className="font-medium">{daylightInfo.timeUntilChange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
