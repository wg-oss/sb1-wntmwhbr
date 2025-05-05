import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface ContractorPreferencesProps {
  onPreferencesChange: (preferences: {
    distance: number;
    specialty: string;
    experience: number;
  }) => void;
  specialties: string[];
  initialOpen?: boolean;
  onClose?: () => void;
}

const ContractorPreferences: React.FC<ContractorPreferencesProps> = ({
  onPreferencesChange,
  specialties,
  initialOpen = false,
  onClose,
}) => {
  console.log('ContractorPreferences rendered, initialOpen:', initialOpen);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    distance: 50,
    specialty: 'All',
    experience: 5,
  });

  useEffect(() => {
    console.log('useEffect triggered, initialOpen:', initialOpen);
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onPreferencesChange(preferences);
    if (onClose) {
      onClose();
    }
  };

  const handleChange = (key: keyof typeof preferences, value: string | number) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <SlidersHorizontal size={24} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Filter Contractors</h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (miles)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.distance}
                  onChange={(e) => handleChange('distance', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-600 mt-2">{preferences.distance} miles</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={preferences.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience (years)
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={preferences.experience}
                  onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-600 mt-2">{preferences.experience}+ years</div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorPreferences; 