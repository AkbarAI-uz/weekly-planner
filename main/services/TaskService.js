const logger = require('../utils/logger');
const { validateAndSanitizeTask, validateAndSanitizeTaskTemplate } = require('../utils/validators');

class TaskService {
  constructor(storage) {
    this.storage = storage;
  }

  async createTask(weekId, dayIndex, taskData) {
    try {
      const sanitized = validateAndSanitizeTask(taskData);

      const tasks = await this.storage.get('tasks') || [];
      const dayTasks = tasks.filter(t => t.weekId === weekId && t.dayIndex === dayIndex);
      
      const task = {
        id: Date.now(),
        weekId,
        dayIndex,
        time: sanitized.time,
        name: sanitized.name,
        isCompleted: false,
        order: dayTasks.length,
        category: sanitized.category || 'general',
        estimatedMinutes: sanitized.estimatedMinutes || null,
        notes: sanitized.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tasks.push(task);
      await this.storage.set('tasks', tasks);

      logger.info('Task created', { taskId: task.id, weekId, dayIndex });
      return task;
    } catch (error) {
      logger.error('Failed to create task', error);
      throw error;
    }
  }

  async updateTask(taskId, updates) {
    try {
      const sanitized = validateAndSanitizeTask(updates, true);
      
      const tasks = await this.storage.get('tasks') || [];
      const taskIndex = tasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...sanitized,
        updatedAt: new Date().toISOString()
      };

      await this.storage.set('tasks', tasks);

      logger.info('Task updated', { taskId });
      return tasks[taskIndex];
    } catch (error) {
      logger.error('Failed to update task', error);
      throw error;
    }
  }

  async toggleTask(taskId) {
    try {
      const tasks = await this.storage.get('tasks') || [];
      const taskIndex = tasks.findIndex(t => t.id === taskId);

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
      tasks[taskIndex].updatedAt = new Date().toISOString();

      await this.storage.set('tasks', tasks);

      logger.info('Task toggled', { taskId, completed: tasks[taskIndex].isCompleted });
      return tasks[taskIndex];
    } catch (error) {
      logger.error('Failed to toggle task', error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      const tasks = await this.storage.get('tasks') || [];
      const filteredTasks = tasks.filter(t => t.id !== taskId);

      await this.storage.set('tasks', filteredTasks);

      logger.info('Task deleted', { taskId });
      return true;
    } catch (error) {
      logger.error('Failed to delete task', error);
      throw error;
    }
  }

  async reorderTasks(weekId, dayIndex, taskIds) {
    try {
      const tasks = await this.storage.get('tasks') || [];
      
      taskIds.forEach((taskId, index) => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].order = index;
        }
      });

      await this.storage.set('tasks', tasks);

      logger.info('Tasks reordered', { weekId, dayIndex });
      return true;
    } catch (error) {
      logger.error('Failed to reorder tasks', error);
      throw error;
    }
  }

  async createTaskTemplate(templateData) {
    try {
      const sanitized = validateAndSanitizeTaskTemplate(templateData);
      
      const templates = await this.storage.get('taskTemplates') || [];
      
      const template = {
        id: Date.now(),
        name: sanitized.name,
        time: sanitized.time,
        category: sanitized.category || 'general',
        estimatedMinutes: sanitized.estimatedMinutes || null,
        isDefault: sanitized.isDefault || false,
        createdAt: new Date().toISOString()
      };

      templates.push(template);
      await this.storage.set('taskTemplates', templates);

      logger.info('Task template created', { templateId: template.id });
      return template;
    } catch (error) {
      logger.error('Failed to create task template', error);
      throw error;
    }
  }

  async getTaskTemplates() {
    try {
      return await this.storage.get('taskTemplates') || [];
    } catch (error) {
      logger.error('Failed to get task templates', error);
      throw error;
    }
  }

  async deleteTaskTemplate(templateId) {
    try {
      const templates = await this.storage.get('taskTemplates') || [];
      const filtered = templates.filter(t => t.id !== templateId);
      await this.storage.set('taskTemplates', filtered);

      logger.info('Task template deleted', { templateId });
      return true;
    } catch (error) {
      logger.error('Failed to delete task template', error);
      throw error;
    }
  }
}

module.exports = TaskService;