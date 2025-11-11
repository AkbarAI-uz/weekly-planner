import React, { useState, useEffect } from 'react';
import { useWeekContext } from '../../contexts/WeekContext';
import { Card } from '../common/Button';

export default function WeekView({ onDaySelect }) {
  const { state } = useWeekContext();
  const [weekStats, setWeekStats] = useState(null);
  const [summary, setSummary] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (state.currentWeek) {
      setSummary(state.currentWeek.summary || '');
      loadWeekStats();
    }
  }, [state.currentWeek]);

  const loadWeekStats = async () => {
    try {
      const stats = await window.electronAPI.week.getStats(state.currentWeek.id);
      setWeekStats(stats);
    } catch (error) {
      console.error('Failed to load week stats:', error);
    }
  };

  const handleSaveSummary = async () => {
    try {
      await window.electronAPI.week.updateSummary(state.currentWeek.id, summary);
      alert('Summary saved!');
    } catch (error) {
      console.error('Failed to save summary:', error);
      alert('Failed to save summary');
    }
  };

  const getDayStats = (dayIndex) => {
    if (!state.currentWeek) return { tasks: 0, completed: 0, meals: 0, water: 0 };
    
    const dayTasks = state.currentWeek.tasks.filter(t => t.dayIndex === dayIndex);
    const dayMeals = state.currentWeek.meals.filter(m => m.dayIndex === dayIndex);
    const dayData = state.currentWeek.dailyData.find(d => d.dayIndex === dayIndex);
    
    return {
      tasks: dayTasks.length,
      completed: dayTasks.filter(t => t.isCompleted).length,
      meals: dayMeals.length,
      water: dayData?.waterGlasses || 0
    };
  };

  if (!state.currentWeek) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Week Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Week {state.currentWeek.weekId}
        </h2>
        <p style={{ color: '#718096' }}>
          Overview of your week's progress
        </p>
      </div>

      {/* Week Stats Cards */}
      {weekStats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Total Tasks
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
              {weekStats.totalTasks}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Completion Rate
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#48bb78' }}>
              {Math.round(weekStats.completionRate)}%
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Avg Water/Day
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4299e1' }}>
              {weekStats.avgWaterGlasses.toFixed(1)} 💧
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
              Avg Calories/Day
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ed8936' }}>
              {Math.round(weekStats.avgCalories)}
            </div>
          </div>
        </div>
      )}

      {/* Daily Overview Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Daily Overview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {days.map((day, index) => {
            const stats = getDayStats(index);
            const completionRate = stats.tasks > 0 
              ? Math.round((stats.completed / stats.tasks) * 100)
              : 0;

            return (
              <div
                key={index}
                onClick={() => onDaySelect(index)}
                style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ':hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  {day}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.5rem' }}>
                  {stats.completed}/{stats.tasks} tasks
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#e2e8f0',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: `${completionRate}%`,
                    height: '100%',
                    background: completionRate === 100 ? '#48bb78' : '#667eea',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#718096', display: 'flex', gap: '0.5rem' }}>
                  <span>🍽️ {stats.meals}</span>
                  <span>💧 {stats.water}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week Summary */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Week Summary
        </h3>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write your week summary, reflections, or notes..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button
            onClick={handleSaveSummary}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Save Summary
          </button>
        </div>
      </div>
    </div>
  );
}