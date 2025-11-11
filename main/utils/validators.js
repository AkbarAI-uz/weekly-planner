/**
 * Main Process Validators
 * Wrapper around shared validation for use in main process
 */

const {
  ValidationError,
  validateTask,
  validateMeal,
  validateDailyData,
  validateWeek,
  validateTaskTemplate,
  validateSettings,
  isValidDayIndex,
  sanitizeString,
  sanitizeNumber,
  sanitizeInteger
} = require('../../shared/utils/validation');

/**
 * Validate and sanitize task data
 */
function validateAndSanitizeTask(taskData, isUpdate = false) {
  // Validate
  validateTask(taskData, isUpdate);
  
  // Sanitize
  const sanitized = { ...taskData };
  
  if (taskData.name !== undefined) {
    sanitized.name = sanitizeString(taskData.name, 200);
  }
  
  if (taskData.time !== undefined) {
    sanitized.time = sanitizeString(taskData.time, 50);
  }
  
  if (taskData.notes !== undefined && taskData.notes !== null) {
    sanitized.notes = sanitizeString(taskData.notes, 1000);
  }
  
  if (taskData.estimatedMinutes !== undefined && taskData.estimatedMinutes !== null) {
    sanitized.estimatedMinutes = sanitizeInteger(taskData.estimatedMinutes, 1, 1440);
  }
  
  if (taskData.order !== undefined && taskData.order !== null) {
    sanitized.order = sanitizeInteger(taskData.order, 0);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize meal data
 */
function validateAndSanitizeMeal(mealData, isUpdate = false) {
  // Validate
  validateMeal(mealData, isUpdate);
  
  // Sanitize
  const sanitized = { ...mealData };
  
  if (mealData.foodName !== undefined) {
    sanitized.foodName = sanitizeString(mealData.foodName, 100);
  }
  
  if (mealData.time !== undefined) {
    sanitized.time = sanitizeString(mealData.time, 50);
  }
  
  if (mealData.calories !== undefined) {
    sanitized.calories = sanitizeInteger(mealData.calories, 0, 10000);
  }
  
  if (mealData.notes !== undefined && mealData.notes !== null) {
    sanitized.notes = sanitizeString(mealData.notes, 500);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize daily data
 */
function validateAndSanitizeDailyData(data, isUpdate = false) {
  // Validate
  validateDailyData(data, isUpdate);
  
  // Sanitize
  const sanitized = { ...data };
  
  if (data.waterGlasses !== undefined) {
    sanitized.waterGlasses = sanitizeInteger(data.waterGlasses, 0, 50);
  }
  
  if (data.notes !== undefined && data.notes !== null) {
    sanitized.notes = sanitizeString(data.notes, 2000);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize week data
 */
function validateAndSanitizeWeek(weekData, isUpdate = false) {
  // Validate
  validateWeek(weekData, isUpdate);
  
  // Sanitize
  const sanitized = { ...weekData };
  
  if (weekData.weekId !== undefined) {
    sanitized.weekId = sanitizeString(weekData.weekId, 10);
  }
  
  if (weekData.summary !== undefined && weekData.summary !== null) {
    sanitized.summary = sanitizeString(weekData.summary, 5000);
  }
  
  return sanitized;
}

/**
 * Validate and sanitize task template
 */
function validateAndSanitizeTaskTemplate(templateData, isUpdate = false) {
  // Validate
  validateTaskTemplate(templateData, isUpdate);
  
  // Sanitize
  const sanitized = { ...templateData };
  
  if (templateData.name !== undefined) {
    sanitized.name = sanitizeString(templateData.name, 100);
  }
  
  if (templateData.time !== undefined) {
    sanitized.time = sanitizeString(templateData.time, 50);
  }
  
  if (templateData.estimatedMinutes !== undefined && templateData.estimatedMinutes !== null) {
    sanitized.estimatedMinutes = sanitizeInteger(templateData.estimatedMinutes, 1, 1440);
  }
  
  return sanitized;
}

/**
 * Validate week ID and day index
 */
function validateWeekIdAndDayIndex(weekId, dayIndex) {
  if (!weekId || typeof weekId !== 'number') {
    throw new ValidationError('weekId', 'Valid week ID is required', weekId);
  }
  
  if (!isValidDayIndex(dayIndex)) {
    throw new ValidationError('dayIndex', 'Day index must be between 0 and 6', dayIndex);
  }
  
  return true;
}

/**
 * Validate task ID
 */
function validateTaskId(taskId) {
  if (!taskId || typeof taskId !== 'number') {
    throw new ValidationError('taskId', 'Valid task ID is required', taskId);
  }
  return true;
}

/**
 * Validate meal ID
 */
function validateMealId(mealId) {
  if (!mealId || typeof mealId !== 'number') {
    throw new ValidationError('mealId', 'Valid meal ID is required', mealId);
  }
  return true;
}

/**
 * Validate template ID
 */
function validateTemplateId(templateId) {
  if (!templateId || typeof templateId !== 'number') {
    throw new ValidationError('templateId', 'Valid template ID is required', templateId);
  }
  return true;
}

module.exports = {
  ValidationError,
  
  // Validate and sanitize functions
  validateAndSanitizeTask,
  validateAndSanitizeMeal,
  validateAndSanitizeDailyData,
  validateAndSanitizeWeek,
  validateAndSanitizeTaskTemplate,
  
  // Simple validators
  validateWeekIdAndDayIndex,
  validateTaskId,
  validateMealId,
  validateTemplateId,
  
  // Re-export shared validators
  validateTask,
  validateMeal,
  validateDailyData,
  validateWeek,
  validateTaskTemplate,
  validateSettings,
  
  // Re-export utilities
  sanitizeString,
  sanitizeNumber,
  sanitizeInteger
};