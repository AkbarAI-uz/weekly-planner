import React, { createContext, useReducer, useEffect, useContext } from 'react';

const WeekContext = createContext();

const initialState = {
  currentWeek: null,
  archivedWeeks: [],
  loading: false,
  error: null
};

function weekReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_CURRENT_WEEK':
      return { ...state, currentWeek: action.payload, loading: false, error: null };
    
    case 'SET_ARCHIVED_WEEKS':
      return { ...state, archivedWeeks: action.payload };
    
    case 'UPDATE_WEEK_SUMMARY':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          summary: action.payload
        }
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          tasks: [...state.currentWeek.tasks, action.payload]
        }
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          tasks: state.currentWeek.tasks.map(t =>
            t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
          )
        }
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          tasks: state.currentWeek.tasks.filter(t => t.id !== action.payload)
        }
      };
    
    case 'ADD_MEAL':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          meals: [...state.currentWeek.meals, action.payload]
        }
      };
    
    case 'DELETE_MEAL':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          meals: state.currentWeek.meals.filter(m => m.id !== action.payload)
        }
      };
    
    case 'UPDATE_DAILY_DATA':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          dailyData: state.currentWeek.dailyData.map(d =>
            d.dayIndex === action.payload.dayIndex
              ? { ...d, ...action.payload.updates }
              : d
          )
        }
      };
    
    default:
      return state;
  }
}

export function WeekProvider({ children }) {
  const [state, dispatch] = useReducer(weekReducer, initialState);

  useEffect(() => {
    loadCurrentWeek();
    loadArchivedWeeks();
  }, []);

  const loadCurrentWeek = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const week = await window.electronAPI.week.getCurrent();
      dispatch({ type: 'SET_CURRENT_WEEK', payload: week });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadArchivedWeeks = async () => {
    try {
      const weeks = await window.electronAPI.week.getArchived();
      dispatch({ type: 'SET_ARCHIVED_WEEKS', payload: weeks });
    } catch (error) {
      console.error('Failed to load archived weeks:', error);
    }
  };

  return (
    <WeekContext.Provider value={{ state, dispatch, loadCurrentWeek, loadArchivedWeeks }}>
      {children}
    </WeekContext.Provider>
  );
}

export function useWeekContext() {
  const context = useContext(WeekContext);
  if (!context) {
    throw new Error('useWeekContext must be used within WeekProvider');
  }
  return context;
}