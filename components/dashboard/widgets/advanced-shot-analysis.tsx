import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShotAnalyzer, type ShotData } from '@/lib/shot-analysis';
import { usePresets } from '@/lib/preset-context';

interface PerformanceMetric {
  name: string;
  actual: number;
  expected: number;
  trend: number;
}

export function AdvancedShotAnalysisWidget() {
  const { activePreset } = usePresets();
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'today' | 'week' | 'month'>('week');
  const [selectedMetric, setSelectedMetric] = React.useState<'distance' | 'accuracy' | 'consistency'>('consistency');

  // Example data - in real implementation, this would come from your data store
  const recentShots: ShotData[] = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      distance: activePreset ? activePreset.distance + (Math.random() * 20 - 10) : 250,
      height: activePreset ? activePreset.height + (Math.random() * 5 - 2.5) : 30,
      spin: activePreset ? activePreset.spin + (Math.random() * 500 - 250) : 2500,
      launchAngle: activePreset ? activePreset.launchAngle + (Math.random() * 2 - 1) : 10.5,
      timestamp: Date.now() - (i * 3600000) // Last 20 hours
    }));
  }, [activePreset]);

  const performanceMetrics: PerformanceMetric[] = React.useMemo(() => {
    const analysis = ShotAnalyzer.analyzeShotPattern(recentShots);
    const trends = ShotAnalyzer.analyzeTrends(recentShots);

    return [
      {
        name: 'Distance Control',
        actual: analysis.consistency * 100,
        expected: 85,
        trend: trends.distanceTrend
      },
      {
        name: 'Accuracy',
        actual: (1 - analysis.dispersion / 20) * 100,
        expected: 80,
        trend: -trends.consistencyTrend
      },
      {
        name: 'Spin Control',
        actual: analysis.efficiency * 100,
        expected: 90,
        trend: trends.spinTrend
      }
    ];
  }, [recentShots]);

  const trendData = React.useMemo(() => {
    return recentShots.map((shot, index) => ({
      time: new Date(shot.timestamp).toLocaleTimeString(),
      distance: shot.distance,
      accuracy: 100 - (Math.abs(shot.distance - (activePreset?.distance || 250)) / 2),
      consistency: 100 - (Math.abs(shot.spin - (activePreset?.spin || 2500)) / 100)
    }));
  }, [recentShots, activePreset]);

  return (
    <div className="space-y-6 p-4">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Shot Analysis</h3>
        <div className="flex gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm"
          >
            <option value="distance">Distance</option>
            <option value="accuracy">Accuracy</option>
            <option value="consistency">Consistency</option>
          </select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {performanceMetrics.map((metric) => (
          <div
            key={metric.name}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{metric.name}</span>
              <span className={`text-sm ${
                metric.trend > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.trend > 0 ? '↑' : '↓'} {Math.abs(metric.trend).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold">
                {metric.actual.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 mb-1">
                Target: {metric.expected}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="h-64 bg-white dark:bg-gray-800 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm text-gray-500 mb-2">Session Summary</h4>
          <ul className="space-y-1 text-sm">
            <li>Total Shots: {recentShots.length}</li>
            <li>Avg Distance: {
              (recentShots.reduce((acc, shot) => acc + shot.distance, 0) / recentShots.length).toFixed(1)
            }y</li>
            <li>Best Streak: 5 shots</li>
          </ul>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm text-gray-500 mb-2">Recommendations</h4>
          <ul className="space-y-1 text-sm">
            <li>• Focus on follow-through</li>
            <li>• Check alignment</li>
            <li>• Maintain tempo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
