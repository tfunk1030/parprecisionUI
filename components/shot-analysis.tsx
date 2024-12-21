'use client'

import React from 'react'
import { Card } from './ui/card'

export default function ShotAnalysis() {
  const shotData = {
    conditions: {
      temperature: "72°F",
      humidity: "45%",
      pressure: "29.92 inHg",
      altitude: "850 ft",
      wind: {
        speed: "12 mph",
        direction: "NNE"
      }
    },
    shot: {
      intendedYardage: 150,
      adjustedYardage: 156,
      actualYardage: 153,
      suggestedClub: "7 Iron",
      alternateClub: "6 Iron",
      flightPath: {
        apex: "82 ft",
        landingAngle: "45°",
        carry: "148 yards",
        total: "153 yards"
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Shot Analysis</h2>
          
          {/* Conditions Section */}
          <div className="text-sm text-gray-400 space-y-1 mb-6">
            <p>Weather Conditions:</p>
            <p>{`Temp: ${shotData.conditions.temperature} | Humidity: ${shotData.conditions.humidity} | Pressure: ${shotData.conditions.pressure}`}</p>
            <p>{`Altitude: ${shotData.conditions.altitude} | Wind: ${shotData.conditions.wind.speed} ${shotData.conditions.wind.direction}`}</p>
          </div>

          {/* Shot Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-emerald-400 mb-2">Target</h3>
              <div className="text-lg">{shotData.shot.intendedYardage} yards</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-emerald-400 mb-2">Adjusted</h3>
              <div className="text-lg">{shotData.shot.adjustedYardage} yards</div>
            </div>
          </div>

          {/* Club Selection */}
          <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-emerald-400 mb-2">Suggested Clubs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Primary</div>
                <div className="text-lg">{shotData.shot.suggestedClub}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Alternative</div>
                <div className="text-lg">{shotData.shot.alternateClub}</div>
              </div>
            </div>
          </div>

          {/* Flight Data */}
          <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-emerald-400 mb-2">Flight Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Carry</div>
                <div>{shotData.shot.flightPath.carry}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Total</div>
                <div>{shotData.shot.flightPath.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Apex</div>
                <div>{shotData.shot.flightPath.apex}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Landing Angle</div>
                <div>{shotData.shot.flightPath.landingAngle}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
