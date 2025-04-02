import React from 'react';

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
};

const LoadingSpinner = ({ size = "md", color = "indigo", className = "" }) => {
  const sizeClass = sizes[size] || sizes.md;
  const colorClass = `text-${color}-600`;
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-current ${sizeClass} ${colorClass}`}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
