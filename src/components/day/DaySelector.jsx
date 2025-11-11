import React from 'react';

export default function DaySelector({ selectedDay, onDayChange, tasksPerDay = {} }) {
  const days = [
    { index: 0, name: 'Monday', short: 'Mon' },
    { index: 1, name: 'Tuesday', short: 'Tue' },
    { index: 2, name: 'Wednesday', short: 'Wed' },
    { index: 3, name: 'Thursday', short: 'Thu' },
    { index: 4, name: 'Friday', short: 'Fri' },
    { index: 5, name: 'Saturday', short: 'Sat' },
    { index: 6, name: 'Sunday', short: 'Sun' }
  ];

  const getCompletionRate = (dayIndex) => {
    const dayData = tasksPerDay[dayIndex];
    if (!dayData || dayData.total === 0) return 0;
    return Math.round((dayData.completed / dayData.total) * 100);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem',
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    }}>
      {days.map(day => {
        const isSelected = selectedDay === day.index;
        const completionRate = getCompletionRate(day.index);
        const dayData = tasksPerDay[day.index] || { total: 0, completed: 0 };

        return (
          <button
            key={day.index}
            onClick={() => onDayChange(day.index)}
            style={{
              flex: '1',
              minWidth: '80px',
              padding: '1rem 0.75rem',
              background: isSelected ? '#667eea' : '#f7fafc',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background progress indicator */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '3px',
              background: '#e2e8f0'
            }}>
              <div style={{
                height: '100%',
                width: `${completionRate}%`,
                background: isSelected ? 'white' : completionRate === 100 ? '#48bb78' : '#667eea',
                transition: 'width 0.3s'
              }} />
            </div>

            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: isSelected ? 'white' : '#718096',
              marginBottom: '0.5rem'
            }}>
              {day.short}
            </div>

            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: isSelected ? 'white' : '#2d3748',
              marginBottom: '0.25rem'
            }}>
              {day.index + 1}
            </div>

            <div style={{
              fontSize: '0.625rem',
              color: isSelected ? 'rgba(255,255,255,0.9)' : '#a0aec0'
            }}>
              {dayData.completed}/{dayData.total}
            </div>
          </button>
        );
      })}
    </div>
  );
}