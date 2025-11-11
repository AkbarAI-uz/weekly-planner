const logger = require('../utils/logger');

class WeekService {
  constructor(storage) {
    this.storage = storage;
  }

  async getCurrentWeek() {
    try {
      const currentWeekId = await this.storage.get('currentWeekId');
      
      if (!currentWeekId) {
        return await this.createNewWeek();
      }

      const weeks = await this.storage.get('weeks') || [];
      const week = weeks.find(w => w.id === currentWeekId);

      if (!week) {
        return await this.createNewWeek();
      }

      const tasks = await this.getWeekTasks(week.id);
      const meals = await this.getWeekMeals(week.id);
      const dailyData = await this.getWeekDailyData(week.id);

      return {
        ...week,
        tasks,
        meals,
        dailyData
      };
    } catch (error) {
      logger.error('Failed to get current week', error);
      throw error;
    }
  }

  async createNewWeek() {
    try {
      const weekId = this.generateWeekId();
      const week = {
        id: Date.now(),
        weekId,
        summary: '',
        isCurrent: true,
        createdAt: new Date().toISOString(),
        archivedAt: null
      };

      const weeks = await this.storage.get('weeks') || [];
      weeks.push(week);
      await this.storage.set('weeks', weeks);
      await this.storage.set('currentWeekId', week.id);

      await this.initializeWeekDailyData(week.id);
      await this.loadTaskTemplates(week.id);

      logger.info('New week created', { weekId: week.weekId });
      return await this.getCurrentWeek();
    } catch (error) {
      logger.error('Failed to create new week', error);
      throw error;
    }
  }

  async archiveCurrentWeek() {
    try {
      const currentWeekId = await this.storage.get('currentWeekId');
      const weeks = await this.storage.get('weeks') || [];
      
      const weekIndex = weeks.findIndex(w => w.id === currentWeekId);
      if (weekIndex === -1) {
        throw new Error('Current week not found');
      }

      weeks[weekIndex].isCurrent = false;
      weeks[weekIndex].archivedAt = new Date().toISOString();
      
      await this.storage.set('weeks', weeks);
      await this.storage.set('currentWeekId', null);

      logger.info('Week archived', { weekId: weeks[weekIndex].weekId });

      return await this.createNewWeek();
    } catch (error) {
      logger.error('Failed to archive week', error);
      throw error;
    }
  }

  async updateWeekSummary(weekId, summary) {
    try {
      const weeks = await this.storage.get('weeks') || [];
      const weekIndex = weeks.findIndex(w => w.id === weekId);
      
      if (weekIndex === -1) {
        throw new Error('Week not found');
      }

      weeks[weekIndex].summary = summary;
      await this.storage.set('weeks', weeks);

      logger.info('Week summary updated', { weekId });
      return weeks[weekIndex];
    } catch (error) {
      logger.error('Failed to update week summary', error);
      throw error;
    }
  }

  async getArchivedWeeks() {
    try {
      const weeks = await this.storage.get('weeks') || [];
      return weeks
        .filter(w => !w.isCurrent && w.archivedAt)
        .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt));
    } catch (error) {
      logger.error('Failed to get archived weeks', error);
      throw error;
    }
  }

  async getWeekStats(weekId) {
    try {
      const tasks = await this.getWeekTasks(weekId);
      const meals = await this.getWeekMeals(weekId);
      const dailyData = await this.getWeekDailyData(weekId);

      const completedTasks = tasks.filter(t => t.isCompleted).length;
      const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
      const totalWater = dailyData.reduce((sum, d) => sum + d.waterGlasses, 0);

      return {
        totalTasks: tasks.length,
        completedTasks,
        completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
        avgWaterGlasses: totalWater / 7,
        avgCalories: totalCalories / 7,
        totalMinutesPlanned: tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)
      };
    } catch (error) {
      logger.error('Failed to get week stats', error);
      throw error;
    }
  }

  async getWeekTasks(weekId) {
    const tasks = await this.storage.get('tasks') || [];
    return tasks.filter(t => t.weekId === weekId);
  }

  async getWeekMeals(weekId) {
    const meals = await this.storage.get('meals') || [];
    return meals.filter(m => m.weekId === weekId);
  }

  async getWeekDailyData(weekId) {
    const dailyData = await this.storage.get('dailyData') || [];
    return dailyData.filter(d => d.weekId === weekId);
  }

  async initializeWeekDailyData(weekId) {
    const dailyData = await this.storage.get('dailyData') || [];
    
    for (let i = 0; i < 7; i++) {
      dailyData.push({
        id: Date.now() + i,
        weekId,
        dayIndex: i,
        waterGlasses: 0,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    await this.storage.set('dailyData', dailyData);
  }

  async loadTaskTemplates(weekId) {
    const templates = await this.storage.get('taskTemplates') || [];
    const defaultTemplates = templates.filter(t => t.isDefault);

    if (defaultTemplates.length === 0) return;

    const tasks = await this.storage.get('tasks') || [];
    let taskId = Date.now();

    for (const template of defaultTemplates) {
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        tasks.push({
          id: taskId++,
          weekId,
          dayIndex,
          time: template.time,
          name: template.name,
          isCompleted: false,
          order: tasks.filter(t => t.dayIndex === dayIndex).length,
          category: template.category,
          estimatedMinutes: template.estimatedMinutes,
          notes: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    await this.storage.set('tasks', tasks);
  }

  generateWeekId() {
    const now = new Date();
    const year = now.getFullYear();
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }
}

module.exports = WeekService;