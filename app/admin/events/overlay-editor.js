'use client';

import { useState, useRef } from 'react';

export default function OverlayEditor() {
  const [overlays, setOverlays] = useState([
    // Test border
    {
      id: 'test-border',
      type: 'border',
      src: '', // We'll add a test image soon
      position: { x: 0, y: 0 },
      size: { width: 600, height: 600 },
      zIndex: 1
    },
    // Test logo
    {
      id: 'test-logo',
      type: 'logo',
      src: '', // We'll add a test image soon
      position: { x: 20, y: 20 },
      size: { width: 100, height: 100 },
      zIndex: 2
    }
  ]);

  // Add a simple test image upload
  const handleTestUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOverlays([
          ...overlays,
          {
            id: Date.now(),
            type: 'image',
            src: e.target.result,
            position: { x: 0, y: 0 },
            size: { width: 200, height: 200 },
            zIndex: overlays.length + 1
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Overlay Editor</h1>
        
        {/* Simple upload test */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Upload Test Overlay</h2>
          <input 
            type="file"
            accept="image/png"
            onChange={handleTestUpload}
            className="block w-full p-2 border rounded"
          />
        </div>

        {/* Preview Area */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative w-[600px] h-[600px] border-2 border-gray-300 mx-auto">
            {overlays.map(overlay => (
              <div
                key={overlay.id}
                className="absolute border border-dashed border-blue-400"
                style={{
                  left: overlay.position.x,
                  top: overlay.position.y,
                  width: overlay.size.width,
                  height: overlay.size.height,
                  zIndex: overlay.zIndex
                }}
              >
                {overlay.src && (
                  <img 
                    src={overlay.src} 
                    alt=""
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

