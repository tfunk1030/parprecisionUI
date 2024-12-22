import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface TrajectoryPoint {
  distance: number;
  height: number;
  speed: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold mb-2">Something went wrong</h3>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TrajectoryPoint;
  }>;
}

const BallFlightVisualizer = () => {
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Basic physics constants
  const GRAVITY = 32.174;  // ft/s²
  const DRAG_COEFFICIENT = 0.3;
  const dt = 0.01;  // Time step in seconds

  useEffect(() => {
    calculateTrajectory();
  }, []);

  useEffect(() => {
    if (trajectory.length > 0 && loading === false) {
      // Animate the trajectory
      let frame = 0;
      const totalFrames = 60;
      const animate = () => {
        if (frame <= totalFrames) {
          setAnimationProgress(frame / totalFrames);
          frame++;
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [trajectory, loading]);

  const calculateTrajectory = () => {
    try {
      setLoading(true);
      setError(null);

      // Initial conditions
      const initialVelocity = {
        x: 235,  // ft/s (~160 mph)
        y: 85    // ft/s (launch angle ~20 degrees)
      };

      const points: TrajectoryPoint[] = [];
      let state = {
        x: 0,
        y: 0,
        vx: initialVelocity.x,
        vy: initialVelocity.y
      };

      // Calculate trajectory until ball hits ground
      let t = 0;
      while (state.y >= 0 && t < 10) {
        // Simple drag force
        const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
        const drag = DRAG_COEFFICIENT * speed;

        // Update velocities
        state.vx -= (drag * state.vx / speed) * dt;
        state.vy -= (drag * state.vy / speed + GRAVITY) * dt;

        // Update positions
        state.x += state.vx * dt;
        state.y += state.vy * dt;
        t += dt;

        // Add point to trajectory (only every few timesteps to reduce data points)
        if (points.length % 5 === 0) {
          points.push({
            distance: Math.round(state.x / 3 * 10) / 10,  // Convert to yards, round to 1 decimal
            height: Math.round(state.y / 3 * 10) / 10,    // Convert to yards, round to 1 decimal
            speed: Math.round(speed / 1.467), // Convert to mph
          });
        }
      }

      setTrajectory(points);
      setLoading(false);
    } catch (err) {
      setError('Failed to calculate trajectory');
      setLoading(false);
    }
  };

  const maxHeight = trajectory.length > 0 
    ? Math.round(Math.max(...trajectory.map(p => p.height)))
    : 0;
  
  const totalDistance = trajectory.length > 0 
    ? Math.round(trajectory[trajectory.length - 1].distance)
    : 0;

  const maxSpeed = trajectory.length > 0
    ? Math.round(Math.max(...trajectory.map(p => p.speed)))
    : 0;

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-gray-900 p-2 rounded-lg border border-gray-700">
        <p className="text-white">Distance: {payload[0].payload.distance} yards</p>
        <p className="text-white">Height: {payload[0].payload.height} yards</p>
        <p className="text-white">Speed: {payload[0].payload.speed} mph</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-96 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg text-red-200 border border-red-900">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={calculateTrajectory}
          className="mt-4 px-4 py-2 bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const animatedData = trajectory.slice(0, Math.floor(trajectory.length * animationProgress));

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-4">Ball Flight Trajectory</h2>
          <div className="h-96">
            <LineChart
              width={800}
              height={400}
              data={animatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="distance"
                label={{
                  value: 'Distance (yards)',
                  position: 'bottom',
                  style: { fill: 'white' }
                }}
                stroke="#fff"
              />
              <YAxis
                label={{
                  value: 'Height (yards)',
                  angle: -90,
                  position: 'left',
                  style: { fill: 'white' }
                }}
                stroke="#fff"
              />
              <ReferenceLine y={maxHeight} stroke="#4ade80" strokeDasharray="3 3" label={{ 
                value: `Max Height: ${maxHeight}y`, 
                fill: '#4ade80',
                position: 'right'
              }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="height"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Maximum Height</p>
              <p className="text-white text-lg font-bold">{maxHeight} yards</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Total Distance</p>
              <p className="text-white text-lg font-bold">{totalDistance} yards</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Maximum Speed</p>
              <p className="text-white text-lg font-bold">{maxSpeed} mph</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BallFlightVisualizer;
