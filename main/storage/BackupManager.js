const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class BackupManager {
  constructor(dataPath, backupDir) {
    this.dataPath = dataPath;
    this.backupDir = backupDir;
    this.maxBackups = 10;
  }

  async initialize() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      logger.info('Backup manager initialized', { backupDir: this.backupDir });
    } catch (error) {
      logger.error('Failed to initialize backup manager', error);
    }
  }

  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.backupDir, `backup-${timestamp}.json`);
      
      await fs.copyFile(this.dataPath, backupPath);
      logger.info('Backup created', { backupPath });
      
      await this.cleanOldBackups();
      return backupPath;
    } catch (error) {
      logger.error('Failed to create backup', error);
      throw error;
    }
  }

  async cleanOldBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = files
        .filter(f => f.startsWith('backup-'))
        .map(f => ({
          name: f,
          path: path.join(this.backupDir, f)
        }))
        .sort((a, b) => b.name.localeCompare(a.name));

      if (backups.length > this.maxBackups) {
        const toDelete = backups.slice(this.maxBackups);
        await Promise.all(toDelete.map(b => fs.unlink(b.path)));
        logger.info('Old backups cleaned', { deleted: toDelete.length });
      }
    } catch (error) {
      logger.error('Failed to clean old backups', error);
    }
  }

  async restoreBackup(backupName) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      await fs.copyFile(backupPath, this.dataPath);
      logger.info('Backup restored', { backupName });
    } catch (error) {
      logger.error('Failed to restore backup', error);
      throw error;
    }
  }

  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      return files
        .filter(f => f.startsWith('backup-'))
        .sort((a, b) => b.localeCompare(a));
    } catch (error) {
      logger.error('Failed to list backups', error);
      return [];
    }
  }
}

module.exports = BackupManager;