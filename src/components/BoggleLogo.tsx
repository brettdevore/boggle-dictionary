import React from 'react';

const BoggleLogo: React.FC = () => {
  return (
    <div className="boggle-logo">
      <div className="logo-grid">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 4x4 grid with thin, soft lines */}
          {/* Vertical lines */}
          <line x1="16" y1="8" x2="16" y2="56" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          <line x1="32" y1="8" x2="32" y2="56" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          <line x1="48" y1="8" x2="48" y2="56" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          
          {/* Horizontal lines */}
          <line x1="8" y1="16" x2="56" y2="16" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          <line x1="8" y1="32" x2="56" y2="32" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          <line x1="8" y1="48" x2="56" y2="48" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          
          {/* Outer border */}
          <rect x="8" y="8" width="48" height="48" fill="none" stroke="#a8a29e" strokeWidth="0.5" opacity="0.7"/>
          
          {/* Small letters in the four primary squares */}
          <text x="24" y="26" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="400" fill="#9c9691" opacity="0.8">B</text>
          <text x="40" y="26" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="400" fill="#9c9691" opacity="0.8">O</text>
          <text x="24" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="400" fill="#9c9691" opacity="0.8">G</text>
          <text x="40" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="400" fill="#9c9691" opacity="0.8">L</text>
        </svg>
      </div>
      <div className="logo-text">
        <span className="logo-title">BOGGLE</span>
      </div>
    </div>
  );
};

export default BoggleLogo; 
 