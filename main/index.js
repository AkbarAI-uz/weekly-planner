const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const FileStorage = require('./storage/FileStorage');
const BackupManager = require('./storage/BackupManager');
const WeekService = require('./services/WeekService');
const TaskService = require('./services/TaskService');
const MealService = require('./services/MealService');
const DailyDataService = require('./services/DailyDataService');
const { registerHandlers } = require('./ipc/handlers');
const logger = require('./utils/logger');
const { createTray } = require('./window/tray');

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Initialize services
const dataPath = path.join(app.getPath('userData'), 'planner-data.json');
const backupDir = path.join(app.getPath('userData'), 'backups');

const storage = new FileStorage(dataPath);
const backupManager = new BackupManager(dataPath, backupDir);

const weekService = new WeekService(storage);
const taskService = new TaskService(storage);
const mealService = new MealService(storage);
const dailyDataService = new DailyDataService(storage);

function createWindow() {
  // Don't create window if already exists
  if (mainWindow) {
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../renderer/preload.js')
    },
    title: 'Weekly Planner',
    backgroundColor: '#667eea',
    show: false // Don't show until ready
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // In development, load from dev server
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000').catch(err => {
      logger.error('Failed to load dev server', err);
      // Fallback to production build
      mainWindow.loadFile(path.join(__dirname, '../renderer/build/index.html'));
    });
    
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/build/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting && process.platform === 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  logger.info('Main window created');
}

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      logger.info('App is ready, initializing...');

      // Initialize storage
      await storage.initialize();
      logger.info('Storage initialized');

      await backupManager.initialize();
      logger.info('Backup manager initialized');

      // Clear any existing handlers (in case of reload)
      ipcMain.removeAllListeners();

      // Register IPC handlers
      registerHandlers({
        weekService,
        taskService,
        mealService,
        dailyDataService,
        backupManager
      });
      logger.info('IPC handlers registered');

      // Create window and tray
      createWindow();
      
      if (process.platform !== 'darwin') {
        tray = createTray(mainWindow);
        logger.info('System tray created');
      }

      // Setup auto-backup (every hour)
      setInterval(async () => {
        try {
          await backupManager.createBackup();
          logger.info('Auto-backup completed');
        } catch (err) {
          logger.error('Auto-backup failed', err);
        }
      }, 3600000); // 1 hour

      logger.info('Application started successfully');

    } catch (error) {
      logger.error('Failed to start application', error);
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      isQuitting = true;
      app.quit();
    }
  });

  app.on('before-quit', async (event) => {
    isQuitting = true;
    
    // Create final backup
    try {
      await backupManager.createBackup();
      logger.info('Final backup created before quit');
    } catch (error) {
      logger.error('Failed to create final backup', error);
    }
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error);
  });

  process.on('unhandledRejection', (error) => {
    logger.error('Unhandled rejection', error);
  });
}