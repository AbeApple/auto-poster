import React from 'react';
import './SearchPager.css';

const SearchPager = ({ pageStart, pageEnd, totalItems, setPageStart, setPageEnd }) => {
  const pageSize = 19;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.floor(pageStart / pageSize) + 1;

  const handlePrevious = () => {
    if (pageStart > 0) {
      setPageStart(Math.max(0, pageStart - pageSize));
      setPageEnd(Math.max(pageSize, pageEnd - pageSize));
    }
  };

  const handleNext = () => {
    const newPageStart = pageStart + pageSize;
    setPageStart(newPageStart);
    setPageEnd(newPageStart + pageSize);
  };

  if (totalItems <= pageSize) {
    return null;
  }

  return (
    <div className="search-pager">
      <button
        className="pager-button"
        onClick={handlePrevious}
        disabled={pageStart === 0}
        title="Previous"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <span className="pager-info">
        {pageStart + 1}-{pageEnd + 1}
      </span>
      <button
        className="pager-button"
        onClick={handleNext}
        disabled={pageEnd >= totalItems}
        title="Next"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default SearchPager;
