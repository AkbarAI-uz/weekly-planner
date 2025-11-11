const logger = require('../utils/logger');
const { validateAndSanitizeMeal } = require('../utils/validators');

class MealService {
  constructor(storage) {
    this.storage = storage;
  }

  async createMeal(weekId, dayIndex, mealData) {
    try {
      const sanitized = validateAndSanitizeMeal(mealData);
      
      const meals = await this.storage.get('meals') || [];
      
      const meal = {
        id: Date.now(),
        weekId,
        dayIndex,
        mealType: sanitized.mealType,
        time: sanitized.time,
        foodName: sanitized.foodName,
        calories: sanitized.calories,
        notes: sanitized.notes || null,
        createdAt: new Date().toISOString()
      };

      meals.push(meal);
      await this.storage.set('meals', meals);

      logger.info('Meal created', { mealId: meal.id, weekId, dayIndex });
      return meal;
    } catch (error) {
      logger.error('Failed to create meal', error);
      throw error;
    }
  }

  async updateMeal(mealId, updates) {
    try {
      const sanitized = validateAndSanitizeMeal(updates, true);
      
      const meals = await this.storage.get('meals') || [];
      const mealIndex = meals.findIndex(m => m.id === mealId);

      if (mealIndex === -1) {
        throw new Error('Meal not found');
      }

      meals[mealIndex] = {
        ...meals[mealIndex],
        ...sanitized
      };

      await this.storage.set('meals', meals);

      logger.info('Meal updated', { mealId });
      return meals[mealIndex];
    } catch (error) {
      logger.error('Failed to update meal', error);
      throw error;
    }
  }

  async deleteMeal(mealId) {
    try {
      const meals = await this.storage.get('meals') || [];
      const filtered = meals.filter(m => m.id !== mealId);

      await this.storage.set('meals', filtered);

      logger.info('Meal deleted', { mealId });
      return true;
    } catch (error) {
      logger.error('Failed to delete meal', error);
      throw error;
    }
  }

  async getDayCalories(weekId, dayIndex) {
    try {
      const meals = await this.storage.get('meals') || [];
      const dayMeals = meals.filter(m => m.weekId === weekId && m.dayIndex === dayIndex);
      return dayMeals.reduce((sum, m) => sum + m.calories, 0);
    } catch (error) {
      logger.error('Failed to get day calories', error);
      throw error;
    }
  }
}

module.exports = MealService;