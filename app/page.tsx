'use client'

import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'
import { 
  Thermometer, 
  Droplets, 
  Mountain, 
  Gauge, 
  ArrowUp,
  Wind
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WeatherPage() {
  const { conditions } = useEnvironmental()
  const { formatTemperature, formatAltitude } = useSettings()

  // Use client-side only rendering to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Loading conditions...</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Current Conditions</h1>

      {/* Main Weather Card */}
      <div className="bg-gray-800 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-4xl font-bold">
              {formatTemperature(conditions.temperature)}
            </div>
            <div className="text-gray-400 text-sm">
              Feels like {formatTemperature(conditions.temperature + 2)}
            </div>
          </div>
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Thermometer className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Detailed Conditions */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm text-gray-400">Temperature</div>
          </div>
          <div className="text-2xl font-bold">
            {formatTemperature(conditions.temperature)}
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Droplets className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm text-gray-400">Humidity</div>
          </div>
          <div className="text-2xl font-bold">
            {conditions.humidity.toFixed(0)}%
          </div>
        </div>

        {/* Altitude */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Mountain className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm text-gray-400">Altitude</div>
          </div>
          <div className="text-2xl font-bold">
            {formatAltitude(conditions.altitude)}
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm text-gray-400">Pressure</div>
          </div>
          <div className="text-2xl font-bold">
            {conditions.pressure.toFixed(0)} hPa
          </div>
        </div>
      </div>

      {/* Air Density Info */}
      <div className="mt-4 bg-gray-800 rounded-xl p-4">
        <div className="text-sm text-gray-400 mb-1">Air Density</div>
        <div className="text-2xl font-bold">
          {conditions.airDensity.toFixed(3)} kg/m³
        </div>
        <div className="text-sm text-gray-400 mt-2">
          {conditions.airDensity > 1.225 
            ? 'Denser air will reduce shot distance'
            : 'Thinner air will increase shot distance'}
        </div>
      </div>
    </div>
  )
}
