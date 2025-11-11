import React from 'react';

export default function MealItem({ meal, onDelete }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      transition: 'all 0.2s'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: '500',
          color: '#2d3748',
          marginBottom: '0.25rem'
        }}>
          {meal.foodName}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#718096'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🕐 {meal.time}
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: '600',
            color: '#ed8936'
          }}>
            🔥 {meal.calories} cal
          </span>
        </div>

        {meal.notes && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#f7fafc',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            color: '#4a5568',
            fontStyle: 'italic'
          }}>
            {meal.notes}
          </div>
        )}
      </div>

      <button
        onClick={onDelete}
        style={{
          padding: '0.375rem 0.75rem',
          background: 'transparent',
          color: '#e53e3e',
          border: '1px solid #fc8181',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: '500',
          transition: 'all 0.2s',
          marginLeft: '1rem'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#fff5f5';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        Delete
      </button>
    </div>
  );
}