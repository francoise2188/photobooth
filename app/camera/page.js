'use client';

import { useState, useRef, useEffect } from 'react';

export default function CameraPage() {
  const videoRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    startCamera();
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
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
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
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '200px',
                      color: 'white',
                      zIndex: 50
                    }}
                  >
                    {countdown}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => startCountdown()}
          className="mt-4 w-full bg-blue-500 text-white p-4 rounded-lg"
        >
          Take Photo
        </button>
        
        {photo && (
          <button 
            onClick={() => retakePhoto()}
            className="mt-4 w-full bg-red-500 text-white p-4 rounded-lg"
          >
            Retake Photo
          </button>
        )}
      </div>
    </div>
  );
}
