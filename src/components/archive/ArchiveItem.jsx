import React from 'react';
import { Card } from '../common/Button';

export default function ArchiveItem({ week }) {
  const { stats } = week;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Week Info Card */}
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Week {week.weekId}
            </h2>
            <p style={{ color: '#718096', fontSize: '0.875rem' }}>
              Archived on {formatDate(week.archivedAt)}
            </p>
          </div>
          
          <div style={{
            padding: '0.5rem 1rem',
            background: stats.completionRate === 100 ? '#48bb78' : '#667eea',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1.25rem'
          }}>
            {Math.round(stats.completionRate)}% Complete
          </div>
        </div>

        {week.summary && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '0.5rem',
            borderLeft: '4px solid #667eea'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#4a5568' }}>
              Week Summary
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#2d3748', lineHeight: '1.6' }}>
              {week.summary}
            </p>
          </div>
        )}
      </Card>

      {/* Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Total Tasks
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#667eea' }}>
              {stats.totalTasks}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Completed
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#48bb78' }}>
              {stats.completedTasks}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Avg Water/Day
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#4299e1' }}>
              {stats.avgWaterGlasses.toFixed(1)}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Avg Calories
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ed8936' }}>
              {Math.round(stats.avgCalories)}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Time Planned
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#9f7aea' }}>
              {Math.round(stats.totalMinutesPlanned / 60)}h
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Efficiency
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: stats.completionRate >= 80 ? '#48bb78' : '#f6ad55' }}>
              {stats.completionRate >= 80 ? '🔥' : '📈'}
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Performance Insights
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>
              Task Completion Rate
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${stats.completionRate}%`,
                height: '100%',
                background: stats.completionRate >= 80 ? '#48bb78' : stats.completionRate >= 60 ? '#f6ad55' : '#fc8181',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>
                Productivity Score
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                {Math.round((stats.completionRate + (stats.avgWaterGlasses / 8 * 100)) / 2)}%
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>
                Health Score
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#48bb78' }}>
                {Math.round((stats.avgWaterGlasses / 8 * 100))}%
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>
                Planning Score
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9f7aea' }}>
                {stats.totalTasks > 0 ? Math.round((stats.totalMinutesPlanned / stats.totalTasks / 60) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}