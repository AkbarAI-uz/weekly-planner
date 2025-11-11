const logger = require('../../utils/logger');
const v1_to_v2 = require('./v1_to_v2');

/**
 * Migration Runner
 * Handles database schema migrations
 */
class MigrationRunner {
  constructor(storage) {
    this.storage = storage;
    this.migrations = [
      { version: '2.0.0', name: 'v1_to_v2', migration: v1_to_v2 }
      // Add future migrations here
      // { version: '2.1.0', name: 'v2_to_v2.1', migration: v2_to_v2_1 }
    ];
  }

  /**
   * Run all pending migrations
   */
  async runMigrations() {
    try {
      const currentVersion = await this.getCurrentVersion();
      logger.info('Current data version', { version: currentVersion });

      const pendingMigrations = this.getPendingMigrations(currentVersion);

      if (pendingMigrations.length === 0) {
        logger.info('No pending migrations');
        return { migrated: false, version: currentVersion };
      }

      logger.info('Running migrations', { 
        count: pendingMigrations.length,
        versions: pendingMigrations.map(m => m.version)
      });

      // Create backup before migration
      await this.createPreMigrationBackup();

      // Run each pending migration in order
      for (const migration of pendingMigrations) {
        await this.runMigration(migration);
      }

      const newVersion = pendingMigrations[pendingMigrations.length - 1].version;
      await this.storage.set('version', newVersion);

      logger.info('Migrations completed', { 
        from: currentVersion,
        to: newVersion 
      });

      return { 
        migrated: true, 
        from: currentVersion, 
        to: newVersion,
        count: pendingMigrations.length
      };
    } catch (error) {
      logger.error('Migration failed', error);
      throw new Error(`Migration failed: ${error.message}`);
    }
  }

  /**
   * Run a single migration
   */
  async runMigration(migration) {
    logger.info('Running migration', { 
      name: migration.name,
      version: migration.version 
    });

    try {
      const data = await this.storage.getAll();
      const migratedData = await migration.migration(data);
      
      // Update all data
      Object.keys(migratedData).forEach(async (key) => {
        await this.storage.set(key, migratedData[key]);
      });

      logger.info('Migration completed', { name: migration.name });
    } catch (error) {
      logger.error('Migration error', error, { migration: migration.name });
      throw error;
    }
  }

  /**
   * Get current data version
   */
  async getCurrentVersion() {
    const version = await this.storage.get('version');
    return version || '1.0.0';
  }

  /**
   * Get list of pending migrations
   */
  getPendingMigrations(currentVersion) {
    return this.migrations.filter(migration => {
      return this.compareVersions(migration.version, currentVersion) > 0;
    });
  }

  /**
   * Compare version strings
   * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
   */
  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;

      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }

  /**
   * Create backup before migration
   */
  async createPreMigrationBackup() {
    try {
      const BackupManager = require('../BackupManager');
      const config = require('../../config');
      
      const backupManager = new BackupManager(
        config.getPath('data'),
        config.getPath('backups')
      );

      await backupManager.initialize();
      const backupPath = await backupManager.createBackup();
      
      logger.info('Pre-migration backup created', { backupPath });
    } catch (error) {
      logger.warn('Failed to create pre-migration backup', error);
      // Don't throw - migration can continue without backup
    }
  }

  /**
   * Check if migration is needed
   */
  async isMigrationNeeded() {
    const currentVersion = await this.getCurrentVersion();
    const pendingMigrations = this.getPendingMigrations(currentVersion);
    return pendingMigrations.length > 0;
  }

  /**
   * Get migration history
   */
  async getMigrationHistory() {
    const currentVersion = await this.getCurrentVersion();
    const completedMigrations = this.migrations.filter(migration => {
      return this.compareVersions(migration.version, currentVersion) <= 0;
    });

    return {
      currentVersion,
      totalMigrations: this.migrations.length,
      completedMigrations: completedMigrations.map(m => ({
        version: m.version,
        name: m.name
      })),
      pendingMigrations: this.getPendingMigrations(currentVersion).map(m => ({
        version: m.version,
        name: m.name
      }))
    };
  }
}

module.exports = MigrationRunner;