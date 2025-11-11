import { useWeekContext } from '../../contexts/WeekContext';
// Sidebar Component
export function Sidebar({ selectedDay, onDaySelect }) {
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