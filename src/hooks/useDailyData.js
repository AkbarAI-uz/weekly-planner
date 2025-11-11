export function useDailyData() {
  const { state, dispatch } = useWeekContext();

  const updateDailyData = async (dayIndex, updates) => {
    try {
      const updatedData = await window.electronAPI.dailyData.update(
        state.currentWeek.id,
        dayIndex,
        updates
      );
      dispatch({ 
        type: 'UPDATE_DAILY_DATA', 
        payload: { dayIndex, updates } 
      });
      return updatedData;
    } catch (error) {
      console.error('Failed to update daily data:', error);
      throw error;
    }
  };

  const updateWaterGlasses = async (dayIndex, waterGlasses) => {
    return updateDailyData(dayIndex, { waterGlasses });
  };

  const incrementWater = async (dayIndex) => {
    const currentData = getDailyData(dayIndex);
    if (!currentData) return;
    
    const newCount = Math.min(currentData.waterGlasses + 1, 20); // Max 20 glasses
    return updateWaterGlasses(dayIndex, newCount);
  };

  const decrementWater = async (dayIndex) => {
    const currentData = getDailyData(dayIndex);
    if (!currentData) return;
    
    const newCount = Math.max(currentData.waterGlasses - 1, 0);
    return updateWaterGlasses(dayIndex, newCount);
  };

  const updateNotes = async (dayIndex, notes) => {
    return updateDailyData(dayIndex, { notes });
  };

  const getDailyData = (dayIndex) => {
    if (!state.currentWeek) return null;
    return state.currentWeek.dailyData.find(d => d.dayIndex === dayIndex);
  };

  const getAllDailyData = () => {
    return state.currentWeek?.dailyData || [];
  };

  const getWeekWaterAverage = () => {
    if (!state.currentWeek) return 0;
    const total = state.currentWeek.dailyData.reduce(
      (sum, d) => sum + d.waterGlasses, 
      0
    );
    return total / 7;
  };

  return {
    dailyData: state.currentWeek?.dailyData || [],
    updateDailyData,
    updateWaterGlasses,
    incrementWater,
    decrementWater,
    updateNotes,
    getDailyData,
    getAllDailyData,
    getWeekWaterAverage
  };
}