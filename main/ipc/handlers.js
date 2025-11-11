const { ipcMain } = require('electron');
const logger = require('../utils/logger');
const notifications = require('../utils/notifications');

// Import channels - use require to ensure it works
const channels = require('../../shared/constants/channels');

function registerHandlers(services) {
  const { weekService, taskService, mealService, dailyDataService, backupManager } = services;

  try {
    // Week handlers
    ipcMain.handle(channels.WEEK_GET_CURRENT, async () => {
      return await weekService.getCurrentWeek();
    });

    ipcMain.handle(channels.WEEK_ARCHIVE, async () => {
      const newWeek = await weekService.archiveCurrentWeek();
      notifications.weekArchived();
      return newWeek;
    });

    ipcMain.handle(channels.WEEK_UPDATE_SUMMARY, async (event, weekId, summary) => {
      return await weekService.updateWeekSummary(weekId, summary);
    });

    ipcMain.handle(channels.WEEK_GET_ARCHIVED, async () => {
      return await weekService.getArchivedWeeks();
    });

    ipcMain.handle(channels.WEEK_GET_STATS, async (event, weekId) => {
      return await weekService.getWeekStats(weekId);
    });

    // Task handlers
    ipcMain.handle(channels.TASK_CREATE, async (event, weekId, dayIndex, taskData) => {
      return await taskService.createTask(weekId, dayIndex, taskData);
    });

    ipcMain.handle(channels.TASK_UPDATE, async (event, taskId, updates) => {
      return await taskService.updateTask(taskId, updates);
    });

    ipcMain.handle(channels.TASK_DELETE, async (event, taskId) => {
      return await taskService.deleteTask(taskId);
    });

    ipcMain.handle(channels.TASK_TOGGLE, async (event, taskId) => {
      const task = await taskService.toggleTask(taskId);
      if (task.isCompleted) {
        notifications.taskCompleted(task.name);
      }
      return task;
    });

    ipcMain.handle(channels.TASK_REORDER, async (event, weekId, dayIndex, taskIds) => {
      return await taskService.reorderTasks(weekId, dayIndex, taskIds);
    });

    ipcMain.handle(channels.TASK_TEMPLATE_CREATE, async (event, templateData) => {
      return await taskService.createTaskTemplate(templateData);
    });

    ipcMain.handle(channels.TASK_TEMPLATE_GET_ALL, async () => {
      return await taskService.getTaskTemplates();
    });

    ipcMain.handle(channels.TASK_TEMPLATE_DELETE, async (event, templateId) => {
      return await taskService.deleteTaskTemplate(templateId);
    });

    // Meal handlers
    ipcMain.handle(channels.MEAL_CREATE, async (event, weekId, dayIndex, mealData) => {
      return await mealService.createMeal(weekId, dayIndex, mealData);
    });

    ipcMain.handle(channels.MEAL_UPDATE, async (event, mealId, updates) => {
      return await mealService.updateMeal(mealId, updates);
    });

    ipcMain.handle(channels.MEAL_DELETE, async (event, mealId) => {
      return await mealService.deleteMeal(mealId);
    });

    ipcMain.handle(channels.MEAL_GET_CALORIES, async (event, weekId, dayIndex) => {
      return await mealService.getDayCalories(weekId, dayIndex);
    });

    // Daily data handlers
    ipcMain.handle(channels.DAILY_DATA_UPDATE, async (event, weekId, dayIndex, updates) => {
      return await dailyDataService.updateDailyData(weekId, dayIndex, updates);
    });

    ipcMain.handle(channels.DAILY_DATA_GET, async (event, weekId, dayIndex) => {
      return await dailyDataService.getDailyData(weekId, dayIndex);
    });

    // Backup handlers
    ipcMain.handle(channels.BACKUP_CREATE, async () => {
      return await backupManager.createBackup();
    });

    ipcMain.handle(channels.BACKUP_LIST, async () => {
      return await backupManager.listBackups();
    });

    ipcMain.handle(channels.BACKUP_RESTORE, async (event, backupName) => {
      return await backupManager.restoreBackup(backupName);
    });

    logger.info('IPC handlers registered successfully');
  } catch (error) {
    logger.error('Failed to register IPC handlers', error);
    throw error;
  }
}

module.exports = { registerHandlers };