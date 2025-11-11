export function useMeals() {
  const { state, dispatch } = useWeekContext();

  const createMeal = async (dayIndex, mealData) => {
    try {
      const meal = await window.electronAPI.meal.create(
        state.currentWeek.id,
        dayIndex,
        mealData
      );
      dispatch({ type: 'ADD_MEAL', payload: meal });
      return meal;
    } catch (error) {
      console.error('Failed to create meal:', error);
      throw error;
    }
  };

  const updateMeal = async (mealId, updates) => {
    try {
      const updatedMeal = await window.electronAPI.meal.update(mealId, updates);
      dispatch({ 
        type: 'UPDATE_MEAL', 
        payload: { id: mealId, updates } 
      });
      return updatedMeal;
    } catch (error) {
      console.error('Failed to update meal:', error);
      throw error;
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      await window.electronAPI.meal.delete(mealId);
      dispatch({ type: 'DELETE_MEAL', payload: mealId });
    } catch (error) {
      console.error('Failed to delete meal:', error);
      throw error;
    }
  };

  const getDayCalories = async (dayIndex) => {
    try {
      const calories = await window.electronAPI.meal.getCalories(
        state.currentWeek.id,
        dayIndex
      );
      return calories;
    } catch (error) {
      console.error('Failed to get day calories:', error);
      throw error;
    }
  };

  const getMealsByDay = (dayIndex) => {
    if (!state.currentWeek) return [];
    return state.currentWeek.meals.filter(m => m.dayIndex === dayIndex);
  };

  const getMealsByType = (dayIndex, mealType) => {
    if (!state.currentWeek) return [];
    return state.currentWeek.meals.filter(
      m => m.dayIndex === dayIndex && m.mealType === mealType
    );
  };

  return {
    meals: state.currentWeek?.meals || [],
    createMeal,
    updateMeal,
    deleteMeal,
    getDayCalories,
    getMealsByDay,
    getMealsByType
  };
}
