const { BrowserWindow, screen } = require('electron');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

class WindowManager {
  constructor() {
    this.mainWindow = null;
    this.windows = new Map();
  }

  /**
   * Create the main application window
   */
  createMainWindow() {
    const windowConfig = config.get('window');
    const display = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = display.workAreaSize;

    // Calculate centered position
    const x = Math.floor((screenWidth - windowConfig.width) / 2);
    const y = Math.floor((screenHeight - windowConfig.height) / 2);

    this.mainWindow = new BrowserWindow({
      width: windowConfig.width,
      height: windowConfig.height,
      minWidth: windowConfig.minWidth,
      minHeight: windowConfig.minHeight,
      x: windowConfig.center ? x : undefined,
      y: windowConfig.center ? y : undefined,
      backgroundColor: windowConfig.backgroundColor,
      show: false, // Show after ready-to-show
      center: windowConfig.center,
      resizable: windowConfig.resizable,
      frame: windowConfig.frame,
      titleBarStyle: windowConfig.titleBarStyle,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../renderer/preload.js'),
        devTools: config.isDevelopment()
      },
      title: config.get('app.name')
    });

    // Load the appropriate URL
    this.loadMainWindow();

    // Setup window event handlers
    this.setupMainWindowEvents();

    // Store reference
    this.windows.set('main', this.mainWindow);

    logger.info('Main window created', {
      width: windowConfig.width,
      height: windowConfig.height
    });

    return this.mainWindow;
  }

  /**
   * Load content into main window
   */
  loadMainWindow() {
    if (config.isDevelopment()) {
      // Load from development server
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      // Load production build
      const htmlPath = path.join(__dirname, '../../renderer/build/index.html');
      this.mainWindow.loadFile(htmlPath);
    }
  }

  /**
   * Setup main window event handlers
   */
  setupMainWindowEvents() {
    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      this.mainWindow.focus();
      logger.info('Main window shown');
    });

    // Handle window close
    this.mainWindow.on('close', (event) => {
      logger.info('Main window closing');
      // Add any cleanup logic here
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      this.windows.delete('main');
      logger.info('Main window closed');
    });

    // Handle window maximize/unmaximize
    this.mainWindow.on('maximize', () => {
      this.mainWindow.webContents.send('window:maximized');
    });

    this.mainWindow.on('unmaximize', () => {
      this.mainWindow.webContents.send('window:unmaximized');
    });

    // Handle window focus
    this.mainWindow.on('focus', () => {
      this.mainWindow.webContents.send('window:focused');
    });

    this.mainWindow.on('blur', () => {
      this.mainWindow.webContents.send('window:blurred');
    });

    // Handle renderer process crash
    this.mainWindow.webContents.on('crashed', () => {
      logger.error('Renderer process crashed');
      this.handleRendererCrash();
    });

    // Handle unresponsive renderer
    this.mainWindow.on('unresponsive', () => {
      logger.warn('Window became unresponsive');
      this.handleUnresponsive();
    });

    this.mainWindow.on('responsive', () => {
      logger.info('Window became responsive again');
    });
  }

  /**
   * Create a secondary window (e.g., settings, about)
   */
  createSecondaryWindow(name, options = {}) {
    if (this.windows.has(name)) {
      const existingWindow = this.windows.get(name);
      existingWindow.focus();
      return existingWindow;
    }

    const defaultOptions = {
      width: 800,
      height: 600,
      parent: this.mainWindow,
      modal: false,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../renderer/preload.js')
      }
    };

    const window = new BrowserWindow({
      ...defaultOptions,
      ...options
    });

    window.once('ready-to-show', () => {
      window.show();
    });

    window.on('closed', () => {
      this.windows.delete(name);
    });

    this.windows.set(name, window);
    logger.info(`Secondary window created: ${name}`);

    return window;
  }

  /**
   * Get main window
   */
  getMainWindow() {
    return this.mainWindow;
  }

  /**
   * Get window by name
   */
  getWindow(name) {
    return this.windows.get(name);
  }

  /**
   * Close window by name
   */
  closeWindow(name) {
    const window = this.windows.get(name);
    if (window && !window.isDestroyed()) {
      window.close();
    }
  }

  /**
   * Close all windows
   */
  closeAllWindows() {
    this.windows.forEach((window, name) => {
      if (!window.isDestroyed()) {
        window.close();
      }
    });
  }

  /**
   * Minimize main window
   */
  minimize() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.minimize();
    }
  }

  /**
   * Maximize main window
   */
  maximize() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    }
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
    }
  }

  /**
   * Set always on top
   */
  setAlwaysOnTop(flag) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setAlwaysOnTop(flag);
    }
  }

  /**
   * Reload main window
   */
  reload() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.reload();
    }
  }

  /**
   * Handle renderer process crash
   */
  handleRendererCrash() {
    const { dialog } = require('electron');
    
    dialog.showMessageBox(this.mainWindow, {
      type: 'error',
      title: 'Renderer Process Crashed',
      message: 'The application has encountered an error.',
      detail: 'Would you like to reload the application?',
      buttons: ['Reload', 'Close'],
      defaultId: 0
    }).then(result => {
      if (result.response === 0) {
        this.reload();
      } else {
        this.mainWindow.close();
      }
    });
  }

  /**
   * Handle unresponsive window
   */
  handleUnresponsive() {
    const { dialog } = require('electron');
    
    dialog.showMessageBox(this.mainWindow, {
      type: 'warning',
      title: 'Window Unresponsive',
      message: 'The application is not responding.',
      detail: 'Would you like to wait or close the application?',
      buttons: ['Wait', 'Close'],
      defaultId: 0
    }).then(result => {
      if (result.response === 1) {
        this.mainWindow.close();
      }
    });
  }

  /**
   * Get window bounds
   */
  getBounds() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      return this.mainWindow.getBounds();
    }
    return null;
  }

  /**
   * Set window bounds
   */
  setBounds(bounds) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setBounds(bounds);
    }
  }

  /**
   * Check if window is maximized
   */
  isMaximized() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      return this.mainWindow.isMaximized();
    }
    return false;
  }

  /**
   * Check if window is minimized
   */
  isMinimized() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      return this.mainWindow.isMinimized();
    }
    return false;
  }

  /**
   * Check if window is fullscreen
   */
  isFullScreen() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      return this.mainWindow.isFullScreen();
    }
    return false;
  }

  /**
   * Flash window frame (get user attention)
   */
  flash() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.flashFrame(true);
    }
  }

  /**
   * Stop flashing window
   */
  stopFlash() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.flashFrame(false);
    }
  }
}

module.exports = WindowManager;