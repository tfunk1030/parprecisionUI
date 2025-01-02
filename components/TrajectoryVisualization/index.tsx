import React, { useMemo } from 'react';

interface TrajectoryVisualizationProps {
  trajectory: [number, number, number][];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  className?: string;
}

export const TrajectoryVisualization: React.FC<TrajectoryVisualizationProps> = ({
  trajectory,
  width = 400,
  height = 200,
  showGrid = true,
  showAxis = true,
  className = '',
}) => {
  const {
    viewBox,
    pathD,
    gridLines,
    axisLines,
    maxDistance,
    maxHeight,
  } = useMemo(() => {
    if (!trajectory.length) {
      return {
        viewBox: '0 0 400 200',
        pathD: '',
        gridLines: [],
        axisLines: [],
        maxDistance: 0,
        maxHeight: 0,
      };
    }

    // Calculate bounds
    const maxX = Math.max(...trajectory.map(([x]) => x));
    const maxY = Math.max(...trajectory.map(([, y]) => y));
    const maxZ = Math.max(...trajectory.map(([,, z]) => Math.abs(z)));

    // Add padding
    const padding = 20;
    const viewBoxWidth = width;
    const viewBoxHeight = height;

    // Scale factors
    const scaleX = (viewBoxWidth - 2 * padding) / maxX;
    const scaleY = (viewBoxHeight - 2 * padding) / Math.max(maxY, maxZ);

    // Create path
    const pathD = trajectory
      .map(([x, y, z], i) => {
        const screenX = x * scaleX + padding;
        const screenY = viewBoxHeight - (y * scaleY + padding);
        return `${i === 0 ? 'M' : 'L'} ${screenX} ${screenY}`;
      })
      .join(' ');

    // Create grid lines
    const gridLines = [];
    if (showGrid) {
      // Vertical lines
      for (let x = 0; x <= maxX; x += maxX / 4) {
        const screenX = x * scaleX + padding;
        gridLines.push({
          x1: screenX,
          y1: padding,
          x2: screenX,
          y2: viewBoxHeight - padding,
          label: `${Math.round(x)}y`,
          labelX: screenX,
          labelY: viewBoxHeight - padding / 3,
        });
      }

      // Horizontal lines
      for (let y = 0; y <= maxY; y += maxY / 4) {
        const screenY = viewBoxHeight - (y * scaleY + padding);
        gridLines.push({
          x1: padding,
          y1: screenY,
          x2: viewBoxWidth - padding,
          y2: screenY,
          label: `${Math.round(y)}ft`,
          labelX: padding / 3,
          labelY: screenY,
        });
      }
    }

    // Create axis lines
    const axisLines = showAxis ? [
      // X-axis
      {
        x1: padding,
        y1: viewBoxHeight - padding,
        x2: viewBoxWidth - padding,
        y2: viewBoxHeight - padding,
      },
      // Y-axis
      {
        x1: padding,
        y1: viewBoxHeight - padding,
        x2: padding,
        y2: padding,
      },
    ] : [];

    return {
      viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
      pathD,
      gridLines,
      axisLines,
      maxDistance: maxX,
      maxHeight: maxY,
    };
  }, [trajectory, width, height, showGrid, showAxis]);

  if (!trajectory.length) {
    return (
      <div className={`trajectory-visualization-empty ${className}`} data-testid="trajectory-visualization-empty">
        <div className="text-gray-400 text-center py-8">
          No trajectory data available
        </div>
      </div>
    );
  }

  return (
    <div className={`trajectory-visualization ${className}`} data-testid="trajectory-visualization">
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        className="trajectory-svg"
        style={{ backgroundColor: '#f8fafc' }}
        data-testid="trajectory-svg"
      >
        {/* Grid */}
        {gridLines.map((line, i) => (
          <React.Fragment key={i}>
            <line
              {...line}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
              data-testid={`grid-line-${i}`}
            />
            <text
              x={line.labelX}
              y={line.labelY}
              fontSize="10"
              fill="#64748b"
              textAnchor="middle"
              dominantBaseline="middle"
              data-testid={`grid-label-${i}`}
            >
              {line.label}
            </text>
          </React.Fragment>
        ))}

        {/* Axes */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            {...line}
            stroke="#94a3b8"
            strokeWidth="1"
            data-testid={`axis-line-${i}`}
          />
        ))}

        {/* Trajectory path */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-testid="trajectory-path"
        />

        {/* Ball position marker */}
        {trajectory.map(([x, y, z], i) => {
          const screenX = x * (width - 40) / maxDistance + 20;
          const screenY = height - (y * (height - 40) / maxHeight + 20);
          return i % 5 === 0 ? (
            <circle
              key={i}
              cx={screenX}
              cy={screenY}
              r="2"
              fill="#3b82f6"
              data-testid={`ball-marker-${i}`}
            />
          ) : null;
        })}
      </svg>

      <div className="text-xs text-gray-500 mt-2 text-center" data-testid="trajectory-stats">
        Max Distance: {Math.round(maxDistance)}y | Max Height: {Math.round(maxHeight)}ft
      </div>
    </div>
  );
}; 