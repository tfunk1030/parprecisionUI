import React from 'react';
import { ShotAnalyzer, type ShotData, type ShotAnalysis, type TrendAnalysis } from '@/lib/shot-analysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisViewProps {
  shots: ShotData[];
}

export function AnalysisView({ shots }: AnalysisViewProps) {
  const [analysis, setAnalysis] = React.useState<ShotAnalysis | null>(null);
  const [trends, setTrends] = React.useState<TrendAnalysis | null>(null);

  React.useEffect(() => {
    if (shots.length > 0) {
      const shotAnalysis = ShotAnalyzer.analyzeShotPattern(shots);
      const trendAnalysis = ShotAnalyzer.analyzeTrends(shots);
      setAnalysis(shotAnalysis);
      setTrends(trendAnalysis);
    }
  }, [shots]);

  if (!analysis || !trends) {
    return <div>Not enough data for analysis</div>;
  }

  const trendData = shots.map((shot, index) => ({
    index,
    distance: shot.distance,
    height: shot.height,
    spin: shot.spin / 100 // Scale down for visualization
  }));

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Consistency</h3>
          <p className="mt-1 text-2xl font-semibold">
            {(analysis.consistency * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dispersion</h3>
          <p className="mt-1 text-2xl font-semibold">
            {analysis.dispersion.toFixed(1)}y
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Efficiency</h3>
          <p className="mt-1 text-2xl font-semibold">
            {(analysis.efficiency * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#10B981"
              name="Distance"
            />
            <Line
              type="monotone"
              dataKey="height"
              stroke="#3B82F6"
              name="Height"
            />
            <Line
              type="monotone"
              dataKey="spin"
              stroke="#F59E0B"
              name="Spin (x100)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-3">Recommendations</h3>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Trends Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-3">Trends</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Distance Trend</p>
            <p className={`text-lg font-medium ${trends.distanceTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trends.distanceTrend > 0 ? '↑' : '↓'} {Math.abs(trends.distanceTrend).toFixed(1)}y/shot
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Consistency Trend</p>
            <p className={`text-lg font-medium ${trends.consistencyTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trends.consistencyTrend > 0 ? '↑' : '↓'} {Math.abs(trends.consistencyTrend * 100).toFixed(1)}%/shot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
