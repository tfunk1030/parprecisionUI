import React, { useState } from 'react';

const FolderStructure = () => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const structure = {
    src: {
      calculations: {
        'wind-calculations.js': 'Advanced wind effect calculations with vector analysis',
        'air-density-calculations.js': 'Air density and environmental effects processing',
        'altitude-calculations.js': 'Altitude-based adjustments and calculations',
        'core-calculations.js': 'Core physics engine and trajectory calculations'
      },
      components: {
        'Calculator.tsx': 'Main shot calculator component',
        'WeatherDisplay.tsx': 'Weather information visualization',
        'ClubSelector.tsx': 'Club selection and management interface',
        'TrajectoryDisplay.tsx': 'Ball flight visualization component'
      },
      services: {
        'weather-api.js': 'Tomorrow.io API integration and caching',
        'club-data.js': 'Club data management and storage',
        'shot-tracker.js': 'Shot history and statistics tracking'
      },
      utils: {
        'validation.js': 'Input validation and error handling',
        'error-handling.js': 'Centralized error handling system',
        'constants.js': 'Global constants and configuration'
      },
      models: {
        'ball-physics.js': 'Ball flight physics modeling',
        'weather.js': 'Weather data processing and analysis',
        'club.js': 'Club performance modeling'
      }
    },
    tests: {
      'wind.test.js': 'Wind calculation test suite',
      'physics.test.js': 'Physics engine validation tests',
      'calculations.test.js': 'Core calculation tests',
      'integration.test.js': 'Full system integration tests'
    },
    docs: {
      'golf-development-plan.md': 'Overall development plan and roadmap',
      'golf-tech-requirements.md': 'Technical requirements and specifications',
      'golf-tech-implementation.md': 'Implementation guide and standards',
      'development-tasks.md': 'Detailed development task breakdown'
    },
    config: {
      'jest.config.js': 'Testing configuration',
      'babel.config.js': 'Build system configuration',
      'tsconfig.json': 'TypeScript configuration',
      '.eslintrc.json': 'Code style and linting rules'
    }
  };

  const renderTree = (tree, path = 'root', level = 0) => {
    return (
      <div className="ml-4">
        {Object.entries(tree).map(([key, value]) => {
          const currentPath = `${path}/${key}`;
          const isExpanded = expandedFolders.has(currentPath);
          
          if (typeof value === 'object') {
            return (
              <div key={key}>
                <div 
                  className="flex items-center cursor-pointer hover:bg-gray-800 rounded px-2 py-1"
                  onClick={() => toggleFolder(currentPath)}
                >
                  <span className="text-emerald-400 mr-2">
                    {isExpanded ? '📂' : '📁'}
                  </span>
                  <span className="text-emerald-300 font-medium">{key}/</span>
                </div>
                {isExpanded && (
                  <div className="ml-4">
                    {renderTree(value, currentPath, level + 1)}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div key={key} className="ml-4 flex items-start py-1">
                <span className="text-emerald-400 mr-2">📄</span>
                <div>
                  <div className="text-emerald-200">{key}</div>
                  <div className="text-gray-400 text-sm">{value}</div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">
        Golf Shot Calculator Project Structure
      </h2>
      {renderTree(structure)}
    </div>
  );
};

export default FolderStructure;
