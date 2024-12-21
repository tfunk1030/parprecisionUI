'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { 
  Wind, 
  Target, 
  BarChart2, 
  Activity,
  LineChart,
  Cloud,
  Mountain,
  Compass
} from 'lucide-react'

const Navigation = () => {
  const router = useRouter()
  const pathname = usePathname()

  const routes = [
    { path: '/', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/shot-analysis', label: 'Shot Analysis', icon: <Target className="w-5 h-5" /> },
    { path: '/weather', label: 'Weather', icon: <Cloud className="w-5 h-5" /> },
    { path: '/club-selection', label: 'Club Selection', icon: <Activity className="w-5 h-5" /> },
    { path: '/trajectory', label: 'Trajectory', icon: <LineChart className="w-5 h-5" /> },
    { path: '/wind-profile', label: 'Wind Profile', icon: <Wind className="w-5 h-5" /> },
    { path: '/shot-visualization', label: 'Shot View', icon: <Mountain className="w-5 h-5" /> },
    { path: '/flight-testing', label: 'Flight Test', icon: <Compass className="w-5 h-5" /> }
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-4">
      <div className="text-2xl font-bold text-emerald-400 mb-8">LastShot</div>
      <nav className="space-y-2">
        {routes.map((route) => (
          <Button
            key={route.path}
            variant={pathname === route.path ? 'secondary' : 'ghost'}
            className={`w-full justify-start gap-2 ${
              pathname === route.path 
                ? 'bg-gray-800 text-emerald-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => router.push(route.path)}
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </nav>
    </div>
  )
}

export default Navigation
