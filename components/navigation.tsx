'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Wind, 
  Target, 
  BarChart2, 
  Activity,
  LineChart,
  Cloud,
  Mountain,
  Compass,
  Menu,
  X
} from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <>
      {/* Full Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Slide-out Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-4 transform transition-transform z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-emerald-400">LastShot</div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === route.path 
                  ? 'bg-gray-800 text-emerald-400' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="flex justify-around items-center px-2 py-2">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center px-3 py-2 text-gray-400 rounded-lg"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>

          {/* Quick Access Links */}
          <Link
            href="/shot-visualization"
            className={`flex flex-col items-center px-3 py-2 rounded-lg ${
              pathname === '/shot-visualization' ? 'text-emerald-400' : 'text-gray-400'
            }`}
          >
            <Mountain className="w-6 h-6" />
            <span className="text-xs mt-1">Shot</span>
          </Link>

          <Link
            href="/flight-testing"
            className={`flex flex-col items-center px-3 py-2 rounded-lg ${
              pathname === '/flight-testing' ? 'text-emerald-400' : 'text-gray-400'
            }`}
          >
            <Compass className="w-6 h-6" />
            <span className="text-xs mt-1">Testing</span>
          </Link>

          <Link
            href="/shot-analysis"
            className={`flex flex-col items-center px-3 py-2 rounded-lg ${
              pathname === '/shot-analysis' ? 'text-emerald-400' : 'text-gray-400'
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs mt-1">Analysis</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
