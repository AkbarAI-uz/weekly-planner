const logger = require('../utils/logger');

class AnalyticsService {
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * Get comprehensive statistics for a specific week
   */
  async getWeekStats(weekId) {
    try {
      const tasks = await this.getWeekTasks(weekId);
      const meals = await this.getWeekMeals(weekId);
      const dailyData = await this.getWeekDailyData(weekId);

      const completedTasks = tasks.filter(t => t.isCompleted).length;
      const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
      const totalWater = dailyData.reduce((sum, d) => sum + d.waterGlasses, 0);

      // Category breakdown
      const categoryStats = this.calculateCategoryStats(tasks);

      // Daily completion rates
      const dailyCompletion = this.calculateDailyCompletion(tasks);

      // Time distribution
      const timeStats = this.calculateTimeStats(tasks);

      return {
        summary: {
          totalTasks: tasks.length,
          completedTasks,
          completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
          totalMinutesPlanned: tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0),
          totalMinutesCompleted: tasks
            .filter(t => t.isCompleted)
            .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)
        },
        nutrition: {
          totalCalories,
          avgCaloriesPerDay: totalCalories / 7,
          totalMeals: meals.length,
          avgMealsPerDay: meals.length / 7
        },
        hydration: {
          totalWaterGlasses: totalWater,
          avgWaterPerDay: totalWater / 7,
          daysMetGoal: dailyData.filter(d => d.waterGlasses >= 8).length
        },
        categories: categoryStats,
        dailyCompletion,
        timeDistribution: timeStats
      };
    } catch (error) {
      logger.error('Failed to get week stats', error);
      throw error;
    }
  }

  /**
   * Get statistics for multiple weeks (month view)
   */
  async getMonthStats(startWeekId, endWeekId) {
    try {
      const weeks = await this.storage.get('weeks') || [];
      const relevantWeeks = weeks.filter(w => 
        w.weekId >= startWeekId && w.weekId <= endWeekId
      );

      const allStats = await Promise.all(
        relevantWeeks.map(w => this.getWeekStats(w.id))
      );

      return {
        weeks: relevantWeeks.length,
        summary: this.aggregateStats(allStats),
        weeklyBreakdown: allStats.map((stats, idx) => ({
          weekId: relevantWeeks[idx].weekId,
          ...stats.summary
        })),
        trends: this.calculateTrends(allStats)
      };
    } catch (error) {
      logger.error('Failed to get month stats', error);
      throw error;
    }
  }

  /**
   * Get task completion rate over time
   */
  async getTaskCompletionTrends(weekCount = 4) {
    try {
      const weeks = await this.storage.get('weeks') || [];
      const recentWeeks = weeks
        .filter(w => w.archivedAt)
        .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt))
        .slice(0, weekCount);

      const trends = await Promise.all(
        recentWeeks.map(async (week) => {
          const stats = await this.getWeekStats(week.id);
          return {
            weekId: week.weekId,
            completionRate: stats.summary.completionRate,
            totalTasks: stats.summary.totalTasks,
            completedTasks: stats.summary.completedTasks,
            date: week.archivedAt
          };
        })
      );

      return trends.reverse(); // Chronological order
    } catch (error) {
      logger.error('Failed to get task completion trends', error);
      throw error;
    }
  }

  /**
   * Get category breakdown across all tasks
   */
  async getCategoryBreakdown(weekId) {
    try {
      const tasks = await this.getWeekTasks(weekId);
      return this.calculateCategoryStats(tasks);
    } catch (error) {
      logger.error('Failed to get category breakdown', error);
      throw error;
    }
  }

  /**
   * Calculate productivity score (0-100)
   */
  async getProductivityScore(weekId) {
    try {
      const stats = await this.getWeekStats(weekId);
      
      // Weighted scoring
      const taskScore = stats.summary.completionRate * 0.4;
      const hydrationScore = (stats.hydration.daysMetGoal / 7) * 100 * 0.2;
      const consistencyScore = this.calculateConsistencyScore(stats.dailyCompletion) * 0.4;

      return Math.round(taskScore + hydrationScore + consistencyScore);
    } catch (error) {
      logger.error('Failed to calculate productivity score', error);
      throw error;
    }
  }

  /**
   * Get insights and recommendations
   */
  async getInsights(weekId) {
    try {
      const stats = await this.getWeekStats(weekId);
      const insights = [];

      // Task completion insights
      if (stats.summary.completionRate >= 80) {
        insights.push({
          type: 'success',
          message: 'Excellent week! You completed over 80% of your tasks.',
          icon: '🎉'
        });
      } else if (stats.summary.completionRate < 50) {
        insights.push({
          type: 'warning',
          message: 'Task completion is below 50%. Consider reducing your daily task load.',
          icon: '⚠️'
        });
      }

      // Hydration insights
      if (stats.hydration.avgWaterPerDay < 6) {
        insights.push({
          type: 'tip',
          message: 'Try to drink more water. Aim for at least 8 glasses per day.',
          icon: '💧'
        });
      }

      // Category insights
      const topCategory = Object.entries(stats.categories)
        .sort(([, a], [, b]) => b.total - a.total)[0];
      
      if (topCategory) {
        insights.push({
          type: 'info',
          message: `Most tasks this week were in "${topCategory[0]}" category.`,
          icon: '📊'
        });
      }

      // Consistency insights
      const dailyVariance = this.calculateVariance(
        stats.dailyCompletion.map(d => d.completionRate)
      );
      
      if (dailyVariance > 30) {
        insights.push({
          type: 'tip',
          message: 'Your task completion varies significantly by day. Try to maintain a more consistent schedule.',
          icon: '📈'
        });
      }

      return insights;
    } catch (error) {
      logger.error('Failed to get insights', error);
      throw error;
    }
  }

  // Helper methods
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

  calculateCategoryStats(tasks) {
    const stats = {};
    
    tasks.forEach(task => {
      const category = task.category || 'general';
      if (!stats[category]) {
        stats[category] = {
          total: 0,
          completed: 0,
          completionRate: 0,
          totalMinutes: 0
        };
      }
      
      stats[category].total++;
      if (task.isCompleted) stats[category].completed++;
      stats[category].totalMinutes += task.estimatedMinutes || 0;
    });

    // Calculate completion rates
    Object.keys(stats).forEach(category => {
      stats[category].completionRate = stats[category].total > 0
        ? (stats[category].completed / stats[category].total) * 100
        : 0;
    });

    return stats;
  }

  calculateDailyCompletion(tasks) {
    const daily = Array.from({ length: 7 }, (_, i) => ({
      dayIndex: i,
      total: 0,
      completed: 0,
      completionRate: 0
    }));

    tasks.forEach(task => {
      if (task.dayIndex >= 0 && task.dayIndex < 7) {
        daily[task.dayIndex].total++;
        if (task.isCompleted) daily[task.dayIndex].completed++;
      }
    });

    daily.forEach(day => {
      day.completionRate = day.total > 0
        ? (day.completed / day.total) * 100
        : 0;
    });

    return daily;
  }

  calculateTimeStats(tasks) {
    const morningTasks = tasks.filter(t => {
      const hour = this.extractHour(t.time);
      return hour >= 5 && hour < 12;
    });

    const afternoonTasks = tasks.filter(t => {
      const hour = this.extractHour(t.time);
      return hour >= 12 && hour < 17;
    });

    const eveningTasks = tasks.filter(t => {
      const hour = this.extractHour(t.time);
      return hour >= 17 && hour < 22;
    });

    return {
      morning: {
        total: morningTasks.length,
        completed: morningTasks.filter(t => t.isCompleted).length
      },
      afternoon: {
        total: afternoonTasks.length,
        completed: afternoonTasks.filter(t => t.isCompleted).length
      },
      evening: {
        total: eveningTasks.length,
        completed: eveningTasks.filter(t => t.isCompleted).length
      }
    };
  }

  extractHour(timeString) {
    const match = timeString.match(/(\d{1,2})/);
    return match ? parseInt(match[1]) : 12;
  }

  aggregateStats(statsArray) {
    const totals = {
      totalTasks: 0,
      completedTasks: 0,
      totalCalories: 0,
      totalWater: 0
    };

    statsArray.forEach(stats => {
      totals.totalTasks += stats.summary.totalTasks;
      totals.completedTasks += stats.summary.completedTasks;
      totals.totalCalories += stats.nutrition.totalCalories;
      totals.totalWater += stats.hydration.totalWaterGlasses;
    });

    totals.completionRate = totals.totalTasks > 0
      ? (totals.completedTasks / totals.totalTasks) * 100
      : 0;

    return totals;
  }

  calculateTrends(statsArray) {
    if (statsArray.length < 2) return { trend: 'stable', change: 0 };

    const completionRates = statsArray.map(s => s.summary.completionRate);
    const first = completionRates[0];
    const last = completionRates[completionRates.length - 1];
    const change = last - first;

    return {
      trend: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
      change: Math.round(change)
    };
  }

  calculateConsistencyScore(dailyCompletion) {
    const rates = dailyCompletion.map(d => d.completionRate);
    const avg = rates.reduce((sum, r) => sum + r, 0) / rates.length;
    const variance = this.calculateVariance(rates);
    
    // Lower variance = higher consistency = higher score
    return Math.max(0, 100 - variance);
  }

  calculateVariance(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
  }
}

module.exports = AnalyticsService;