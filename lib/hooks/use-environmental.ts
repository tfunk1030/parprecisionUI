'use client'

import { useState, useEffect } from 'react'
import { EnvironmentalService, EnvironmentalConditions } from '../environmental-service'

interface Adjustments {
  distanceAdjustment: number
  trajectoryShift: number
  density: number
  altitude: number
  humidity: number
  temperature: number
  total: number
}

const DEFAULT_ADJUSTMENTS: Adjustments = {
  distanceAdjustment: 0,
  trajectoryShift: 0,
  density: 0,
  altitude: 0,
  humidity: 0,
  temperature: 0,
  total: 0
}

export function useEnvironmental() {
  const [conditions, setConditions] = useState<EnvironmentalConditions>(() => 
    EnvironmentalService.getInstance().getConditions()
  )

  useEffect(() => {
    const service = EnvironmentalService.getInstance()
    service.startMonitoring()
    const unsubscribe = service.subscribe(setConditions)
    return () => {
      unsubscribe()
      service.stopMonitoring()
    }
  }, [])

  const getAdjustments = (shotDirection: number = 0): Adjustments => {
    if (!conditions) return DEFAULT_ADJUSTMENTS

    const densityEffect = (conditions.airDensity - 1.225) * 100
    const altitudeEffect = conditions.altitude * 0.018
    const humidityEffect = (conditions.humidity - 50) * 0.02
    const temperatureEffect = (conditions.temperature - 20) * 0.1

    // Calculate wind effect on distance and trajectory
    const windAngleRad = (conditions.windDirection - shotDirection) * Math.PI / 180
    const headwindComponent = conditions.windSpeed * Math.cos(windAngleRad)
    const crosswindComponent = conditions.windSpeed * Math.sin(windAngleRad)

    const distanceAdjustment = -headwindComponent * 0.5 // Headwind reduces distance
    const trajectoryShift = crosswindComponent * 0.3 // Crosswind shifts trajectory

    return {
      distanceAdjustment,
      trajectoryShift,
      density: densityEffect,
      altitude: altitudeEffect,
      humidity: humidityEffect,
      temperature: temperatureEffect,
      total: densityEffect + altitudeEffect + humidityEffect + temperatureEffect
    }
  }

  const getRecommendations = () => {
    if (!conditions) return []

    const adjustments = getAdjustments()
    const recommendations: string[] = []

    if (Math.abs(adjustments.density) > 2) {
      recommendations.push(
        adjustments.density > 0
          ? "Dense air conditions - expect shorter shots"
          : "Thin air conditions - expect longer shots"
      )
    }

    if (Math.abs(adjustments.temperature) > 1) {
      recommendations.push(
        adjustments.temperature > 0
          ? "Warm conditions - ball may fly further"
          : "Cool conditions - ball may fly shorter"
      )
    }

    if (conditions.altitude > 500) {
      recommendations.push("Altitude will increase ball carry")
    }

    if (conditions.humidity > 70) {
      recommendations.push("High humidity - slightly longer carry expected")
    } else if (conditions.humidity < 30) {
      recommendations.push("Low humidity - slightly shorter carry expected")
    }

    if (conditions.windSpeed > 5) {
      recommendations.push(`Strong wind (${conditions.windSpeed.toFixed(1)} mph) - adjust aim and club selection`)
    }

    return recommendations
  }

  return {
    conditions,
    getAdjustments,
    getRecommendations
  }
}
