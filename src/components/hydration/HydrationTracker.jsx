import React from 'react';
import WaterGlassButton from './WaterGlassButton';
import { Card } from '../common/Button';

export default function HydrationTracker({ 
  waterGlasses = 0, 
  onUpdate, 
  goal = 8,
  showProgress = true 
}) {
  const handleGlassClick = (index) => {
    // If clicking a filled glass, empty it and all after it
    // If clicking an empty glass, fill it
    const newCount = index < waterGlasses ? index : index + 1;
    onUpdate(newCount);
  };

  const progress = (waterGlasses / goal) * 100;
  const isGoalReached = waterGlasses >= goal;

  return (
    <Card>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            💧 Hydration Tracker
            {isGoalReached && <span style={{ fontSize: '1.5rem' }}>🎉</span>}
          </h3>
          
          <div style={{
            fontSize: '0.875rem',
            color: isGoalReached ? '#48bb78' : '#718096',
            fontWeight: '600'
          }}>
            {waterGlasses} / {goal} glasses
          </div>
        </div>

        {showProgress && (
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${Math.min(progress, 100)}%`,
              height: '100%',
              background: isGoalReached 
                ? 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)'
                : 'linear-gradient(90deg, #4299e1 0%, #3182ce 100%)',
              transition: 'width 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Animated shimmer effect when goal reached */}
              {isGoalReached && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 2s infinite'
                }} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Water Glasses Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
        gap: '0.75rem'
      }}>
        {[...Array(goal)].map((_, index) => (
          <WaterGlassButton
            key={index}
            index={index}
            isFilled={index < waterGlasses}
            onClick={() => handleGlassClick(index)}
          />
        ))}
      </div>

      {/* Tips or Encouragement */}
      {waterGlasses === 0 && (
        <p style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#edf2f7',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#4a5568',
          textAlign: 'center'
        }}>
          💡 Start your day with a glass of water!
        </p>
      )}

      {waterGlasses >= goal && (
        <p style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f0fff4',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#22543d',
          textAlign: 'center',
          border: '1px solid #9ae6b4'
        }}>
          🎉 Great job! You've reached your daily water goal!
        </p>
      )}

      {waterGlasses > 0 && waterGlasses < goal && (
        <p style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#ebf8ff',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#2c5282',
          textAlign: 'center'
        }}>
          Keep going! {goal - waterGlasses} more {goal - waterGlasses === 1 ? 'glass' : 'glasses'} to go!
        </p>
      )}

      <style>
        {`
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </Card>
  );
}