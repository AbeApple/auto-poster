import React, { useRef, useState, useEffect } from 'react';
import './Camera.css';

const Camera = ({ carId, userId, onSave, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera: Error accessing camera', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleDeleteAndExit = () => {
    console.log('Camera: Delete and exit clicked');
    onCancel();
  };

  const handleSaveAndDone = () => {
    console.log('Camera: Save and done clicked');
    if (capturedImage && onSave) {
      onSave(capturedImage, 'done');
    }
  };

  const handleSaveAndNext = () => {
    console.log('Camera: Save and next clicked');
    if (capturedImage && onSave) {
      onSave(capturedImage, 'next');
      // Reset captured image to reopen camera for next shot
      setCapturedImage(null);
      startCamera();
    }
  };

  return (
    <div className="camera-overlay">
      <div className="camera-view">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="captured-image" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="camera-controls">
        {!capturedImage ? (
          <button className="capture-button" onClick={captureImage}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        ) : (
          <div className="camera-actions">
            <button className="camera-button delete-button" onClick={handleDeleteAndExit}>
              Delete & Exit
            </button>
            <button className="camera-button retake-button" onClick={retake}>
              Retake
            </button>
            <button className="camera-button save-done-button" onClick={handleSaveAndDone}>
              Save & Done
            </button>
            <button className="camera-button save-next-button" onClick={handleSaveAndNext}>
              Save & Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
