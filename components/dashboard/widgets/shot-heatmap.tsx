'use client'

import React from 'react';
import { scaleLinear } from 'd3-scale';
import { useSettings, formatDistance } from '@/lib/club-settings-context';

interface ShotPoint {
  x: number;
  y: number;
  distance: number;
  deviation: number;
}

function generateHeatmapData(shots: ShotPoint[]) {
  const heatmapData = new Array(20).fill(0).map(() => new Array(20).fill(0));
  const xScale = scaleLinear().domain([-50, 50]).range([0, 19]);
  const yScale = scaleLinear().domain([0, 300]).range([0, 19]);

  shots.forEach(shot => {
    const x = Math.floor(xScale(shot.deviation));
    const y = Math.floor(yScale(shot.distance));
    if (x >= 0 && x < 20 && y >= 0 && y < 20) {
      heatmapData[y][x] += 1;
    }
  });

  return heatmapData;
}

export function ShotHeatmapWidget() {
  const { settings } = useSettings();

  // Example shot data
  const shots = React.useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 300,
      distance: Math.random() * 300,
      deviation: Math.random() * 100 - 50,
    }));
  }, []);

  const heatmapData = React.useMemo(() => generateHeatmapData(shots), [shots]);

  const maxIntensity = Math.max(...heatmapData.flat());
  const colorScale = scaleLinear<string>()
    .domain([0, maxIntensity])
    .range(['rgba(59, 130, 246, 0.1)', 'rgba(239, 68, 68, 0.8)']);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        {/* Heatmap Grid */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 gap-px">
          {heatmapData.map((row, y) =>
            row.map((value, x) => (
              <div
                key={`${x}-${y}`}
                className="w-full h-full"
                style={{
                  backgroundColor: value > 0 ? colorScale(value) : 'transparent',
                }}
              />
            ))
          )}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0">
          {/* Vertical lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`vline-${i}`}
              className="absolute h-full w-px bg-gray-200 dark:bg-gray-700"
              style={{ left: `${(i + 1) * 20}%` }}
            />
          ))}

          {/* Horizontal lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`hline-${i}`}
              className="absolute w-full h-px bg-gray-200 dark:bg-gray-700"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
          Lateral Deviation ({settings.units})
        </div>
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm text-gray-500"
          style={{ transformOrigin: '0 50%' }}
        >
          Distance ({settings.units})
        </div>
      </div>
    </div>
  );
}
