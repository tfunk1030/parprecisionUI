'use client'

import React from 'react'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wind } from 'lucide-react'

interface WindCardProps {
  id: string
  title: string
  icon: React.ReactNode
}

const WindCard: React.FC<WindCardProps> = ({ id, title, icon }) => {
  const { conditions } = useEnvironmental()

  if (!conditions) {
    return (
      <Card className="bg-gray-800 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2">{icon}</div>
            <div className="text-2xl font-bold">--</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getValue = () => {
    switch (id) {
      case 'speed': {
        const speed = Math.abs(Math.round(conditions.windSpeed * 10) / 10)
        return `${speed} mph`
      }
      case 'direction': {
        const direction = Math.round(conditions.windDirection)
        const directionLabel = getWindDirectionLabel(direction)
        return `${directionLabel} (${direction}°)`
      }
      default:
        return '--'
    }
  }

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          <div className="text-2xl font-bold">{getValue()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(((degrees + 11.25) % 360) / 22.5)
  return directions[index]
}

export function WindWidget() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <WindCard
        id="speed"
        title="Wind Speed"
        icon={<Wind className="h-4 w-4 text-emerald-400" />}
      />
      <WindCard
        id="direction"
        title="Wind Direction"
        icon={<Wind className="h-4 w-4 text-emerald-400" />}
      />
    </div>
  )
}
