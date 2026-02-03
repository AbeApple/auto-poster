import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setViewingImageId } from '../../global/redux/slices/DisplaySlice';
import './ImageViewer.css';

const ImageViewer = () => {
  const viewingImageId = useSelector(state => state.display.viewingImageId);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setViewingImageId(null));
  };

  if (!viewingImageId) {
    return null;
  }

  return (
    <div className="image-viewer-overlay">
      <div className="image-viewer-container">
        <div className="image-viewer-header">
          <button className="close-button" onClick={handleClose} title="Close">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="image-viewer-content">
          <img src={viewingImageId} alt="Full view" className="full-screen-image" />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
