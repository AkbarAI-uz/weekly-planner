/**
 * Migration from v1.0.0 to v2.0.0
 * 
 * Changes:
 * - Add task categories
 * - Add task estimated minutes
 * - Add meal tracking system
 * - Add daily data (water, notes)
 * - Add task templates
 * - Update week structure
 */

async function migrateV1toV2(data) {
  const migratedData = { ...data };

  // 1. Migrate weeks - add new fields
  if (migratedData.weeks) {
    migratedData.weeks = migratedData.weeks.map(week => ({
      ...week,
      summary: week.summary || '',
      archivedAt: week.archivedAt || null
    }));
  } else {
    migratedData.weeks = [];
  }

  // 2. Migrate tasks - add new fields
  if (migratedData.tasks) {
    migratedData.tasks = migratedData.tasks.map(task => ({
      ...task,
      category: task.category || 'general',
      estimatedMinutes: task.estimatedMinutes || null,
      notes: task.notes || null,
      order: task.order !== undefined ? task.order : 0,
      updatedAt: task.updatedAt || task.createdAt || new Date().toISOString()
    }));
  } else {
    migratedData.tasks = [];
  }

  // 3. Initialize meals if not exists
  if (!migratedData.meals) {
    migratedData.meals = [];
  }

  // 4. Initialize dailyData if not exists
  if (!migratedData.dailyData) {
    migratedData.dailyData = [];
    
    // Create daily data for existing weeks
    if (migratedData.weeks && migratedData.weeks.length > 0) {
      migratedData.weeks.forEach(week => {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          migratedData.dailyData.push({
            id: Date.now() + dayIndex + Math.random(),
            weekId: week.id,
            dayIndex,
            waterGlasses: 0,
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    }
  }

  // 5. Initialize task templates if not exists
  if (!migratedData.taskTemplates) {
    migratedData.taskTemplates = [];
  }

  // 6. Initialize settings if not exists or update with new fields
  if (!migratedData.settings) {
    migratedData.settings = {
      startOfWeek: 1,
      defaultWaterGoal: 8,
      defaultCalorieGoal: 2000,
      notifications: true,
      theme: 'light'
    };
  } else {
    // Add new settings fields if they don't exist
    migratedData.settings = {
      startOfWeek: migratedData.settings.startOfWeek || 1,
      defaultWaterGoal: migratedData.settings.defaultWaterGoal || 8,
      defaultCalorieGoal: migratedData.settings.defaultCalorieGoal || 2000,
      notifications: migratedData.settings.notifications !== undefined 
        ? migratedData.settings.notifications 
        : true,
      theme: migratedData.settings.theme || 'light'
    };
  }

  // 7. Update version
  migratedData.version = '2.0.0';

  // 8. Add migration metadata
  migratedData.migratedAt = new Date().toISOString();
  migratedData.migratedFrom = '1.0.0';

  return migratedData;
}

module.exports = migrateV1toV2;