import React, { useState } from 'react';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isHovering, setIsHovering] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      work: { bg: '#667eea', text: 'white' },
      personal: { bg: '#48bb78', text: 'white' },
      health: { bg: '#ed8936', text: 'white' },
      general: { bg: '#718096', text: 'white' }
    };
    return colors[category] || colors.general;
  };

  const categoryColor = getCategoryColor(task.category);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        background: task.isCompleted ? '#f0fff4' : 'white',
        border: `1px solid ${task.isCompleted ? '#9ae6b4' : '#e2e8f0'}`,
        borderLeft: `4px solid ${categoryColor.bg}`,
        borderRadius: '0.5rem',
        transition: 'all 0.2s',
        boxShadow: isHovering ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
        transform: isHovering ? 'translateY(-1px)' : 'translateY(0)'
      }}
    >
      {/* Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            accentColor: categoryColor.bg
          }}
        />
      </div>

      {/* Task Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: '500',
          fontSize: '0.9375rem',
          color: task.isCompleted ? '#718096' : '#2d3748',
          textDecoration: task.isCompleted ? 'line-through' : 'none',
          marginBottom: '0.375rem'
        }}>
          {task.name}
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: '#718096'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🕐 {task.time}
          </span>

          {task.estimatedMinutes && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ⏱️ {task.estimatedMinutes}min
            </span>
          )}

          <span
            style={{
              padding: '0.125rem 0.5rem',
              background: categoryColor.bg,
              color: categoryColor.text,
              borderRadius: '0.25rem',
              fontSize: '0.625rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.025em'
            }}
          >
            {task.category}
          </span>
        </div>

        {task.notes && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#f7fafc',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            color: '#4a5568',
            fontStyle: 'italic'
          }}>
            {task.notes}
          </div>
        )}
      </div>

      {/* Actions - Show on hover */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        opacity: isHovering ? 1 : 0,
        transition: 'opacity 0.2s'
      }}>
        <button
          onClick={() => onEdit(task)}
          style={{
            padding: '0.375rem 0.75rem',
            background: 'transparent',
            color: '#667eea',
            border: '1px solid #667eea',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#eef2ff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          style={{
            padding: '0.375rem 0.75rem',
            background: 'transparent',
            color: '#e53e3e',
            border: '1px solid #fc8181',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500',
            transition: 'all 0.2s'
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
    </div>
  );
}