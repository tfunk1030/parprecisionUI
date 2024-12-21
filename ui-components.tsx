import React, { useState, useEffect } from 'react';

// WeatherDisplay Component
export const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    windSpeed: null,
    windDirection: null,
    humidity: null,
    pressure: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Weather data would be fetched here
        // Using mock data for now
        const data = {
          temperature: 72,
          windSpeed: 8,
          windDirection: "NW",
          humidity: 45,
          pressure: 29.92
        };
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"/>
    </div>
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-900/50">
      <h2 className="text-xl font-semibold text-emerald-400 mb-4">Current Conditions</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="text-sm text-emerald-400">Temperature</div>
          <div className="text-2xl text-white mt-1">{weatherData.temperature}°F</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="text-sm text-emerald-400">Wind</div>
          <div className="text-2xl text-white mt-1">{weatherData.windSpeed} mph {weatherData.windDirection}</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="text-sm text-emerald-400">Humidity</div>
          <div className="text-2xl text-white mt-1">{weatherData.humidity}%</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <div className="text-sm text-emerald-400">Pressure</div>
          <div className="text-2xl text-white mt-1">{weatherData.pressure} inHg</div>
        </div>
      </div>
    </div>
  );
};

// ClubSelector Component
export const ClubSelector = () => {
  const [clubs, setClubs] = useState([
    { name: 'Driver', distance: 260 },
    { name: '3-Wood', distance: 230 },
    { name: '5-Wood', distance: 210 },
    { name: '4-Iron', distance: 190 },
    { name: '5-Iron', distance: 180 },
    { name: '6-Iron', distance: 170 },
    { name: '7-Iron', distance: 160 },
    { name: '8-Iron', distance: 150 },
    { name: '9-Iron', distance: 140 },
    { name: 'PW', distance: 130 },
    { name: 'GW', distance: 120 },
    { name: 'SW', distance: 110 },
    { name: 'LW', distance: 90 }
  ]);

  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-900/50">
      <h2 className="text-xl font-semibold text-emerald-400 mb-4">Club Selection</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {clubs.map((club) => (
          <button
            key={club.name}
            onClick={() => setSelectedClub(club)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              selectedClub?.name === club.name 
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800/50 text-emerald-400 hover:bg-gray-700/50'
            }`}
          >
            <div className="font-medium">{club.name}</div>
            <div className="text-sm opacity-75">{club.distance} yards</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ShotCalculator Component
export const ShotCalculator = () => {
  const [shotData, setShotData] = useState({
    distance: '',
    adjustedDistance: null,
    suggestedClub: null,
    trajectory: null
  });

  const calculateShot = () => {
    // Shot calculations would happen here
    // Using mock data for now
    setShotData({
      ...shotData,
      adjustedDistance: parseInt(shotData.distance) * 1.05,
      suggestedClub: '7 Iron',
      trajectory: 'mid'
    });
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-900/50">
      <h2 className="text-xl font-semibold text-emerald-400 mb-4">Shot Calculator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-emerald-400 mb-1">Distance to Pin</label>
          <input
            type="number"
            value={shotData.distance}
            onChange={(e) => setShotData({ ...shotData, distance: e.target.value })}
            className="w-full bg-gray-800/50 text-white border border-emerald-900/50 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter distance in yards"
          />
        </div>
        <button
          onClick={calculateShot}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition-all duration-300"
        >
          Calculate Shot
        </button>
        {shotData.adjustedDistance && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <div className="text-sm text-emerald-400">Adjusted Distance</div>
              <div className="text-2xl text-white mt-1">{shotData.adjustedDistance} yards</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <div className="text-sm text-emerald-400">Suggested Club</div>
              <div className="text-2xl text-white mt-1">{shotData.suggestedClub}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// TrajectoryVisualization Component
export const TrajectoryVisualization = () => {
  const [canvasRef] = useState(React.createRef());

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw trajectory
    ctx.beginPath();
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2;
    ctx.moveTo(50, height - 50);

    // Draw parabolic curve
    for (let x = 0; x < width - 100; x++) {
      const progress = x / (width - 100);
      const y = height - 50 - Math.sin(progress * Math.PI) * 200;
      ctx.lineTo(x + 50, y);
    }

    ctx.stroke();

    // Draw wind vector
    ctx.beginPath();
    ctx.strokeStyle = '#60A5FA';
    ctx.moveTo(width/2, 50);
    ctx.lineTo(width/2 + 50, 50);
    ctx.stroke();

    // Draw arrow head
    ctx.beginPath();
    ctx.moveTo(width/2 + 50, 50);
    ctx.lineTo(width/2 + 40, 45);
    ctx.lineTo(width/2 + 40, 55);
    ctx.closePath();
    ctx.fillStyle = '#60A5FA';
    ctx.fill();
  }, [canvasRef]);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-900/50">
      <h2 className="text-xl font-semibold text-emerald-400 mb-4">Shot Trajectory</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-64 bg-gray-800/50 rounded-xl"
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-sm">
          <span className="text-emerald-400">●</span> Shot Path
        </div>
        <div className="text-sm">
          <span className="text-blue-400">→</span> Wind Direction
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-emerald-400">Golf Shot Calculator</h1>
        <WeatherDisplay />
        <div className="grid md:grid-cols-2 gap-6">
          <ClubSelector />
          <ShotCalculator />
        </div>
        <TrajectoryVisualization />
      </div>
    </div>
  );
}
