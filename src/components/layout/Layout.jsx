import React, { useState } from 'react';
import { useWeekContext } from '../../contexts/WeekContext';
import DayView from '../day/DayView';
import WeekView from '../week/WeekHeader';
import { Button } from '../common/Button';

// Header Component
function Header() {
  const { state, loadCurrentWeek } = useWeekContext();

  const handleArchiveWeek = async () => {
    if (window.confirm('Archive current week and start a new one?')) {
      try {
        await window.electronAPI.week.archive();
        await loadCurrentWeek();
      } catch (error) {
        console.error('Failed to archive week:', error);
        alert('Failed to archive week');
      }
    }
  };

  const handleCreateBackup = async () => {
    try {
      const backupPath = await window.electronAPI.backup.create();
      alert(`Backup created: ${backupPath}`);
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    }
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
          📅 Weekly Planner
        </h1>
        {state.currentWeek && (
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            Week {state.currentWeek.weekId}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={handleCreateBackup}
          style={{ 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          💾 Backup
        </button>
        <button 
          onClick={handleArchiveWeek}
          style={{ 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          📦 Archive Week
        </button>
      </div>
    </header>
  );
}

// Sidebar Component
function Sidebar({ selectedDay, onDaySelect }) {
  const { state } = useWeekContext();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getDayStats = (dayIndex) => {
    if (!state.currentWeek) return { tasks: 0, completed: 0 };
    
    const dayTasks = state.currentWeek.tasks.filter(t => t.dayIndex === dayIndex);
    const completed = dayTasks.filter(t => t.isCompleted).length;
    
    return { tasks: dayTasks.length, completed };
  };

  return (
    <aside style={{
      width: '250px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Week Overview Button */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => onDaySelect(null)}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: selectedDay === null ? '#667eea' : '#f7fafc',
            color: selectedDay === null ? 'white' : '#2d3748',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          📊 Week Overview
        </button>
      </div>

      {/* Days List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#718096', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Days
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {days.map((day, index) => {
            const stats = getDayStats(index);
            const isSelected = selectedDay === index;

            return (
              <button
                key={index}
                onClick={() => onDaySelect(index)}
                style={{
                  padding: '0.75rem',
                  background: isSelected ? '#667eea' : 'transparent',
                  color: isSelected ? 'white' : '#2d3748',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                  {day}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {stats.completed}/{stats.tasks} tasks
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// Main Layout Component
export default function Layout() {
  const { state } = useWeekContext();
  const [selectedDay, setSelectedDay] = useState(null);

  if (state.loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          color: 'white'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Loading your week...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f7fafc',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#4a5568' }}>{state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar selectedDay={selectedDay} onDaySelect={setSelectedDay} />
        <main style={{ flex: 1, overflow: 'auto', background: '#f7fafc' }}>
          {selectedDay === null ? (
            <WeekView onDaySelect={setSelectedDay} />
          ) : (
            <DayView dayIndex={selectedDay} />
          )}
        </main>
      </div>
    </div>
  );
}