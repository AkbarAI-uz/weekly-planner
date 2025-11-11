/**
 * @typedef {Object} Task
 * @property {number} id - Unique identifier
 * @property {number} weekId - Associated week ID
 * @property {number} dayIndex - Day of week (0-6)
 * @property {string} time - Task time (e.g., "5:00 AM" or "5:00 AM - 6:00 AM")
 * @property {string} name - Task name/description
 * @property {boolean} isCompleted - Completion status
 * @property {number} order - Display order
 * @property {string} category - Task category (work, personal, health, etc.)
 * @property {number|null} estimatedMinutes - Estimated duration
 * @property {string|null} notes - Additional notes
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} TaskTemplate
 * @property {number} id
 * @property {string} name - Template name
 * @property {string} time
 * @property {string} category
 * @property {number|null} estimatedMinutes
 * @property {boolean} isDefault - Auto-add to new weeks
 */

module.exports = {};