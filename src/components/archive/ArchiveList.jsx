import React from 'react';
import { Card } from '../common/Button';

export default function ArchiveList({ weeks, onSelectWeek }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeekDateRange = (weekId) => {
    // Parse weekId format: "2024-W45"
    const [year, weekNum] = weekId.split('-W');
    const week = parseInt(weekNum);
    
    // Calculate first day of the week
    const firstDay = new Date(year, 0, 1 + (week - 1) * 7);
    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);
    
    return {
      start: firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {weeks.map(week => {
        const dateRange = getWeekDateRange(week.weekId);
        
        return (
          <Card
            key={week.id}
            hover={true}
            onClick={() => onSelectWeek(week)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: '#667eea',
                color: 'white',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>
                {week.weekId}
              </div>
              
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#2d3748'
              }}>
                {dateRange.start} - {dateRange.end}
              </h3>
              
              <p style={{
                fontSize: '0.75rem',
                color: '#718096'
              }}>
                Archived: {formatDate(week.archivedAt)}
              </p>
            </div>

            {week.summary && (
              <p style={{
                fontSize: '0.875rem',
                color: '#4a5568',
                lineHeight: '1.5',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {week.summary}
              </p>
            )}

            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#718096'
            }}>
              <span>Click to view details</span>
              <span style={{ color: '#667eea' }}>→</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}