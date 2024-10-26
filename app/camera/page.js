'use client';

import { useState, useRef, useEffect } from 'react';

export default function CameraPage() {
  const videoRef = useRef(null);
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);

  // Magnet specifications
  const MAGNET_DIMENSIONS = {
    final: 600, // 2" x 2" at 300 DPI
    withBleed: 815, // 2.717" x 2.717" at 300 DPI
    safeZone: 540, // Slightly inside final dimensions for safety
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setEmail(savedEmail);
    startCamera();

    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      // Request specific dimensions for optimal magnet output
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: MAGNET_DIMENSIONS.withBleed },
          height: { ideal: MAGNET_DIMENSIONS.withBleed },
          facingMode: 'user',
          aspectRatio: 1 // Force square aspect ratio
        } 
      });
      
      setCurrentStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.log("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(timer);
        setTimeout(() => {
          takePhoto();
          setCountdown(null);
        }, 1000);
      }
    }, 1000);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    // Create canvas at bleed size
    const canvas = document.createElement('canvas');
    canvas.width = MAGNET_DIMENSIONS.withBleed;
    canvas.height = MAGNET_DIMENSIONS.withBleed;
    
    const ctx = canvas.getContext('2d');
    
    // Draw video centered in the canvas
    const scale = Math.max(
      canvas.width / video.videoWidth,
      canvas.height / video.videoHeight
    );
    
    const x = (canvas.width - video.videoWidth * scale) / 2;
    const y = (canvas.height - video.videoHeight * scale) / 2;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      video, 
      x, y, 
      video.videoWidth * scale,
      video.videoHeight * scale
    );

    // Add guide overlays for development
    if (process.env.NODE_ENV === 'development') {
      // Bleed area
      ctx.strokeStyle = 'rgba(255,0,0,0.5)';
      ctx.strokeRect(0, 0, MAGNET_DIMENSIONS.withBleed, MAGNET_DIMENSIONS.withBleed);
      
      // Final magnet area
      ctx.strokeStyle = 'rgba(0,255,0,0.5)';
      const offset = (MAGNET_DIMENSIONS.withBleed - MAGNET_DIMENSIONS.final) / 2;
      ctx.strokeRect(
        offset, offset,
        MAGNET_DIMENSIONS.final,
        MAGNET_DIMENSIONS.final
      );
    }

    const photoData = canvas.toDataURL('image/jpeg', 1.0);
    setPhoto(photoData);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <p className="text-gray-600">Logged in as: {email}</p>
        </div>

        {/* Camera Container with Guide Overlay */}
        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
          {!photo ? (
            <div className="relative w-full h-full">
              {/* Video Feed */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Safe Zone Guide */}
              <div className="absolute inset-0 border-2 border-white border-opacity-20 m-4 pointer-events-none" />
              
              {/* Countdown */}
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <span className="text-white text-[180px] font-bold">
                    {countdown}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <img 
              src={photo} 
              alt="Captured photo" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          {!photo ? (
            <button 
              className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition"
              onClick={startCountdown}
              disabled={countdown !== null}
            >
              Take Photo
            </button>
          ) : (
            <>
              <button 
                className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition"
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'photo-booth-magnet.jpg';
                  link.href = photo;
                  link.click();
                }}
              >
                Save Photo
              </button>
              <button 
                className="w-full bg-gray-500 text-white p-4 rounded-lg hover:bg-gray-600 transition"
                onClick={retakePhoto}
              >
                Retake Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
