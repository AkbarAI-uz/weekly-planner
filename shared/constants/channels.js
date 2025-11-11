// IPC Channel Constants
// shared/constants/channels.js

module.exports = {
  // Week channels
  WEEK_GET_CURRENT: 'week:get-current',
  WEEK_CREATE: 'week:create',
  WEEK_ARCHIVE: 'week:archive',
  WEEK_UPDATE_SUMMARY: 'week:update-summary',
  WEEK_GET_ARCHIVED: 'week:get-archived',
  WEEK_GET_STATS: 'week:get-stats',

  // Task channels
  TASK_CREATE: 'task:create',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',
  TASK_TOGGLE: 'task:toggle',
  TASK_REORDER: 'task:reorder',
  
  // Task template channels
  TASK_TEMPLATE_CREATE: 'task-template:create',
  TASK_TEMPLATE_GET_ALL: 'task-template:get-all',
  TASK_TEMPLATE_DELETE: 'task-template:delete',

  // Meal channels
  MEAL_CREATE: 'meal:create',
  MEAL_UPDATE: 'meal:update',
  MEAL_DELETE: 'meal:delete',
  MEAL_GET_CALORIES: 'meal:get-calories',

  // Daily data channels
  DAILY_DATA_UPDATE: 'daily-data:update',
  DAILY_DATA_GET: 'daily-data:get',

  // Backup channels
  BACKUP_CREATE: 'backup:create',
  BACKUP_LIST: 'backup:list',
  BACKUP_RESTORE: 'backup:restore'
};