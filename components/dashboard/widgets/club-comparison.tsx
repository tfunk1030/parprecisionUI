import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ClubStats {
  name: string;
  distance: number;
  accuracy: number;
  consistency: number;
  control: number;
  spin: number;
}

const STATS_MAX = {
  distance: 300,
  accuracy: 100,
  consistency: 100,
  control: 100,
  spin: 8000
};

function normalizeStats(stats: ClubStats[]): any[] {
  return stats.map(stat => ({
    name: stat.name,
    distance: (stat.distance / STATS_MAX.distance) * 100,
    accuracy: (stat.accuracy / STATS_MAX.accuracy) * 100,
    consistency: (stat.consistency / STATS_MAX.consistency) * 100,
    control: (stat.control / STATS_MAX.control) * 100,
    spin: (stat.spin / STATS_MAX.spin) * 100
  }));
}

export function ClubComparisonWidget() {
  const [selectedClubs, setSelectedClubs] = React.useState<string[]>([
    'Driver',
    '7-Iron'
  ]);

  const clubStats: ClubStats[] = [
    {
      name: 'Driver',
      distance: 280,
      accuracy: 70,
      consistency: 75,
      control: 65,
      spin: 2500
    },
    {
      name: '3-Wood',
      distance: 245,
      accuracy: 75,
      consistency: 78,
      control: 70,
      spin: 3000
    },
    {
      name: '5-Iron',
      distance: 185,
      accuracy: 82,
      consistency: 80,
      control: 78,
      spin: 5000
    },
    {
      name: '7-Iron',
      distance: 165,
      accuracy: 85,
      consistency: 85,
      control: 82,
      spin: 6000
    },
    {
      name: 'PW',
      distance: 135,
      accuracy: 90,
      consistency: 88,
      control: 88,
      spin: 7500
    }
  ];

  const chartData = [
    { metric: 'Distance', fullMark: 100 },
    { metric: 'Accuracy', fullMark: 100 },
    { metric: 'Consistency', fullMark: 100 },
    { metric: 'Control', fullMark: 100 },
    { metric: 'Spin', fullMark: 100 }
  ].map(item => {
    const dataPoint: any = { metric: item.metric };
    selectedClubs.forEach(clubName => {
      const club = normalizeStats(clubStats).find(c => c.name === clubName);
      if (club) {
        dataPoint[clubName] = club[item.metric.toLowerCase()];
      }
    });
    return dataPoint;
  });

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Club Comparison</h3>
        <div className="flex gap-2">
          {clubStats.map((club, index) => (
            <button
              key={club.name}
              onClick={() => {
                if (selectedClubs.includes(club.name)) {
                  setSelectedClubs(selectedClubs.filter(c => c !== club.name));
                } else if (selectedClubs.length < 3) {
                  setSelectedClubs([...selectedClubs, club.name]);
                }
              }}
              className={`px-2 py-1 text-sm rounded-md ${
                selectedClubs.includes(club.name)
                  ? `bg-${colors[index]} text-white`
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {club.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {selectedClubs.map((club, index) => (
              <Radar
                key={club}
                name={club}
                dataKey={club}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.3}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {selectedClubs.map(clubName => {
          const club = clubStats.find(c => c.name === clubName);
          if (!club) return null;
          return (
            <div
              key={clubName}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <h4 className="font-medium mb-2">{clubName} Stats</h4>
              <div className="space-y-1 text-sm">
                <p>Distance: {club.distance}y</p>
                <p>Accuracy: {club.accuracy}%</p>
                <p>Spin: {club.spin.toLocaleString()} rpm</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
