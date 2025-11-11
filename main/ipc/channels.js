/**
 * IPC Channel Constants
 * Centralized channel definitions for main-renderer communication
 */

const CHANNELS = {
  // Week Management
  WEEK: {
    GET_CURRENT: 'week:get-current',
    CREATE: 'week:create',
    ARCHIVE: 'week:archive',
    UPDATE_SUMMARY: 'week:update-summary',
    GET_ARCHIVED: 'week:get-archived',
    GET_STATS: 'week:get-stats',
    DELETE_ARCHIVED: 'week:delete-archived',
    RESTORE_ARCHIVED: 'week:restore-archived'
  },

  // Task Management
  TASK: {
    CREATE: 'task:create',
    UPDATE: 'task:update',
    DELETE: 'task:delete',
    TOGGLE: 'task:toggle',
    REORDER: 'task:reorder',
    GET_BY_DAY: 'task:get-by-day',
    GET_BY_CATEGORY: 'task:get-by-category',
    DUPLICATE: 'task:duplicate'
  },

  // Task Templates
  TASK_TEMPLATE: {
    CREATE: 'task-template:create',
    UPDATE: 'task-template:update',
    DELETE: 'task-template:delete',
    GET_ALL: 'task-template:get-all',
    APPLY: 'task-template:apply'
  },

  // Meal Management
  MEAL: {
    CREATE: 'meal:create',
    UPDATE: 'meal:update',
    DELETE: 'meal:delete',
    GET_CALORIES: 'meal:get-calories',
    GET_BY_DAY: 'meal:get-by-day',
    GET_BY_TYPE: 'meal:get-by-type'
  },

  // Daily Data
  DAILY_DATA: {
    UPDATE: 'daily-data:update',
    GET: 'daily-data:get',
    INCREMENT_WATER: 'daily-data:increment-water',
    DECREMENT_WATER: 'daily-data:decrement-water'
  },

  // Backup & Restore
  BACKUP: {
    CREATE: 'backup:create',
    LIST: 'backup:list',
    RESTORE: 'backup:restore',
    DELETE: 'backup:delete',
    EXPORT: 'backup:export',
    IMPORT: 'backup:import'
  },

  // Analytics
  ANALYTICS: {
    GET_WEEK_STATS: 'analytics:get-week-stats',
    GET_MONTH_STATS: 'analytics:get-month-stats',
    GET_TASK_COMPLETION: 'analytics:get-task-completion',
    GET_CATEGORY_BREAKDOWN: 'analytics:get-category-breakdown',
    GET_TRENDS: 'analytics:get-trends'
  },

  // Settings
  SETTINGS: {
    GET: 'settings:get',
    UPDATE: 'settings:update',
    RESET: 'settings:reset',
    EXPORT: 'settings:export',
    IMPORT: 'settings:import'
  },

  // Window Management
  WINDOW: {
    MINIMIZE: 'window:minimize',
    MAXIMIZE: 'window:maximize',
    CLOSE: 'window:close',
    TOGGLE_FULLSCREEN: 'window:toggle-fullscreen',
    SET_ALWAYS_ON_TOP: 'window:set-always-on-top'
  },

  // System
  SYSTEM: {
    GET_INFO: 'system:get-info',
    OPEN_LOGS: 'system:open-logs',
    OPEN_DATA_FOLDER: 'system:open-data-folder',
    CHECK_UPDATES: 'system:check-updates'
  },

  // Notifications
  NOTIFICATION: {
    SHOW: 'notification:show',
    SHOW_TASK_REMINDER: 'notification:show-task-reminder',
    SHOW_WEEK_SUMMARY: 'notification:show-week-summary'
  }
};

// Flatten for backward compatibility
const FLAT_CHANNELS = {};

Object.keys(CHANNELS).forEach(category => {
  Object.keys(CHANNELS[category]).forEach(key => {
    FLAT_CHANNELS[`${category}_${key}`] = CHANNELS[category][key];
  });
});

module.exports = {
  CHANNELS,
  ...FLAT_CHANNELS,
  
  // Legacy exports for backward compatibility
  WEEK_GET_CURRENT: CHANNELS.WEEK.GET_CURRENT,
  WEEK_CREATE: CHANNELS.WEEK.CREATE,
  WEEK_ARCHIVE: CHANNELS.WEEK.ARCHIVE,
  WEEK_UPDATE_SUMMARY: CHANNELS.WEEK.UPDATE_SUMMARY,
  WEEK_GET_ARCHIVED: CHANNELS.WEEK.GET_ARCHIVED,
  WEEK_GET_STATS: CHANNELS.WEEK.GET_STATS,
  
  TASK_CREATE: CHANNELS.TASK.CREATE,
  TASK_UPDATE: CHANNELS.TASK.UPDATE,
  TASK_DELETE: CHANNELS.TASK.DELETE,
  TASK_TOGGLE: CHANNELS.TASK.TOGGLE,
  TASK_REORDER: CHANNELS.TASK.REORDER,
  
  TASK_TEMPLATE_CREATE: CHANNELS.TASK_TEMPLATE.CREATE,
  TASK_TEMPLATE_GET_ALL: CHANNELS.TASK_TEMPLATE.GET_ALL,
  TASK_TEMPLATE_DELETE: CHANNELS.TASK_TEMPLATE.DELETE,
  
  MEAL_CREATE: CHANNELS.MEAL.CREATE,
  MEAL_UPDATE: CHANNELS.MEAL.UPDATE,
  MEAL_DELETE: CHANNELS.MEAL.DELETE,
  MEAL_GET_CALORIES: CHANNELS.MEAL.GET_CALORIES,
  
  DAILY_DATA_UPDATE: CHANNELS.DAILY_DATA.UPDATE,
  DAILY_DATA_GET: CHANNELS.DAILY_DATA.GET,
  
  BACKUP_CREATE: CHANNELS.BACKUP.CREATE,
  BACKUP_LIST: CHANNELS.BACKUP.LIST,
  BACKUP_RESTORE: CHANNELS.BACKUP.RESTORE
};