'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type WidgetVariable = {
  id: string
  name: string
  enabled: boolean
  order: number
}

export type WidgetConfig = {
  id: string
  variables: WidgetVariable[]
}

type WidgetConfigs = {
  [widgetId: string]: WidgetConfig
}

interface WidgetConfigContextType {
  configs: WidgetConfigs
  updateConfig: (widgetId: string, config: WidgetConfig) => void
  getConfig: (widgetId: string) => WidgetConfig | undefined
}

const WidgetConfigContext = createContext<WidgetConfigContextType | null>(null)

const DEFAULT_CONFIGS: WidgetConfigs = {
  'environmental': {
    id: 'environmental',
    variables: [
      { id: 'temperature', name: 'Temperature', enabled: true, order: 0 },
      { id: 'humidity', name: 'Humidity', enabled: true, order: 1 },
      { id: 'pressure', name: 'Pressure', enabled: false, order: 2 },
      { id: 'altitude', name: 'Altitude', enabled: false, order: 3 },
      { id: 'dewPoint', name: 'Dew Point', enabled: false, order: 4 },
    ]
  },
  'wind': {
    id: 'wind',
    variables: [
      { id: 'speed', name: 'Wind Speed', enabled: true, order: 0 },
      { id: 'direction', name: 'Direction', enabled: true, order: 1 },
      { id: 'gusts', name: 'Gusts', enabled: false, order: 2 },
    ]
  },
  'shot-analysis': {
    id: 'shot-analysis',
    variables: [
      { id: 'carry', name: 'Carry Distance', enabled: true, order: 0 },
      { id: 'total', name: 'Total Distance', enabled: true, order: 1 },
      { id: 'apex', name: 'Apex Height', enabled: false, order: 2 },
      { id: 'launchAngle', name: 'Launch Angle', enabled: true, order: 3 },
      { id: 'ballSpeed', name: 'Ball Speed', enabled: true, order: 4 },
      { id: 'spinRate', name: 'Spin Rate', enabled: false, order: 5 },
      { id: 'smashFactor', name: 'Smash Factor', enabled: false, order: 6 },
    ]
  },
  'round-tracker': {
    id: 'round-tracker',
    variables: [
      { id: 'score', name: 'Score', enabled: true, order: 0 },
      { id: 'putts', name: 'Putts', enabled: true, order: 1 },
      { id: 'fir', name: 'Fairways Hit', enabled: false, order: 2 },
      { id: 'gir', name: 'Greens in Regulation', enabled: false, order: 3 },
      { id: 'penalties', name: 'Penalties', enabled: false, order: 4 },
    ]
  }
}

const STORAGE_KEY = 'widget-configs'

export function WidgetConfigProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<WidgetConfigs>(DEFAULT_CONFIGS)

  // Load saved configs on mount
  useEffect(() => {
    const savedConfigs = localStorage.getItem(STORAGE_KEY)
    if (savedConfigs) {
      try {
        const parsed = JSON.parse(savedConfigs)
        setConfigs(parsed)
      } catch (error) {
        console.error('Failed to parse saved widget configs:', error)
      }
    }
  }, [])

  const updateConfig = useCallback((widgetId: string, config: WidgetConfig) => {
    setConfigs(prev => {
      const newConfigs = {
        ...prev,
        [widgetId]: config
      }
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs))
      return newConfigs
    })
  }, [])

  const getConfig = useCallback((widgetId: string) => {
    return configs[widgetId]
  }, [configs])

  return (
    <WidgetConfigContext.Provider value={{ configs, updateConfig, getConfig }}>
      {children}
    </WidgetConfigContext.Provider>
  )
}

export function useWidgetConfig() {
  const context = useContext(WidgetConfigContext)
  if (!context) {
    throw new Error('useWidgetConfig must be used within a WidgetConfigProvider')
  }
  return context
}
