import React, { useState, useEffect } from 'react';
import { useArchive } from '../../hooks/useMeals';
import ArchiveList from './ArchiveList';
import ArchiveItem from './ArchiveItem';
import { Loading } from '../common/Button';

export default function ArchiveView() {
  const { archivedWeeks, getArchivedWeeks, getWeekStats } = useArchive();
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weekDetails, setWeekDetails] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    loadArchive();
  }, []);

  const loadArchive = async () => {
    try {
      setLoading(true);
      await getArchivedWeeks();
    } catch (error) {
      console.error('Failed to load archive:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeekSelect = async (week) => {
    setSelectedWeek(week);
    setStatsLoading(true);
    
    try {
      const stats = await getWeekStats(week.id);
      setWeekDetails({ ...week, stats });
    } catch (error) {
      console.error('Failed to load week details:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedWeek(null);
    setWeekDetails(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem'
      }}>
        <Loading size="lg" text="Loading archive..." />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1.5rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {selectedWeek && (
            <button
              onClick={handleBackToList}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: '#667eea'
              }}
            >
              ←
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {selectedWeek ? `Week ${selectedWeek.weekId}` : '📦 Archive'}
            </h1>
            <p style={{ color: '#718096', fontSize: '0.875rem' }}>
              {selectedWeek 
                ? 'View archived week details' 
                : `${archivedWeeks.length} archived weeks`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        {!selectedWeek ? (
          archivedWeeks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#a0aec0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#4a5568' }}>
                No Archived Weeks
              </h3>
              <p>Completed weeks will appear here</p>
            </div>
          ) : (
            <ArchiveList 
              weeks={archivedWeeks} 
              onSelectWeek={handleWeekSelect} 
            />
          )
        ) : (
          statsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <Loading size="lg" />
            </div>
          ) : (
            weekDetails && <ArchiveItem week={weekDetails} />
          )
        )}
      </div>
    </div>
  );
}