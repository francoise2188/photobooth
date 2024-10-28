'use client';

import { useState, useRef, useEffect } from 'react';

export default function CameraPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Add this to store stream reference
  const [countdown, setCountdown] = useState(null);
  const [photo, setPhoto] = useState(null);

  const startCamera = async () => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      streamRef.current = stream; // Store stream reference
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    startCamera();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 600;  // 2 inches * 300 DPI
      canvas.height = 600; // 2 inches * 300 DPI
      
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions to maintain aspect ratio
      const size = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      
      ctx.drawImage(
        video,
        startX, startY, size, size,
        0, 0, canvas.width, canvas.height
      );

      setPhoto(canvas.toDataURL('image/jpeg', 0.95));
      
      // Stop the camera stream when photo is taken
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const retakePhoto = async () => {
    setPhoto(null);
    await startCamera(); // Restart the camera
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-black rounded-lg">
          <div className="relative aspect-square">
            {photo ? (
              <img 
                src={photo} 
                alt="Captured photo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {countdown !== null && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-[200px] md:text-[300px] text-white font-bold">
                      {countdown}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-4 mt-4">
          {!photo && (
            <button 
              onClick={startCountdown}
              className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition"
            >
              Take Photo
            </button>
          )}
          
          {photo && (
            <>
              <button 
                onClick={retakePhoto}
                className="w-full bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition"
              >
                Retake Photo
              </button>
              <button 
                onClick={() => {/* Add save/share functionality */}}
                className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition"
              >
                Save Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
