import React from 'react';
import './DownloadDialog.css';

const DownloadDialog = ({ isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="download-dialog-overlay">
      <div className="download-dialog">
        <div className="download-dialog-header">
          <h2 className="download-dialog-title">Download Options</h2>
          <button className="download-dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="download-dialog-options">
          {/* Download all data */}
          <button
            className="download-option-button"
            onClick={() => onDownload('all-data')}
          >
            <div className="download-option-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="18"></line>
                <line x1="16" y1="18" x2="16" y2="18"></line>
                <line x1="8" y1="18" x2="8" y2="18"></line>
              </svg>
            </div>
            <div className="download-option-text">
              <div className="download-option-title">All Data</div>
              <div className="download-option-description">CSV file with all car records</div>
            </div>
          </button>

          {/* Download all images */}
          <button
            className="download-option-button"
            onClick={() => onDownload('all-images')}
          >
            <div className="download-option-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div className="download-option-text">
              <div className="download-option-title">All Images</div>
              <div className="download-option-description">All images organized by registration</div>
            </div>
          </button>

          {/* Search redult data */}
          <button
            className="download-option-button"
            onClick={() => onDownload('search-data')}
          >
            <div className="download-option-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="18"></line>
                <line x1="16" y1="18" x2="16" y2="18"></line>
                <line x1="8" y1="18" x2="8" y2="18"></line>
              </svg>
            </div>
            <div className="download-option-text">
              <div className="download-option-title">Search Result Data</div>
              <div className="download-option-description">CSV file with search results</div>
            </div>
          </button>

          {/* Search result images */}
          <button
            className="download-option-button"
            onClick={() => onDownload('search-images')}
          >
            <div className="download-option-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div className="download-option-text">
              <div className="download-option-title">Search Result Images</div>
              <div className="download-option-description">Images from current search results</div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default DownloadDialog;
