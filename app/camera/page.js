'use client';

import { useState, useRef, useEffect } from 'react';

export default function CameraPage({ userEmail }) {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Function to start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  // Initialize camera on page load
  useEffect(() => {
    startCamera();

    // Cleanup function
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Start countdown and take photo
  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  // Update takePhoto function for high quality capture
  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Set canvas size for 2x2 inch photo at 300 DPI
      canvas.width = 600;  // 2 inches * 300 DPI
      canvas.height = 600; // 2 inches * 300 DPI
      
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions to maintain aspect ratio
      const size = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      
      // Draw the square photo
      ctx.drawImage(
        video,
        startX, startY, size, size,    // Source (crop to square)
        0, 0, canvas.width, canvas.height  // Destination (600x600)
      );

      setPhoto(canvas.toDataURL('image/jpeg', 0.95)); // High quality JPEG
    }
  };

  // Retake photo function
  const retakePhoto = async () => {
    setPhoto(null);
    // Restart camera
    await startCamera();
  };

  // Update the savePhoto function to use the real email
  const savePhoto = async () => {
    if (!photo) return;

    try {
      console.log('Saving photo for email:', userEmail); // Add this log

      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo: photo,
          email: userEmail  // Use the real email instead of test@example.com
        })
      });

      const result = await response.json();
      console.log('Server response:', result);
      
      if (result.success) {
        console.log('Photo saved successfully for:', userEmail);
        await retakePhoto();
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save photo. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Status message */}
        <div className="mb-4 text-center">
          {!cameraActive && (
            <p className="text-red-500">
              Camera initializing... Please wait or check permissions.
            </p>
          )}
        </div>

        <div className="bg-black rounded-lg overflow-hidden">
          <div style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '1/1',
            position: 'relative',
            margin: '0 auto'
          }}>
            {/* Camera Feed or Photo */}
            {!photo ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onPlay={() => setCameraActive(true)}
              />
            ) : (
              <img 
                src={photo} 
                alt="Captured photo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}

            {/* Countdown Overlay */}
            {countdown && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',      // Centers vertically
                  justifyContent: 'center',  // Centers horizontally
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
                  zIndex: 10                 // Makes sure it's on top
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '200px',       // Much bigger number
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'  // Adds shadow for better visibility
                  }}
                >
                  {countdown}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          {!photo ? (
            <button 
              onClick={startCountdown}
              disabled={!cameraActive || countdown !== null}
              className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {countdown ? `Taking photo in ${countdown}...` : 'Take Photo'}
            </button>
          ) : (
            <>
              <button 
                onClick={retakePhoto}
                className="w-full bg-gray-500 text-white p-4 rounded-lg hover:bg-gray-600"
              >
                Retake Photo
              </button>
              <button 
                onClick={savePhoto}
                className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600"
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
