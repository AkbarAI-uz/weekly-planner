import { useWeekContext } from '../contexts/WeekContext';

export function useTasks() {
  const { state, dispatch } = useWeekContext();

  const createTask = async (dayIndex, taskData) => {
    try {
      const task = await window.electronAPI.task.create(
        state.currentWeek.id,
        dayIndex,
        taskData
      );
      dispatch({ type: 'ADD_TASK', payload: task });
      return task;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      await window.electronAPI.task.update(taskId, updates);
      dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates } });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = await window.electronAPI.task.toggle(taskId);
      dispatch({ 
        type: 'UPDATE_TASK', 
        payload: { id: taskId, updates: { isCompleted: task.isCompleted } } 
      });
      return task;
    } catch (error) {
      console.error('Failed to toggle task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await window.electronAPI.task.delete(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const reorderTasks = async (dayIndex, taskIds) => {
    try {
      await window.electronAPI.task.reorder(state.currentWeek.id, dayIndex, taskIds);
      return true;
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      throw error;
    }
  };

  return {
    tasks: state.currentWeek?.tasks || [],
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks
  };
}