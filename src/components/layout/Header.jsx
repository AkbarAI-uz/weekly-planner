import { useWeekContext } from '../../contexts/WeekContext';
import { Button } from '../common/Button';

// Header Component
export function Header() {
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
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleCreateBackup}
          style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          💾 Backup
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleArchiveWeek}
          style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          📦 Archive Week
        </Button>
      </div>
    </header>
  );
}



