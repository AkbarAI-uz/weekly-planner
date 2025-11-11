module.exports = {
  app: {
    name: 'Weekly Planner',
    version: '2.0.0',
    author: 'Your Name',
    description: 'Advanced Weekly Planner Desktop Application'
  },

  window: {
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#667eea',
    show: true,
    center: true,
    resizable: true,
    frame: true,
    titleBarStyle: 'default'
  },

  storage: {
    fileName: 'planner-data.json',
    autoSave: true,
    autoSaveInterval: 5000, // 5 seconds
    prettyPrint: true
  },

  backup: {
    enabled: true,
    interval: 3600000, // 1 hour in milliseconds
    maxBackups: 10,
    directory: 'backups',
    onStartup: true,
    onShutdown: true
  },

  logging: {
    enabled: true,
    level: 'info', // debug, info, warn, error
    maxFileSize: 10485760, // 10MB
    maxFiles: 5,
    console: true,
    file: true
  },

  notifications: {
    enabled: true,
    sound: true,
    taskCompletion: true,
    weekArchived: true,
    dailyReminder: true,
    dailyReminderTime: '09:00' // 9 AM
  },

  week: {
    startOfWeek: 1, // 0 = Sunday, 1 = Monday
    autoArchive: false,
    archiveAfterDays: 7
  },

  goals: {
    defaultWaterGlasses: 8,
    defaultCalorieGoal: 2000,
    defaultTasksPerDay: 10
  },

  ui: {
    theme: 'light', // light, dark, auto
    accentColor: '#667eea',
    fontSize: 'medium', // small, medium, large
    compactMode: false,
    showCompletedTasks: true,
    animationsEnabled: true
  },

  shortcuts: {
    newTask: 'CommandOrControl+N',
    toggleTask: 'Space',
    deleteTask: 'Delete',
    archiveWeek: 'CommandOrControl+Shift+A',
    search: 'CommandOrControl+F',
    settings: 'CommandOrControl+,'
  },

  export: {
    defaultFormat: 'json', // json, csv, pdf
    includeArchived: false,
    includeStats: true
  },

  performance: {
    enableHardwareAcceleration: true,
    maxCachedWeeks: 10,
    debounceDelay: 300
  }
};