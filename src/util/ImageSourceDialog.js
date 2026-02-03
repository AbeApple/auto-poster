import React from 'react';
import './ImageSourceDialog.css';

const ImageSourceDialog = ({ isOpen, onUpload, onCamera, onCancel }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="image-source-dialog-overlay" onClick={handleOverlayClick}>
      <div className="image-source-dialog-box">
        <h3 className="image-source-dialog-title">Add Images</h3>
        <p className="image-source-dialog-message">How would you like to add images?</p>
        <div className="image-source-dialog-actions">
          <button className="image-source-dialog-upload" onClick={onUpload}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload
          </button>
          <button className="image-source-dialog-camera" onClick={onCamera}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Camera
          </button>
        </div>
        <button className="image-source-dialog-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ImageSourceDialog;
