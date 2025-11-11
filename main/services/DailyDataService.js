const logger = require('../utils/logger');
const { validateAndSanitizeDailyData } = require('../utils/validators');

class DailyDataService {
  constructor(storage) {
    this.storage = storage;
  }

  async updateDailyData(weekId, dayIndex, updates) {
    try {
      const sanitized = validateAndSanitizeDailyData(updates, true);
      
      const dailyData = await this.storage.get('dailyData') || [];
      const dataIndex = dailyData.findIndex(
        d => d.weekId === weekId && d.dayIndex === dayIndex
      );

      if (dataIndex === -1) {
        throw new Error('Daily data not found');
      }

      dailyData[dataIndex] = {
        ...dailyData[dataIndex],
        ...sanitized,
        updatedAt: new Date().toISOString()
      };

      await this.storage.set('dailyData', dailyData);

      logger.info('Daily data updated', { weekId, dayIndex });
      return dailyData[dataIndex];
    } catch (error) {
      logger.error('Failed to update daily data', error);
      throw error;
    }
  }

  async getDailyData(weekId, dayIndex) {
    try {
      const dailyData = await this.storage.get('dailyData') || [];
      return dailyData.find(d => d.weekId === weekId && d.dayIndex === dayIndex);
    } catch (error) {
      logger.error('Failed to get daily data', error);
      throw error;
    }
  }
}

module.exports = DailyDataService;