// Wrapper around window.electronAPI for cleaner API calls
// Provides error handling and logging

class APIService {
  constructor() {
    this.api = window.electronAPI;
  }

  // Check if running in Electron
  isElectron() {
    return this.api && this.api.isElectron;
  }

  // Error handler
  handleError(error, operation) {
    console.error(`API Error [${operation}]:`, error);
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }

  // Week Operations
  async getCurrentWeek() {
    try {
      return await this.api.week.getCurrent();
    } catch (error) {
      this.handleError(error, 'get current week');
    }
  }

  async archiveWeek() {
    try {
      return await this.api.week.archive();
    } catch (error) {
      this.handleError(error, 'archive week');
    }
  }

  async updateWeekSummary(weekId, summary) {
    try {
      return await this.api.week.updateSummary(weekId, summary);
    } catch (error) {
      this.handleError(error, 'update week summary');
    }
  }

  async getArchivedWeeks() {
    try {
      return await this.api.week.getArchived();
    } catch (error) {
      this.handleError(error, 'get archived weeks');
    }
  }

  async getWeekStats(weekId) {
    try {
      return await this.api.week.getStats(weekId);
    } catch (error) {
      this.handleError(error, 'get week stats');
    }
  }

  // Task Operations
  async createTask(weekId, dayIndex, taskData) {
    try {
      return await this.api.task.create(weekId, dayIndex, taskData);
    } catch (error) {
      this.handleError(error, 'create task');
    }
  }

  async updateTask(taskId, updates) {
    try {
      return await this.api.task.update(taskId, updates);
    } catch (error) {
      this.handleError(error, 'update task');
    }
  }

  async deleteTask(taskId) {
    try {
      return await this.api.task.delete(taskId);
    } catch (error) {
      this.handleError(error, 'delete task');
    }
  }

  async toggleTask(taskId) {
    try {
      return await this.api.task.toggle(taskId);
    } catch (error) {
      this.handleError(error, 'toggle task');
    }
  }

  async reorderTasks(weekId, dayIndex, taskIds) {
    try {
      return await this.api.task.reorder(weekId, dayIndex, taskIds);
    } catch (error) {
      this.handleError(error, 'reorder tasks');
    }
  }

  // Task Template Operations
  async createTaskTemplate(templateData) {
    try {
      return await this.api.taskTemplate.create(templateData);
    } catch (error) {
      this.handleError(error, 'create task template');
    }
  }

  async getTaskTemplates() {
    try {
      return await this.api.taskTemplate.getAll();
    } catch (error) {
      this.handleError(error, 'get task templates');
    }
  }

  async deleteTaskTemplate(templateId) {
    try {
      return await this.api.taskTemplate.delete(templateId);
    } catch (error) {
      this.handleError(error, 'delete task template');
    }
  }

  // Meal Operations
  async createMeal(weekId, dayIndex, mealData) {
    try {
      return await this.api.meal.create(weekId, dayIndex, mealData);
    } catch (error) {
      this.handleError(error, 'create meal');
    }
  }

  async updateMeal(mealId, updates) {
    try {
      return await this.api.meal.update(mealId, updates);
    } catch (error) {
      this.handleError(error, 'update meal');
    }
  }

  async deleteMeal(mealId) {
    try {
      return await this.api.meal.delete(mealId);
    } catch (error) {
      this.handleError(error, 'delete meal');
    }
  }

  async getDayCalories(weekId, dayIndex) {
    try {
      return await this.api.meal.getCalories(weekId, dayIndex);
    } catch (error) {
      this.handleError(error, 'get day calories');
    }
  }

  // Daily Data Operations
  async updateDailyData(weekId, dayIndex, updates) {
    try {
      return await this.api.dailyData.update(weekId, dayIndex, updates);
    } catch (error) {
      this.handleError(error, 'update daily data');
    }
  }

  async getDailyData(weekId, dayIndex) {
    try {
      return await this.api.dailyData.get(weekId, dayIndex);
    } catch (error) {
      this.handleError(error, 'get daily data');
    }
  }

  // Backup Operations
  async createBackup() {
    try {
      return await this.api.backup.create();
    } catch (error) {
      this.handleError(error, 'create backup');
    }
  }

  async listBackups() {
    try {
      return await this.api.backup.list();
    } catch (error) {
      this.handleError(error, 'list backups');
    }
  }

  async restoreBackup(backupName) {
    try {
      return await this.api.backup.restore(backupName);
    } catch (error) {
      this.handleError(error, 'restore backup');
    }
  }
}

// Export singleton instance
const apiService = new APIService();
export default apiService;