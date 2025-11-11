/**
 * Shared Default Constants
 * Used by both main and renderer processes
 */

// Task Categories
const TASK_CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  HEALTH: 'health',
  LEARNING: 'learning',
  SOCIAL: 'social',
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
  HOBBY: 'hobby',
  GENERAL: 'general'
};

const TASK_CATEGORY_LABELS = {
  [TASK_CATEGORIES.WORK]: 'Work',
  [TASK_CATEGORIES.PERSONAL]: 'Personal',
  [TASK_CATEGORIES.HEALTH]: 'Health',
  [TASK_CATEGORIES.LEARNING]: 'Learning',
  [TASK_CATEGORIES.SOCIAL]: 'Social',
  [TASK_CATEGORIES.HOUSEHOLD]: 'Household',
  [TASK_CATEGORIES.FINANCE]: 'Finance',
  [TASK_CATEGORIES.HOBBY]: 'Hobby',
  [TASK_CATEGORIES.GENERAL]: 'General'
};

const TASK_CATEGORY_COLORS = {
  [TASK_CATEGORIES.WORK]: '#3B82F6',      // blue
  [TASK_CATEGORIES.PERSONAL]: '#8B5CF6',  // purple
  [TASK_CATEGORIES.HEALTH]: '#10B981',    // green
  [TASK_CATEGORIES.LEARNING]: '#F59E0B',  // amber
  [TASK_CATEGORIES.SOCIAL]: '#EC4899',    // pink
  [TASK_CATEGORIES.HOUSEHOLD]: '#6366F1', // indigo
  [TASK_CATEGORIES.FINANCE]: '#14B8A6',   // teal
  [TASK_CATEGORIES.HOBBY]: '#F97316',     // orange
  [TASK_CATEGORIES.GENERAL]: '#6B7280'    // gray
};

// Meal Types
const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
};

const MEAL_TYPE_LABELS = {
  [MEAL_TYPES.BREAKFAST]: 'Breakfast',
  [MEAL_TYPES.LUNCH]: 'Lunch',
  [MEAL_TYPES.DINNER]: 'Dinner',
  [MEAL_TYPES.SNACK]: 'Snack'
};

const MEAL_TYPE_ICONS = {
  [MEAL_TYPES.BREAKFAST]: '🌅',
  [MEAL_TYPES.LUNCH]: '🌞',
  [MEAL_TYPES.DINNER]: '🌙',
  [MEAL_TYPES.SNACK]: '🍎'
};

// Days of Week
const DAYS_OF_WEEK = [
  { index: 0, short: 'Mon', full: 'Monday' },
  { index: 1, short: 'Tue', full: 'Tuesday' },
  { index: 2, short: 'Wed', full: 'Wednesday' },
  { index: 3, short: 'Thu', full: 'Thursday' },
  { index: 4, short: 'Fri', full: 'Friday' },
  { index: 5, short: 'Sat', full: 'Saturday' },
  { index: 6, short: 'Sun', full: 'Sunday' }
];

const DAY_NAMES = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
};

const DAY_NAMES_SHORT = {
  0: 'Mon',
  1: 'Tue',
  2: 'Wed',
  3: 'Thu',
  4: 'Fri',
  5: 'Sat',
  6: 'Sun'
};

// Time Periods
const TIME_PERIODS = {
  MORNING: 'morning',     // 5:00 AM - 11:59 AM
  AFTERNOON: 'afternoon', // 12:00 PM - 4:59 PM
  EVENING: 'evening',     // 5:00 PM - 9:59 PM
  NIGHT: 'night'          // 10:00 PM - 4:59 AM
};

const TIME_PERIOD_RANGES = {
  [TIME_PERIODS.MORNING]: { start: 5, end: 12 },
  [TIME_PERIODS.AFTERNOON]: { start: 12, end: 17 },
  [TIME_PERIODS.EVENING]: { start: 17, end: 22 },
  [TIME_PERIODS.NIGHT]: { start: 22, end: 5 }
};

// Default Values
const DEFAULTS = {
  // Week settings
  WEEK: {
    START_OF_WEEK: 1, // Monday
    AUTO_ARCHIVE_DAYS: 7
  },

  // Task settings
  TASK: {
    DEFAULT_CATEGORY: TASK_CATEGORIES.GENERAL,
    MAX_NAME_LENGTH: 200,
    MAX_NOTES_LENGTH: 1000,
    DEFAULT_ESTIMATED_MINUTES: null,
    MIN_ESTIMATED_MINUTES: 1,
    MAX_ESTIMATED_MINUTES: 1440 // 24 hours
  },

  // Meal settings
  MEAL: {
    DEFAULT_TYPE: MEAL_TYPES.BREAKFAST,
    MAX_FOOD_NAME_LENGTH: 100,
    MAX_NOTES_LENGTH: 500,
    MIN_CALORIES: 0,
    MAX_CALORIES: 10000,
    DEFAULT_CALORIE_GOAL: 2000
  },

  // Daily data settings
  DAILY: {
    DEFAULT_WATER_GOAL: 8,
    MIN_WATER_GLASSES: 0,
    MAX_WATER_GLASSES: 50,
    MAX_NOTES_LENGTH: 2000
  },

  // Time format
  TIME: {
    DEFAULT_FORMAT: '12h', // '12h' or '24h'
    DEFAULT_TIME: '09:00 AM'
  },

  // Pagination
  PAGINATION: {
    ARCHIVED_WEEKS_PER_PAGE: 10,
    TASKS_PER_PAGE: 50
  },

  // Backup settings
  BACKUP: {
    MAX_BACKUPS: 10,
    AUTO_BACKUP_INTERVAL: 3600000 // 1 hour
  }
};

// Validation Limits
const LIMITS = {
  TASK_NAME_MIN: 1,
  TASK_NAME_MAX: 200,
  TASK_NOTES_MAX: 1000,
  TASK_TIME_MIN: 1,
  TASK_TIME_MAX: 1440,
  
  MEAL_NAME_MIN: 1,
  MEAL_NAME_MAX: 100,
  MEAL_NOTES_MAX: 500,
  CALORIES_MIN: 0,
  CALORIES_MAX: 10000,
  
  WATER_MIN: 0,
  WATER_MAX: 50,
  DAILY_NOTES_MAX: 2000,
  
  WEEK_SUMMARY_MAX: 5000,
  TEMPLATE_NAME_MAX: 100
};

// Status Types
const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

// Priority Levels
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.URGENT]: 'Urgent'
};

const PRIORITY_COLORS = {
  [PRIORITY.LOW]: '#6B7280',    // gray
  [PRIORITY.MEDIUM]: '#3B82F6', // blue
  [PRIORITY.HIGH]: '#F59E0B',   // amber
  [PRIORITY.URGENT]: '#EF4444'  // red
};

// Theme Options
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Font Sizes
const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Sort Options
const SORT_OPTIONS = {
  TIME_ASC: 'time_asc',
  TIME_DESC: 'time_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  CATEGORY: 'category',
  COMPLETION: 'completion',
  PRIORITY: 'priority'
};

// View Modes
const VIEW_MODES = {
  DAY: 'day',
  WEEK: 'week',
  LIST: 'list'
};

// Export Format
const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf',
  MARKDOWN: 'md'
};

// Error Codes
const ERROR_CODES = {
  STORAGE_ERROR: 'STORAGE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVICE_ERROR: 'SERVICE_ERROR',
  IPC_ERROR: 'IPC_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE: 'DUPLICATE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

// Success Messages
const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  TASK_COMPLETED: 'Task marked as completed',
  
  MEAL_CREATED: 'Meal added successfully',
  MEAL_UPDATED: 'Meal updated successfully',
  MEAL_DELETED: 'Meal deleted successfully',
  
  WEEK_ARCHIVED: 'Week archived successfully',
  WEEK_UPDATED: 'Week updated successfully',
  
  BACKUP_CREATED: 'Backup created successfully',
  BACKUP_RESTORED: 'Backup restored successfully',
  
  SETTINGS_SAVED: 'Settings saved successfully'
};

// Error Messages
const ERROR_MESSAGES = {
  TASK_NOT_FOUND: 'Task not found',
  MEAL_NOT_FOUND: 'Meal not found',
  WEEK_NOT_FOUND: 'Week not found',
  TEMPLATE_NOT_FOUND: 'Template not found',
  
  INVALID_INPUT: 'Invalid input provided',
  REQUIRED_FIELD: 'This field is required',
  
  STORAGE_FAILED: 'Failed to save data',
  LOAD_FAILED: 'Failed to load data',
  
  BACKUP_FAILED: 'Failed to create backup',
  RESTORE_FAILED: 'Failed to restore backup',
  
  UNKNOWN_ERROR: 'An unexpected error occurred'
};

// Date Formats
const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  ISO: 'YYYY-MM-DD',
  TIME_12: 'hh:mm A',
  TIME_24: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss'
};

// Animation Durations (ms)
const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Z-Index Layers
const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
};

// Keyboard Shortcuts
const SHORTCUTS = {
  NEW_TASK: 'CommandOrControl+N',
  SAVE: 'CommandOrControl+S',
  DELETE: 'Delete',
  TOGGLE_COMPLETE: 'Space',
  SEARCH: 'CommandOrControl+F',
  ARCHIVE_WEEK: 'CommandOrControl+Shift+A',
  SETTINGS: 'CommandOrControl+,',
  REFRESH: 'CommandOrControl+R',
  CLOSE: 'CommandOrControl+W'
};

module.exports = {
  // Categories
  TASK_CATEGORIES,
  TASK_CATEGORY_LABELS,
  TASK_CATEGORY_COLORS,
  
  // Meals
  MEAL_TYPES,
  MEAL_TYPE_LABELS,
  MEAL_TYPE_ICONS,
  
  // Time
  DAYS_OF_WEEK,
  DAY_NAMES,
  DAY_NAMES_SHORT,
  TIME_PERIODS,
  TIME_PERIOD_RANGES,
  
  // Defaults
  DEFAULTS,
  LIMITS,
  
  // Status & Priority
  STATUS,
  PRIORITY,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  
  // UI Options
  THEMES,
  FONT_SIZES,
  SORT_OPTIONS,
  VIEW_MODES,
  EXPORT_FORMATS,
  
  // Messages
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  
  // Formatting
  DATE_FORMATS,
  ANIMATION_DURATION,
  Z_INDEX,
  SHORTCUTS
};