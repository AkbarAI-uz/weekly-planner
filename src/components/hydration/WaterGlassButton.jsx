import React, { useState } from 'react';

export default function WaterGlassButton({ index, isFilled, onClick }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        width: '100%',
        aspectRatio: '1',
        minHeight: '50px',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '1.75rem',
        background: isFilled 
          ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
          : '#e2e8f0',
        color: isFilled ? 'white' : '#cbd5e0',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isFilled ? '0 2px 4px rgba(66, 153, 225, 0.3)' : 'none',
        transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
      }}
      title={isFilled ? 'Click to remove' : 'Click to add'}
    >
      {/* Water droplet icon */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        filter: isFilled ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' : 'none'
      }}>
        💧
      </span>

      {/* Ripple effect on hover */}
      {isHovering && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          animation: 'ripple 0.6s ease-out'
        }} />
      )}

      {/* Fill animation */}
      {isFilled && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
          animation: 'fillUp 0.3s ease-out'
        }} />
      )}

      <style>
        {`
          @keyframes ripple {
            to {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }
          
          @keyframes fillUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}
      </style>
    </button>
  );
}