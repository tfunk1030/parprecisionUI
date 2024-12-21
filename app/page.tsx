'use client'

import SimpleWeatherDisplay from '@/components/simple-weather-display'

export default function Home() {
  return (
    <div className="flex flex-col p-3 space-y-3">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
            Last Shot
          </div>
          <div className="text-lg font-bold text-emerald-400">
            245<span className="text-xs ml-1">yds</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
            Average
          </div>
          <div className="text-lg font-bold text-emerald-400">
            238<span className="text-xs ml-1">yds</span>
          </div>
        </div>
      </div>

      {/* Weather Card */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">
          Current Weather
        </div>
        <SimpleWeatherDisplay />
      </div>

      {/* Recent Shots */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">
          Recent Shots
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <span className="text-emerald-400 text-sm">
                    {['D', '3W', '5i', '7i', 'PW'][i]}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {[245, 230, 185, 165, 140][i]}<span className="text-xs ml-1">yds</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {['2 mins', '15 mins', '1 hour', '2 hours', '3 hours'][i]} ago
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {['+2', '-5', '+1', '-3', '+4'][i]}<span className="ml-0.5">yds</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-emerald-500 text-white p-3 rounded-xl font-medium shadow-lg active:bg-emerald-600 transition-colors">
          New Shot
        </button>
        <button className="bg-gray-800 text-white p-3 rounded-xl font-medium shadow-lg active:bg-gray-700 transition-colors">
          View History
        </button>
      </div>
    </div>
  )
}
