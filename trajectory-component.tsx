import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Compass } from 'lucide-react';

const TrajectoryVisualization = () => {
  // Initial conditions with more realistic golf values
  const [launchParams, setLaunchParams] = useState({
    velocity: 160,      // Initial velocity (mph)
    angle: 12,         // Launch angle (degrees)
    spinRate: 2800,    // RPM
    spinAxis: 0        // Spin axis tilt (degrees) - 0 is pure backspin
  });

  // Wind conditions
  const [windParams, setWindParams] = useState({
    speed: 10,         // Wind speed (mph)
    direction: 0,      // degrees - 0 is headwind
    altitude: 0        // feet above sea level
  });

  const [trajectory, setTrajectory] = useState({ side: [], front: [] });

  // Physics constants
  const g = 32.174;                  // Gravity (ft/s^2)
  const rho = 0.0023769;             // Air density at sea level (slug/ft^3)
  const Cd = 0.33;                   // Drag coefficient
  const Cl = 0.25;                   // Lift coefficient
  const m = 0.1012;                  // Mass of golf ball (lb)
  const r = 0.084;                   // Radius of golf ball (ft)
  const A = Math.PI * r * r;         // Cross-sectional area (ft^2)

  const calculateTrajectory = () => {
    let dt = 0.001;    // Time step (s)
    let t = 0;
    let x = 0;         // Forward distance
    let y = 0;         // Height
    let z = 0;         // Lateral distance
    
    // Convert launch conditions to ft/s
    const v0 = launchParams.velocity * 1.467;  // Convert mph to ft/s
    const theta = launchParams.angle * Math.PI / 180;
    const omega = launchParams.spinRate * 2 * Math.PI / 60;
    const spinAxisRad = launchParams.spinAxis * Math.PI / 180;
    const windSpeed = windParams.speed * 1.467;
    const windRad = windParams.direction * Math.PI / 180;

    // Initial velocities
    let vx = v0 * Math.cos(theta);
    let vy = v0 * Math.sin(theta);
    let vz = 0;

    let frontView = [];
    let sideView = [];

    while (y >= 0 && t < 10) {
      // Total velocity magnitude
      const v = Math.sqrt(vx * vx + vy * vy + vz * vz);
      
      // Wind-adjusted velocities
      const vRelX = vx - windSpeed * Math.cos(windRad);
      const vRelY = vy;
      const vRelZ = vz - windSpeed * Math.sin(windRad);
      const vRel = Math.sqrt(vRelX * vRelX + vRelY * vRelY + vRelZ * vRelZ);

      // Calculate air density at current height (simple model)
      const densityFactor = Math.exp(-y / 30000);  // Approximate density reduction with height
      const localRho = rho * densityFactor;
      
      // Drag force
      const Fd = 0.5 * localRho * A * Cd * vRel * vRel;
      
      // Magnus force components (accounting for spin axis)
      const Fm = 0.5 * localRho * A * Cl * omega * r * vRel;
      const liftRatio = Math.cos(spinAxisRad);
      const sideForceRatio = Math.sin(spinAxisRad);
      
      // Force components
      const Fx = -Fd * vRelX / vRel;
      const Fy = -Fd * vRelY / vRel + Fm * liftRatio;
      const Fz = -Fd * vRelZ / vRel + Fm * sideForceRatio;

      // Update velocities (F = ma)
      vx += (Fx / m) * dt;
      vy += (Fy / m - g) * dt;
      vz += (Fz / m) * dt;
      
      // Update positions
      x += vx * dt;
      y += vy * dt;
      z += vz * dt;
      t += dt;
      
      // Record points at intervals (convert to yards)
      if (t % 0.01 < dt) {
        frontView.push({
          x: x / 3,      // Convert to yards
          y: y / 3,
          v: v / 1.467   // Convert back to mph for display
        });
        
        sideView.push({
          x: x / 3,
          z: z / 3
        });
      }
    }
    
    setTrajectory({ front: frontView, side: sideView });
  };

  useEffect(() => {
    calculateTrajectory();
  }, [launchParams, windParams]);

  return (
    <div className="w-full space-y-6 p-4 bg-gray-800 rounded-lg">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Launch Conditions</h3>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Club Speed (mph)</label>
            <input
              type="range"
              min="120"
              max="180"
              value={launchParams.velocity}
              onChange={(e) => setLaunchParams(prev => ({...prev, velocity: Number(e.target.value)}))}
              className="w-full"
            />
            <span className="text-gray-300">{launchParams.velocity} mph</span>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Launch Angle (degrees)</label>
            <input
              type="range"
              min="0"
              max="30"
              value={launchParams.angle}
              onChange={(e) => setLaunchParams(prev => ({...prev, angle: Number(e.target.value)}))}
              className="w-full"
            />
            <span className="text-gray-300">{launchParams.angle}°</span>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Spin Rate (rpm)</label>
            <input
              type="range"
              min="2000"
              max="4000"
              step="100"
              value={launchParams.spinRate}
              onChange={(e) => setLaunchParams(prev => ({...prev, spinRate: Number(e.target.value)}))}
              className="w-full"
            />
            <span className="text-gray-300">{launchParams.spinRate} rpm</span>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Spin Axis (degrees)</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={launchParams.spinAxis}
              onChange={(e) => setLaunchParams(prev => ({...prev, spinAxis: Number(e.target.value)}))}
              className="w-full"
            />
            <span className="text-gray-300">{launchParams.spinAxis}° {launchParams.spinAxis > 0 ? '(draw)' : launchParams.spinAxis < 0 ? '(fade)' : '(straight)'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Wind Conditions</h3>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Wind Speed (mph)</label>
            <input
              type="range"
              min="0"
              max="30"
              value={windParams.speed}
              onChange={(e) => setWindParams(prev => ({...prev, speed: Number(e.target.value)}))}
              className="w-full"
            />
            <span className="text-gray-300">{windParams.speed} mph</span>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Wind Direction</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="360"
                value={windParams.direction}
                onChange={(e) => setWindParams(prev => ({...prev, direction: Number(e.target.value)}))}
                className="flex-1"
              />
              <Compass 
                className="w-6 h-6 text-gray-400" 
                style={{ transform: `rotate(${windParams.direction}deg)` }}
              />
            </div>
            <span className="text-gray-300">{windParams.direction}°</span>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Altitude (feet)</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={windParams.altitude}
              onChange={(e) => setWindParams(prev => ({...prev, altitude: Number(e.target.value)}))}
              className="w-full"
            />
            <span className="text-gray-300">{windParams.altitude} ft</span>
          </div>
        </div>
      </div>

      {/* Trajectory Views */}
      <div className="grid grid-cols-2 gap-4">
        {/* Front View */}
        <div className="h-96">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Side View</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={trajectory.front}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="x" 
                label={{ value: 'Distance (yards)', position: 'bottom' }}
                stroke="#ccc"
              />
              <YAxis 
                dataKey="y" 
                label={{ value: 'Height (yards)', angle: -90, position: 'left' }}
                stroke="#ccc"
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#4ade80" 
                dot={false} 
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                itemStyle={{ color: '#4ade80' }}
                formatter={(value, name) => {
                  if (name === 'y') return [`${Math.round(value)} yards`, 'Height'];
                  if (name === 'v') return [`${Math.round(value)} mph`, 'Ball Speed'];
                  return [`${Math.round(value)} yards`, 'Distance'];
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top View */}
        <div className="h-96">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Top View</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={trajectory.side.map(point => ({
                // Transform coordinates to start from middle
                x: point.z,  // Lateral movement becomes x-axis
                y: trajectory.front[trajectory.front.length - 1]?.x - point.x  // Distance becomes y-axis, inverted
              }))}
              margin={{ top: 20, right: 20, bottom: 5, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="x"
                type="number" 
                domain={[-50, 50]}  // Fixed range for lateral movement
                label={{ value: 'Left ← Yards → Right', position: 'bottom' }}
                stroke="#ccc"
                tickCount={11}
              />
              <YAxis 
                dataKey="y"
                type="number"
                domain={[0, 'dataMax + 20']}
                label={{ value: 'Distance (yards)', angle: -90, position: 'left' }}
                stroke="#ccc"
                reversed  // Invert axis to show shot moving up
              />
              <Line 
                type="monotone" 
                dataKey="y"
                stroke="#4ade80" 
                dot={false} 
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                itemStyle={{ color: '#4ade80' }}
                formatter={(value, name) => {
                  if (name === 'x') return [`${Math.round(value)} yards`, 'Lateral'];
                  return [`${Math.round(value)} yards`, 'Distance to Target'];
                }}
              />
              {/* Add reference line for center */}
              <Line
                type="monotone"
                dataKey={() => 0}
                stroke="#666"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shot Statistics */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm text-gray-400">Carry Distance</h4>
          <p className="text-xl text-emerald-400">
            {Math.round(trajectory.front[trajectory.front.length - 1]?.x || 0)} yards
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm text-gray-400">Max Height</h4>
          <p className="text-xl text-emerald-400">
            {Math.round(Math.max(...trajectory.front.map(p => p.y)))} yards
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm text-gray-400">Lateral Movement</h4>
          <p className="text-xl text-emerald-400">
            {Math.round(trajectory.side[trajectory.side.length - 1]?.z || 0)} yards
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="text-sm text-gray-400">Max Ball Speed</h4>
          <p className="text-xl text-emerald-400">
            {Math.round(Math.max(...trajectory.front.map(p => p.v)))} mph
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryVisualization;