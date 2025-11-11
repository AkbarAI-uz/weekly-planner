export function useArchive() {
  const { state, dispatch } = useWeekContext();

  const getArchivedWeeks = async () => {
    try {
      const weeks = await window.electronAPI.week.getArchived();
      dispatch({ type: 'SET_ARCHIVED_WEEKS', payload: weeks });
      return weeks;
    } catch (error) {
      console.error('Failed to get archived weeks:', error);
      throw error;
    }
  };

  const archiveCurrentWeek = async () => {
    try {
      const newWeek = await window.electronAPI.week.archive();
      dispatch({ type: 'SET_CURRENT_WEEK', payload: newWeek });
      await getArchivedWeeks();
      return newWeek;
    } catch (error) {
      console.error('Failed to archive week:', error);
      throw error;
    }
  };

  const getWeekStats = async (weekId) => {
    try {
      const stats = await window.electronAPI.week.getStats(weekId);
      return stats;
    } catch (error) {
      console.error('Failed to get week stats:', error);
      throw error;
    }
  };

  return {
    archivedWeeks: state.archivedWeeks,
    getArchivedWeeks,
    archiveCurrentWeek,
    getWeekStats
  };
}