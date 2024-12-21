import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Plus, Target } from 'lucide-react';

export default function ClubSelection() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newClub, setNewClub] = useState({
    name: '',
    distance: '',
    loft: '',
    ballSpeed: '',
    launchAngle: '',
    spinRate: ''
  });

  // Initialize with some default clubs
  useEffect(() => {
    const defaultClubs = [
      { name: 'Driver', distance: 260, loft: 10.5, ballSpeed: 167, launchAngle: 14.2, spinRate: 2800 },
      { name: '3 Wood', distance: 235, loft: 15, ballSpeed: 158, launchAngle: 13.5, spinRate: 3400 },
      { name: '5 Iron', distance: 185, loft: 27, ballSpeed: 138, launchAngle: 17.8, spinRate: 5200 },
      { name: '7 Iron', distance: 165, loft: 34, ballSpeed: 127, launchAngle: 19.5, spinRate: 6400 },
      { name: 'PW', distance: 135, loft: 46, ballSpeed: 115, launchAngle: 24, spinRate: 8200 }
    ];
    
    setClubs(defaultClubs);
  }, []);

  const handleClubSelect = (club) => {
    setSelectedClub(club);
  };

  const handleAddClub = () => {
    setClubs([...clubs, {...newClub}]);
    setNewClub({
      name: '',
      distance: '',
      loft: '',
      ballSpeed: '',
      launchAngle: '',
      spinRate: ''
    });
    setEditMode(false);
  };

  const getDistanceClass = (distance) => {
    if (distance > 230) return 'bg-red-500/20 border-red-500/30';
    if (distance > 180) return 'bg-orange-500/20 border-orange-500/30';
    if (distance > 150) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Club Selection</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                     text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Club
        </button>
      </div>

      {/* Club Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {clubs.map((club) => (
          <button
            key={club.name}
            onClick={() => handleClubSelect(club)}
            className={`p-4 rounded-xl border transition-all ${
              selectedClub?.name === club.name 
                ? 'ring-2 ring-blue-500 border-blue-500/50' 
                : `${getDistanceClass(club.distance)}`
            } hover:scale-102`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-semibold">{club.name}</span>
              <Target size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {club.distance}
              <span className="text-sm text-gray-400 ml-1">yards</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="text-gray-400">
                Loft: <span className="text-gray-300">{club.loft}°</span>
              </div>
              <div className="text-gray-400">
                Launch: <span className="text-gray-300">{club.launchAngle}°</span>
              </div>
              <div className="text-gray-400">
                Speed: <span className="text-gray-300">{club.ballSpeed} mph</span>
              </div>
              <div className="text-gray-400">
                Spin: <span className="text-gray-300">{club.spinRate.toLocaleString()}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add Club Form */}
      {editMode && (
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Club</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(newClub).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'name' ? 'text' : 'number'}
                  value={newClub[field]}
                  onChange={(e) => setNewClub({...newClub, [field]: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 
                           border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder={field === 'name' ? 'Club name' : '0'}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleAddClub}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white 
                     py-2 rounded-lg transition-colors"
          >
            Add Club
          </button>
        </div>
      )}

      {/* Selected Club Details */}
      {selectedClub && (
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Club Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Carry Distance', value: `${selectedClub.distance} yards` },
              { label: 'Ball Speed', value: `${selectedClub.ballSpeed} mph` },
              { label: 'Launch Angle', value: `${selectedClub.launchAngle}°` },
              { label: 'Spin Rate', value: selectedClub.spinRate.toLocaleString() }
            ].map(detail => (
              <div key={detail.label} className="bg-black/30 rounded-lg p-3">
                <div className="text-gray-400 text-sm">{detail.label}</div>
                <div className="text-white font-bold">{detail.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
