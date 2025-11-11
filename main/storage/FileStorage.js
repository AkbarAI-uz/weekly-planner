const fs = require('fs').promises;
const path = require('path');
const StorageManager = require('./StorageManager');
const logger = require('../utils/logger');

class FileStorage extends StorageManager {
  constructor(dataPath) {
    super();
    this.dataPath = dataPath;
    this.data = {};
  }

  async initialize() {
    try {
      const exists = await fs.access(this.dataPath).then(() => true).catch(() => false);
      
      if (exists) {
        const content = await fs.readFile(this.dataPath, 'utf8');
        this.data = JSON.parse(content);
        logger.info('Storage initialized', { dataPath: this.dataPath });
      } else {
        this.data = this.getDefaultData();
        await this.save();
        logger.info('Storage initialized with defaults');
      }
    } catch (error) {
      logger.error('Failed to initialize storage', error);
      this.data = this.getDefaultData();
      await this.save();
    }
  }

  async get(key) {
    return this.data[key] || null;
  }

  async set(key, value) {
    this.data[key] = value;
    await this.save();
    return value;
  }

  async delete(key) {
    delete this.data[key];
    await this.save();
  }

  async getAll(prefix) {
    if (!prefix) return this.data;
    
    return Object.keys(this.data)
      .filter(key => key.startsWith(prefix))
      .reduce((acc, key) => {
        acc[key] = this.data[key];
        return acc;
      }, {});
  }

  async save() {
    try {
      await fs.writeFile(
        this.dataPath,
        JSON.stringify(this.data, null, 2),
        'utf8'
      );
    } catch (error) {
      logger.error('Failed to save storage', error);
      throw error;
    }
  }

  getDefaultData() {
    return {
      version: '2.0.0',
      currentWeekId: null,
      weeks: [],
      tasks: [],
      meals: [],
      dailyData: [],
      taskTemplates: [],
      settings: {
        startOfWeek: 1,
        defaultWaterGoal: 8,
        defaultCalorieGoal: 2000,
        notifications: true,
        theme: 'light'
      }
    };
  }
}

module.exports = FileStorage;