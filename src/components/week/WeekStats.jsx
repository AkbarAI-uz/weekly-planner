import React from 'react';
import { Card } from '../common/Button';

export default function WeekStats({ stats }) {
  if (!stats) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    return '#e53e3e';
  };

  const statsCards = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: '📝',
      color: '#667eea'
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: '✓',
      color: '#48bb78'
    },
    {
      label: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      icon: '📊',
      color: getScoreColor(stats.completionRate)
    },
    {
      label: 'Avg Water/Day',
      value: stats.avgWaterGlasses.toFixed(1),
      icon: '💧',
      color: '#4299e1'
    },
    {
      label: 'Avg Calories',
      value: Math.round(stats.avgCalories),
      icon: '🔥',
      color: '#ed8936'
    },
    {
      label: 'Hours Planned',
      value: Math.round(stats.totalMinutesPlanned / 60),
      icon: '⏱️',
      color: '#9f7aea'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem'
    }}>
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '0.5rem'
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#718096',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: stat.color
            }}>
              {stat.value}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}