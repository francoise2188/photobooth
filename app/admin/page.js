'use client';

import { useState } from 'react';

export default function AdminPanel() {
  const [designs, setDesigns] = useState({
    landingPage: null,
    cameraPage: null,
    photoFrame: null
  });

  const handleImageUpload = (type, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesigns(prev => ({
          ...prev,
          [type]: reader.result
        }));
        // Here we would normally save to database/storage
        localStorage.setItem(`design_${type}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Photo Booth Design Settings</h1>

        {/* Landing Page Design Upload */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Landing Page Design</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('landingPage', e.target.files[0])}
              className="mb-2"
            />
            {designs.landingPage && (
              <img 
                src={designs.landingPage} 
                alt="Landing page preview" 
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
        </div>

        {/* Camera Page Design Upload */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Camera Page Design</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('cameraPage', e.target.files[0])}
              className="mb-2"
            />
            {designs.cameraPage && (
              <img 
                src={designs.cameraPage} 
                alt="Camera page preview" 
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
        </div>

        {/* Photo Frame/Watermark Upload */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Photo Frame/Watermark</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('photoFrame', e.target.files[0])}
              className="mb-2"
            />
            {designs.photoFrame && (
              <img 
                src={designs.photoFrame} 
                alt="Photo frame preview" 
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
        </div>

        <button 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={() => alert('Settings saved!')} // We'll add actual save functionality later
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
