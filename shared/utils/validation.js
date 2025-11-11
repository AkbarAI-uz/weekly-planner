const { TASK_CATEGORIES, MEAL_TYPES, LIMITS, DEFAULTS } = require('../constants/defaults');

/**
 * Validation Error Class
 */
class ValidationError extends Error {
  constructor(field, message, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.errors = [{ field, message, value }];
  }

  addError(field, message, value = null) {
    this.errors.push({ field, message, value });
    return this;
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  getErrors() {
    return this.errors;
  }
}

/**
 * Validation Helper Functions
 */

// String validators
function isString(value) {
  return typeof value === 'string';
}

function isNonEmptyString(value) {
  return isString(value) && value.trim().length > 0;
}

function hasMaxLength(value, maxLength) {
  return !value || value.length <= maxLength;
}

function hasMinLength(value, minLength) {
  return value && value.length >= minLength;
}

// Number validators
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isPositiveNumber(value) {
  return isNumber(value) && value >= 0;
}

function isInRange(value, min, max) {
  return isNumber(value) && value >= min && value <= max;
}

// Boolean validators
function isBoolean(value) {
  return typeof value === 'boolean';
}

// Date validators
function isValidDate(value) {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
}

function isISOString(value) {
  return isString(value) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
}

// Time validators
function isValidTime(timeString) {
  // Accepts formats: "9:00 AM", "09:00 AM", "9:00", "09:00", "9:00 AM - 10:00 AM"
  if (!isString(timeString)) return false;
  
  const patterns = [
    /^\d{1,2}:\d{2}\s?(AM|PM)?$/i,                    // 9:00 AM or 9:00
    /^\d{1,2}:\d{2}\s?(AM|PM)?\s?-\s?\d{1,2}:\d{2}\s?(AM|PM)?$/i  // 9:00 AM - 10:00 AM
  ];
  
  return patterns.some(pattern => pattern.test(timeString.trim()));
}

// Category validators
function isValidTaskCategory(category) {
  return Object.values(TASK_CATEGORIES).includes(category);
}

function isValidMealType(mealType) {
  return Object.values(MEAL_TYPES).includes(mealType);
}

// Day index validator
function isValidDayIndex(dayIndex) {
  return isInteger(dayIndex) && dayIndex >= 0 && dayIndex <= 6;
}

/**
 * Task Validation
 */
function validateTask(task, isUpdate = false) {
  const errors = [];

  // Task name
  if (!isUpdate || task.name !== undefined) {
    if (!task.name) {
      errors.push({ field: 'name', message: 'Task name is required' });
    } else if (!isNonEmptyString(task.name)) {
      errors.push({ field: 'name', message: 'Task name must be a non-empty string' });
    } else if (!hasMaxLength(task.name, LIMITS.TASK_NAME_MAX)) {
      errors.push({ 
        field: 'name', 
        message: `Task name must not exceed ${LIMITS.TASK_NAME_MAX} characters` 
      });
    }
  }

  // Task time
  if (!isUpdate || task.time !== undefined) {
    if (!task.time) {
      errors.push({ field: 'time', message: 'Task time is required' });
    } else if (!isValidTime(task.time)) {
      errors.push({ 
        field: 'time', 
        message: 'Invalid time format. Use formats like "9:00 AM" or "09:00"' 
      });
    }
  }

  // Category
  if (task.category !== undefined && task.category !== null) {
    if (!isValidTaskCategory(task.category)) {
      errors.push({ 
        field: 'category', 
        message: `Invalid category. Must be one of: ${Object.values(TASK_CATEGORIES).join(', ')}` 
      });
    }
  }

  // Estimated minutes
  if (task.estimatedMinutes !== undefined && task.estimatedMinutes !== null) {
    if (!isPositiveNumber(task.estimatedMinutes)) {
      errors.push({ 
        field: 'estimatedMinutes', 
        message: 'Estimated minutes must be a positive number' 
      });
    } else if (!isInRange(task.estimatedMinutes, LIMITS.TASK_TIME_MIN, LIMITS.TASK_TIME_MAX)) {
      errors.push({ 
        field: 'estimatedMinutes', 
        message: `Estimated minutes must be between ${LIMITS.TASK_TIME_MIN} and ${LIMITS.TASK_TIME_MAX}` 
      });
    }
  }

  // Notes
  if (task.notes !== undefined && task.notes !== null) {
    if (!hasMaxLength(task.notes, LIMITS.TASK_NOTES_MAX)) {
      errors.push({ 
        field: 'notes', 
        message: `Notes must not exceed ${LIMITS.TASK_NOTES_MAX} characters` 
      });
    }
  }

  // Order
  if (task.order !== undefined && task.order !== null) {
    if (!isInteger(task.order) || task.order < 0) {
      errors.push({ 
        field: 'order', 
        message: 'Order must be a non-negative integer' 
      });
    }
  }

  // Is completed
  if (task.isCompleted !== undefined && !isBoolean(task.isCompleted)) {
    errors.push({ 
      field: 'isCompleted', 
      message: 'isCompleted must be a boolean' 
    });
  }

  if (errors.length > 0) {
    const error = new ValidationError(errors[0].field, errors[0].message);
    errors.slice(1).forEach(err => error.addError(err.field, err.message));
    throw error;
  }

  return true;
}

/**
 * Meal Validation
 */
function validateMeal(meal, isUpdate = false) {
  const errors = [];

  // Food name
  if (!isUpdate || meal.foodName !== undefined) {
    if (!meal.foodName) {
      errors.push({ field: 'foodName', message: 'Food name is required' });
    } else if (!isNonEmptyString(meal.foodName)) {
      errors.push({ field: 'foodName', message: 'Food name must be a non-empty string' });
    } else if (!hasMaxLength(meal.foodName, LIMITS.MEAL_NAME_MAX)) {
      errors.push({ 
        field: 'foodName', 
        message: `Food name must not exceed ${LIMITS.MEAL_NAME_MAX} characters` 
      });
    }
  }

  // Calories
  if (!isUpdate || meal.calories !== undefined) {
    if (meal.calories === undefined || meal.calories === null) {
      errors.push({ field: 'calories', message: 'Calories are required' });
    } else if (!isNumber(meal.calories)) {
      errors.push({ field: 'calories', message: 'Calories must be a number' });
    } else if (!isInRange(meal.calories, LIMITS.CALORIES_MIN, LIMITS.CALORIES_MAX)) {
      errors.push({ 
        field: 'calories', 
        message: `Calories must be between ${LIMITS.CALORIES_MIN} and ${LIMITS.CALORIES_MAX}` 
      });
    }
  }

  // Meal type
  if (!isUpdate || meal.mealType !== undefined) {
    if (!meal.mealType) {
      errors.push({ field: 'mealType', message: 'Meal type is required' });
    } else if (!isValidMealType(meal.mealType)) {
      errors.push({ 
        field: 'mealType', 
        message: `Invalid meal type. Must be one of: ${Object.values(MEAL_TYPES).join(', ')}` 
      });
    }
  }

  // Time
  if (!isUpdate || meal.time !== undefined) {
    if (!meal.time) {
      errors.push({ field: 'time', message: 'Meal time is required' });
    } else if (!isValidTime(meal.time)) {
      errors.push({ 
        field: 'time', 
        message: 'Invalid time format. Use formats like "9:00 AM" or "09:00"' 
      });
    }
  }

  // Notes
  if (meal.notes !== undefined && meal.notes !== null) {
    if (!hasMaxLength(meal.notes, LIMITS.MEAL_NOTES_MAX)) {
      errors.push({ 
        field: 'notes', 
        message: `Notes must not exceed ${LIMITS.MEAL_NOTES_MAX} characters` 
      });
    }
  }

  if (errors.length > 0) {
    const error = new ValidationError(errors[0].field, errors[0].message);
    errors.slice(1).forEach(err => error.addError(err.field, err.message));
    throw error;
  }

  return true;
}

/**
 * Daily Data Validation
 */
function validateDailyData(data, isUpdate = false) {
  const errors = [];

  // Water glasses
  if (data.waterGlasses !== undefined && data.waterGlasses !== null) {
    if (!isInteger(data.waterGlasses)) {
      errors.push({ 
        field: 'waterGlasses', 
        message: 'Water glasses must be an integer' 
      });
    } else if (!isInRange(data.waterGlasses, LIMITS.WATER_MIN, LIMITS.WATER_MAX)) {
      errors.push({ 
        field: 'waterGlasses', 
        message: `Water glasses must be between ${LIMITS.WATER_MIN} and ${LIMITS.WATER_MAX}` 
      });
    }
  }

  // Notes
  if (data.notes !== undefined && data.notes !== null) {
    if (!isString(data.notes)) {
      errors.push({ field: 'notes', message: 'Notes must be a string' });
    } else if (!hasMaxLength(data.notes, LIMITS.DAILY_NOTES_MAX)) {
      errors.push({ 
        field: 'notes', 
        message: `Notes must not exceed ${LIMITS.DAILY_NOTES_MAX} characters` 
      });
    }
  }

  if (errors.length > 0) {
    const error = new ValidationError(errors[0].field, errors[0].message);
    errors.slice(1).forEach(err => error.addError(err.field, err.message));
    throw error;
  }

  return true;
}

/**
 * Week Validation
 */
function validateWeek(week, isUpdate = false) {
  const errors = [];

  // Week ID format
  if (!isUpdate || week.weekId !== undefined) {
    if (week.weekId && !isString(week.weekId)) {
      errors.push({ field: 'weekId', message: 'Week ID must be a string' });
    } else if (week.weekId && !/^\d{4}-W\d{2}$/.test(week.weekId)) {
      errors.push({ 
        field: 'weekId', 
        message: 'Invalid week ID format. Expected format: YYYY-Www (e.g., 2024-W45)' 
      });
    }
  }

  // Summary
  if (week.summary !== undefined && week.summary !== null) {
    if (!isString(week.summary)) {
      errors.push({ field: 'summary', message: 'Summary must be a string' });
    } else if (!hasMaxLength(week.summary, LIMITS.WEEK_SUMMARY_MAX)) {
      errors.push({ 
        field: 'summary', 
        message: `Summary must not exceed ${LIMITS.WEEK_SUMMARY_MAX} characters` 
      });
    }
  }

  // Is current
  if (week.isCurrent !== undefined && !isBoolean(week.isCurrent)) {
    errors.push({ field: 'isCurrent', message: 'isCurrent must be a boolean' });
  }

  if (errors.length > 0) {
    const error = new ValidationError(errors[0].field, errors[0].message);
    errors.slice(1).forEach(err => error.addError(err.field, err.message));
    throw error;
  }

  return true;
}

/**
 * Task Template Validation
 */
function validateTaskTemplate(template, isUpdate = false) {
  const errors = [];

  // Template name
  if (!isUpdate || template.name !== undefined) {
    if (!template.name) {
      errors.push({ field: 'name', message: 'Template name is required' });
    } else if (!isNonEmptyString(template.name)) {
      errors.push({ field: 'name', message: 'Template name must be a non-empty string' });
    } else if (!hasMaxLength(template.name, LIMITS.TEMPLATE_NAME_MAX)) {
      errors.push({ 
        field: 'name', 
        message: `Template name must not exceed ${LIMITS.TEMPLATE_NAME_MAX} characters` 
      });
    }
  }

  // Time
  if (!isUpdate || template.time !== undefined) {
    if (!template.time) {
      errors.push({ field: 'time', message: 'Time is required' });
    } else if (!isValidTime(template.time)) {
      errors.push({ 
        field: 'time', 
        message: 'Invalid time format. Use formats like "9:00 AM" or "09:00"' 
      });
    }
  }

  // Category
  if (template.category !== undefined && template.category !== null) {
    if (!isValidTaskCategory(template.category)) {
      errors.push({ 
        field: 'category', 
        message: `Invalid category. Must be one of: ${Object.values(TASK_CATEGORIES).join(', ')}` 
      });
    }
  }

  // Is default
  if (template.isDefault !== undefined && !isBoolean(template.isDefault)) {
    errors.push({ field: 'isDefault', message: 'isDefault must be a boolean' });
  }

  if (errors.length > 0) {
    const error = new ValidationError(errors[0].field, errors[0].message);
    errors.slice(1).forEach(err => error.addError(err.field, err.message));
    throw error;
  }

  return true;
}

/**
 * Settings Validation
 */
function validateSettings(settings) {
  const errors = [];

  // Start of week
  if (settings.startOfWeek !== undefined) {
    if (!isInteger(settings.startOfWeek) || !isInRange(settings.startOfWeek, 0, 6)) {
      errors.push({ 
        field: 'startOfWeek', 
        message: 'Start of week must be an integer between 0 (Sunday) and 6 (Saturday)' 
      });
    }
  }

  // Water goal
  if (settings.defaultWaterGoal !== undefined) {
    if (!isPositiveNumber(settings.defaultWaterGoal) || !isInteger(settings.defaultWaterGoal)) {
      errors.push({ 
        field: 'defaultWaterGoal', 
        message: 'Default water goal must be a positive integer' 
      });
    }
  }

  // Calorie goal
  if (settings.defaultCalorieGoal !== undefined) {
    if (!isPositiveNumber(settings.defaultCalorieGoal) || !isInteger(settings.defaultCalorieGoal)) {
      errors.push({ 
        field: 'defaultCalorieGoal', 
        message: 'Default calorie goal must be a positive integer' 
      });
    }
  }

  // Notifications
  if (settings.notifications !== undefined && !isBoolean(settings.notifications)) {
    errors.push({ field: 'notifications', message: 'Notifications must be a boolean' });
  }

  // Theme
  if (settings.theme !== undefined) {
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(settings.theme)) {
      errors.push({ 
        field: 'theme', 
        message: `Theme must be one of: ${validThemes.join(', ')}` 
      });
    }
  }

  if (errors.length > 0) {
    const error = new ValidationError(errors[0].field, errors[0].message);
    errors.slice(1).forEach(err => error.addError(err.field, err.message));
    throw error;
  }

  return true;
}

/**
 * Sanitization Functions
 */

function sanitizeString(value, maxLength = null) {
  if (!isString(value)) return '';
  let sanitized = value.trim();
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}

function sanitizeNumber(value, min = null, max = null) {
  const num = Number(value);
  if (isNaN(num)) return 0;
  if (min !== null && num < min) return min;
  if (max !== null && num > max) return max;
  return num;
}

function sanitizeInteger(value, min = null, max = null) {
  return Math.floor(sanitizeNumber(value, min, max));
}

module.exports = {
  // Error class
  ValidationError,
  
  // Basic validators
  isString,
  isNonEmptyString,
  hasMaxLength,
  hasMinLength,
  isNumber,
  isInteger,
  isPositiveNumber,
  isInRange,
  isBoolean,
  isValidDate,
  isISOString,
  isValidTime,
  isValidTaskCategory,
  isValidMealType,
  isValidDayIndex,
  
  // Entity validators
  validateTask,
  validateMeal,
  validateDailyData,
  validateWeek,
  validateTaskTemplate,
  validateSettings,
  
  // Sanitization
  sanitizeString,
  sanitizeNumber,
  sanitizeInteger
};