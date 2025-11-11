// Application constants

export const APP_NAME = 'Weekly Planner';
export const APP_VERSION = '1.0.0';

// Days of the week
export const DAYS = [
  { index: 0, name: 'Monday', short: 'Mon', narrow: 'M' },
  { index: 1, name: 'Tuesday', short: 'Tue', narrow: 'T' },
  { index: 2, name: 'Wednesday', short: 'Wed', narrow: 'W' },
  { index: 3, name: 'Thursday', short: 'Thu', narrow: 'T' },
  { index: 4, name: 'Friday', short: 'Fri', narrow: 'F' },
  { index: 5, name: 'Saturday', short: 'Sat', narrow: 'S' },
  { index: 6, name: 'Sunday', short: 'Sun', narrow: 'S' }
];

// Task categories
export const TASK_CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  HEALTH: 'health',
  GENERAL: 'general'
};

export const TASK_CATEGORY_OPTIONS = [
  { value: 'general', label: '📋 General', color: '#718096' },
  { value: 'work', label: '💼 Work', color: '#667eea' },
  { value: 'personal', label: '👤 Personal', color: '#48bb78' },
  { value: 'health', label: '🏃 Health', color: '#ed8936' }
];

// Meal types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
};

export const MEAL_TYPE_OPTIONS = [
  { value: 'breakfast', label: '🌅 Breakfast', icon: '🌅' },
  { value: 'lunch', label: '☀️ Lunch', icon: '☀️' },
  { value: 'dinner', label: '🌙 Dinner', icon: '🌙' },
  { value: 'snack', label: '🍎 Snack', icon: '🍎' }
];

// Filter options
export const TASK_FILTERS = {
  ALL: 'all',
  COMPLETED: 'completed',
  PENDING: 'pending'
};

export const TASK_FILTER_OPTIONS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' }
];

// Sort options
export const TASK_SORT_OPTIONS = {
  TIME: 'time',
  NAME: 'name',
  CATEGORY: 'category'
};

export const TASK_SORT_LABELS = [
  { value: 'time', label: 'By Time' },
  { value: 'name', label: 'By Name' },
  { value: 'category', label: 'By Category' }
];

// Theme colors
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#48bb78',
  WARNING: '#ed8936',
  ERROR: '#e53e3e',
  INFO: '#4299e1',
  GRAY: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923'
  }
};

// Limits and defaults
export const LIMITS = {
  MAX_TASK_NAME_LENGTH: 200,
  MAX_TASK_NOTES_LENGTH: 1000,
  MAX_MEAL_NAME_LENGTH: 100,
  MAX_MEAL_NOTES_LENGTH: 500,
  MAX_DAILY_NOTES_LENGTH: 5000,
  MAX_WEEK_SUMMARY_LENGTH: 10000,
  MAX_ESTIMATED_MINUTES: 1440, // 24 hours
  MIN_CALORIES: 0,
  MAX_CALORIES: 10000,
  MIN_WATER_GLASSES: 0,
  MAX_WATER_GLASSES: 20
};

export const DEFAULTS = {
  WATER_GOAL: 8,
  CALORIE_GOAL: 2000,
  START_OF_WEEK: 1, // Monday
  AUTO_SAVE_DELAY: 2000, // 2 seconds
  CACHE_TTL: 300000, // 5 minutes
  BACKUP_RETENTION: 10 // Keep last 10 backups
};

// Validation patterns
export const PATTERNS = {
  TIME_12H: /^\d{1,2}:\d{2}\s?(AM|PM)$/i,
  TIME_24H: /^\d{1,2}:\d{2}$/,
  TIME_RANGE: /^\d{1,2}:\d{2}\s?(AM|PM)?\s?-\s?\d{1,2}:\d{2}\s?(AM|PM)?$/i,
  WEEK_ID: /^\d{4}-W\d{2}$/
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'planner-settings',
  CACHE: 'planner-cache',
  THEME: 'planner-theme'
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  NOT_FOUND: 'Item not found.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  PERMISSION_DENIED: 'Permission denied.',
  TIMEOUT: 'Request timed out. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  MEAL_CREATED: 'Meal added successfully!',
  MEAL_DELETED: 'Meal deleted successfully!',
  NOTES_SAVED: 'Notes saved successfully!',
  WEEK_ARCHIVED: 'Week archived successfully!',
  BACKUP_CREATED: 'Backup created successfully!',
  BACKUP_RESTORED: 'Backup restored successfully!'
};

// Keyboard shortcuts
export const SHORTCUTS = {
  NEW_TASK: 'Ctrl+N',
  SAVE: 'Ctrl+S',
  SEARCH: 'Ctrl+F',
  NEXT_DAY: 'Ctrl+Right',
  PREV_DAY: 'Ctrl+Left',
  TOGGLE_SIDEBAR: 'Ctrl+B'
};

// Time presets
export const TIME_PRESETS = [
  '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

// Export all as default object
export default {
  APP_NAME,
  APP_VERSION,
  DAYS,
  TASK_CATEGORIES,
  TASK_CATEGORY_OPTIONS,
  MEAL_TYPES,
  MEAL_TYPE_OPTIONS,
  TASK_FILTERS,
  TASK_FILTER_OPTIONS,
  TASK_SORT_OPTIONS,
  TASK_SORT_LABELS,
  COLORS,
  LIMITS,
  DEFAULTS,
  PATTERNS,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SHORTCUTS,
  TIME_PRESETS
};