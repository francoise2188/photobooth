'use client';

import { useState, useRef, useEffect } from 'react';

export default function CameraPage() {
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [email, setEmail] = useState('');
  const videoRef = useRef(null);

  // Initialize camera and get email
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
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();
    
    // Get email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    setEmail(storedEmail);

    // Cleanup
    return () => {
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          takePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  // New function to save photo data
  const savePhotoData = async () => {
    setIsSending(true);
    setShareMessage('Saving photo...');
    
    try {
      // Get existing photos from storage or initialize empty array
      const existingData = JSON.parse(localStorage.getItem('photoBoothData') || '[]');
      
      // Add new photo data
      const newPhotoData = {
        id: Date.now(),
        email: email,
        photoUrl: photo,
        timestamp: new Date().toISOString(),
        sent: false
      };
      
      // Save to storage
      localStorage.setItem('photoBoothData', JSON.stringify([...existingData, newPhotoData]));
      
      setShareMessage('Photo saved! We\'ll email it to you after the event.');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setShareMessage('Error saving photo. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <p className="text-gray-600">Logged in as: {email}</p>
        </div>

        {/* Camera Container */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '1/1',
          position: 'relative',
          backgroundColor: 'black',
          borderRadius: '8px',
          overflow: 'hidden',
          margin: '0 auto'
        }}>
          {!photo && (
            <>
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
              />
              
              {countdown && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)'
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '150px',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}
          
          {photo && (
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
              {/* Share Button - This saves the photo with email */}
              <button 
                className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition"
                onClick={savePhotoData}
                disabled={isSending}
              >
                {isSending ? 'Sharing...' : 'Share'}
              </button>

              {/* Done Button - This returns to camera */}
              <button 
                className="w-full bg-gray-500 text-white p-4 rounded-lg hover:bg-gray-600 transition"
                onClick={retakePhoto}
              >
                Done
              </button>

              {shareMessage && (
                <div className="text-center mt-2 text-sm font-medium text-gray-600">
                  {shareMessage}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
