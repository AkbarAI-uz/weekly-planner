const { contextBridge, ipcRenderer } = require('electron');
const channels = require('../shared/constants/channels');

contextBridge.exposeInMainWorld('electronAPI', {
  // Week operations
  week: {
    getCurrent: () => ipcRenderer.invoke(channels.WEEK_GET_CURRENT),
    archive: () => ipcRenderer.invoke(channels.WEEK_ARCHIVE),
    updateSummary: (weekId, summary) => 
      ipcRenderer.invoke(channels.WEEK_UPDATE_SUMMARY, weekId, summary),
    getArchived: () => ipcRenderer.invoke(channels.WEEK_GET_ARCHIVED),
    getStats: (weekId) => ipcRenderer.invoke(channels.WEEK_GET_STATS, weekId)
  },

  // Task operations
  task: {
    create: (weekId, dayIndex, taskData) => 
      ipcRenderer.invoke(channels.TASK_CREATE, weekId, dayIndex, taskData),
    update: (taskId, updates) => 
      ipcRenderer.invoke(channels.TASK_UPDATE, taskId, updates),
    delete: (taskId) => 
      ipcRenderer.invoke(channels.TASK_DELETE, taskId),
    toggle: (taskId) => 
      ipcRenderer.invoke(channels.TASK_TOGGLE, taskId),
    reorder: (weekId, dayIndex, taskIds) => 
      ipcRenderer.invoke(channels.TASK_REORDER, weekId, dayIndex, taskIds)
  },

  // Task template operations
  taskTemplate: {
    create: (templateData) => 
      ipcRenderer.invoke(channels.TASK_TEMPLATE_CREATE, templateData),
    getAll: () => 
      ipcRenderer.invoke(channels.TASK_TEMPLATE_GET_ALL),
    delete: (templateId) => 
      ipcRenderer.invoke(channels.TASK_TEMPLATE_DELETE, templateId)
  },

  // Meal operations
  meal: {
    create: (weekId, dayIndex, mealData) => 
      ipcRenderer.invoke(channels.MEAL_CREATE, weekId, dayIndex, mealData),
    update: (mealId, updates) => 
      ipcRenderer.invoke(channels.MEAL_UPDATE, mealId, updates),
    delete: (mealId) => 
      ipcRenderer.invoke(channels.MEAL_DELETE, mealId),
    getCalories: (weekId, dayIndex) => 
      ipcRenderer.invoke(channels.MEAL_GET_CALORIES, weekId, dayIndex)
  },

  // Daily data operations
  dailyData: {
    update: (weekId, dayIndex, updates) => 
      ipcRenderer.invoke(channels.DAILY_DATA_UPDATE, weekId, dayIndex, updates),
    get: (weekId, dayIndex) => 
      ipcRenderer.invoke(channels.DAILY_DATA_GET, weekId, dayIndex)
  },

  // Backup operations
  backup: {
    create: () => ipcRenderer.invoke(channels.BACKUP_CREATE),
    list: () => ipcRenderer.invoke(channels.BACKUP_LIST),
    restore: (backupName) => ipcRenderer.invoke(channels.BACKUP_RESTORE, backupName)
  },

  // Analytics operations
  analytics: {
    getWeekStats: (weekId) => ipcRenderer.invoke(channels.ANALYTICS_GET_WEEK_STATS, weekId),
    getMonthStats: (startWeekId, endWeekId) => 
      ipcRenderer.invoke(channels.ANALYTICS_GET_MONTH_STATS, startWeekId, endWeekId),
    getTaskCompletion: (weekCount) => 
      ipcRenderer.invoke(channels.ANALYTICS_GET_TASK_COMPLETION, weekCount),
    getCategoryBreakdown: (weekId) => 
      ipcRenderer.invoke(channels.ANALYTICS_GET_CATEGORY_BREAKDOWN, weekId),
    getInsights: (weekId) => 
      ipcRenderer.invoke(channels.ANALYTICS_GET_TRENDS, weekId)
  },

  isElectron: true
});