'use client'

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Plus, Target } from 'lucide-react';

type Club = {
  name: string;
  distance: number;
  loft: number;
  ballSpeed: number;
  launchAngle: number;
  spinRate: number;
}

const defaultClubs: Club[] = [
  { name: 'Driver', distance: 260, loft: 10.5, ballSpeed: 167, launchAngle: 14.2, spinRate: 2800 },
  { name: '3 Wood', distance: 235, loft: 15, ballSpeed: 158, launchAngle: 13.5, spinRate: 3400 },
  { name: '5 Iron', distance: 185, loft: 27, ballSpeed: 138, launchAngle: 17.8, spinRate: 5200 },
  { name: '7 Iron', distance: 165, loft: 34, ballSpeed: 127, launchAngle: 19.5, spinRate: 6400 },
  { name: 'PW', distance: 135, loft: 46, ballSpeed: 115, launchAngle: 24, spinRate: 8200 }
];

export default function ClubSelection() {
  const [clubs, setClubs] = useState<Club[]>(defaultClubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newClub, setNewClub] = useState<Club>({
    name: '',
    distance: 0,
    loft: 0,
    ballSpeed: 0,
    launchAngle: 0,
    spinRate: 0
  });

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
  };

  const handleAddClub = () => {
    setClubs([...clubs, {...newClub}]);
    setNewClub({
      name: '',
      distance: 0,
      loft: 0,
      ballSpeed: 0,
      launchAngle: 0,
      spinRate: 0
    });
    setEditMode(false);
  };

  const getDistanceClass = (distance: number) => {
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
          <div
            key={club.name}
            onClick={() => handleClubSelect(club)}
            className={`${
              selectedClub?.name === club.name ? 'ring-2 ring-blue-500' : ''
            } ${getDistanceClass(club.distance)} 
            rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{club.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Target size={14} />
                <span>{club.distance}y</span>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Loft:</span>
                <span>{club.loft}°</span>
              </div>
              <div className="flex justify-between">
                <span>Ball Speed:</span>
                <span>{club.ballSpeed} mph</span>
              </div>
              <div className="flex justify-between">
                <span>Launch:</span>
                <span>{club.launchAngle}°</span>
              </div>
              <div className="flex justify-between">
                <span>Spin:</span>
                <span>{club.spinRate} rpm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Club Form */}
      {editMode && (
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Club</h3>
          <div className="grid grid-cols-2 gap-4">
            {['name', 'distance', 'loft', 'ballSpeed', 'launchAngle', 'spinRate'].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-400 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={field === 'name' ? 'text' : 'number'}
                  value={newClub[field]}
                  onChange={(e) => setNewClub({...newClub, [field]: field === 'name' ? e.target.value : Number(e.target.value)})}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 
                           border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddClub}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Add Club
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
