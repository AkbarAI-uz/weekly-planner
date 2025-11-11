import React, { createContext, useReducer, useContext } from 'react';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  selectedTask: null,
  filter: 'all', // 'all', 'completed', 'pending'
  sortBy: 'time', // 'time', 'name', 'category'
  loading: false,
  error: null
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        )
      };

    case 'SELECT_TASK':
      return {
        ...state,
        selectedTask: action.payload
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Helper functions
  const getFilteredTasks = () => {
    let filtered = [...state.tasks];

    // Apply filter
    switch (state.filter) {
      case 'completed':
        filtered = filtered.filter(t => t.isCompleted);
        break;
      case 'pending':
        filtered = filtered.filter(t => !t.isCompleted);
        break;
      default:
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'time':
        default:
          return a.time.localeCompare(b.time);
      }
    });

    return filtered;
  };

  const getTasksByDay = (dayIndex) => {
    return state.tasks.filter(t => t.dayIndex === dayIndex);
  };

  const getTasksByCategory = (category) => {
    return state.tasks.filter(t => t.category === category);
  };

  const getCompletedCount = () => {
    return state.tasks.filter(t => t.isCompleted).length;
  };

  const getTotalMinutes = () => {
    return state.tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  };

  const value = {
    state,
    dispatch,
    getFilteredTasks,
    getTasksByDay,
    getTasksByCategory,
    getCompletedCount,
    getTotalMinutes
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}

export default TaskContext;