/**
 * @typedef {Object} Week
 * @property {number} id
 * @property {string} weekId - Format: "YYYY-Www" (e.g., "2024-W45")
 * @property {string} summary - Week summary/notes
 * @property {boolean} isCurrent
 * @property {string} createdAt
 * @property {string|null} archivedAt
 */

/**
 * @typedef {Object} WeekStats
 * @property {number} totalTasks
 * @property {number} completedTasks
 * @property {number} completionRate - Percentage
 * @property {number} avgWaterGlasses
 * @property {number} avgCalories
 * @property {number} totalMinutesPlanned
 */

module.exports = {};