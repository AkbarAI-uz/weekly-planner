const { dialog } = require('electron');
const logger = require('./logger');

/**
 * Custom Error Classes
 */

class AppError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class StorageError extends AppError {
  constructor(message, details) {
    super(message, 'STORAGE_ERROR', details);
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

class ServiceError extends AppError {
  constructor(message, details) {
    super(message, 'SERVICE_ERROR', details);
  }
}

class IPCError extends AppError {
  constructor(message, details) {
    super(message, 'IPC_ERROR', details);
  }
}

/**
 * Error Handler Class
 */
class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error);
      this.handleCriticalError(error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', reason);
      this.handlePromiseRejection(reason, promise);
    });
  }

  /**
   * Handle application errors with appropriate UI feedback
   */
  async handleError(error, mainWindow = null, showDialog = true) {
    // Log the error
    logger.error(error.message || 'Unknown error', error);

    // Categorize error
    const errorInfo = this.categorizeError(error);

    // Show dialog if needed
    if (showDialog && mainWindow) {
      await this.showErrorDialog(mainWindow, errorInfo);
    }

    // Return error info for programmatic handling
    return errorInfo;
  }

  /**
   * Categorize error and determine severity
   */
  categorizeError(error) {
    let severity = 'error';
    let userMessage = 'An unexpected error occurred.';
    let details = error.message || 'Unknown error';
    let recoverable = true;

    if (error instanceof ValidationError) {
      severity = 'warning';
      userMessage = 'Invalid input provided.';
      details = error.message;
      recoverable = true;
    } else if (error instanceof StorageError) {
      severity = 'error';
      userMessage = 'Failed to save or load data.';
      details = error.message;
      recoverable = true;
    } else if (error instanceof ServiceError) {
      severity = 'error';
      userMessage = 'A service operation failed.';
      details = error.message;
      recoverable = true;
    } else if (error instanceof IPCError) {
      severity = 'error';
      userMessage = 'Communication error occurred.';
      details = error.message;
      recoverable = true;
    } else if (error.code === 'ENOENT') {
      severity = 'warning';
      userMessage = 'File not found.';
      details = 'The requested file does not exist.';
      recoverable = true;
    } else if (error.code === 'EACCES') {
      severity = 'error';
      userMessage = 'Permission denied.';
      details = 'The application does not have permission to access the file.';
      recoverable = false;
    } else if (error.code === 'ENOSPC') {
      severity = 'error';
      userMessage = 'Disk space full.';
      details = 'There is not enough disk space to complete the operation.';
      recoverable = false;
    }

    return {
      severity,
      userMessage,
      details,
      recoverable,
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Show error dialog to user
   */
  async showErrorDialog(mainWindow, errorInfo) {
    const options = {
      type: errorInfo.severity === 'warning' ? 'warning' : 'error',
      title: errorInfo.severity === 'warning' ? 'Warning' : 'Error',
      message: errorInfo.userMessage,
      detail: errorInfo.details,
      buttons: errorInfo.recoverable ? ['OK', 'View Logs'] : ['OK']
    };

    const { response } = await dialog.showMessageBox(mainWindow, options);

    // If user clicked "View Logs"
    if (response === 1 && errorInfo.recoverable) {
      this.openLogFile();
    }
  }

  /**
   * Handle critical errors that may require app restart
   */
  handleCriticalError(error) {
    const errorInfo = this.categorizeError(error);
    
    logger.error('Critical Error', error, { critical: true });

    // Show critical error dialog
    dialog.showErrorBox(
      'Critical Error',
      `${errorInfo.userMessage}\n\n${errorInfo.details}\n\nThe application may need to restart.`
    );

    // Optionally restart or exit
    // app.relaunch();
    // app.exit(1);
  }

  /**
   * Handle unhandled promise rejections
   */
  handlePromiseRejection(reason, promise) {
    logger.error('Unhandled Promise Rejection', reason, {
      promise: promise.toString()
    });

    // Convert to standard error if needed
    const error = reason instanceof Error ? reason : new Error(String(reason));
    this.categorizeError(error);
  }

  /**
   * Handle IPC errors
   */
  handleIPCError(channel, error) {
    const ipcError = new IPCError(
      `IPC error in channel: ${channel}`,
      { channel, originalError: error.message }
    );

    logger.error('IPC Error', ipcError);
    return this.categorizeError(ipcError);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(field, value, reason) {
    const validationError = new ValidationError(
      `Validation failed for ${field}`,
      { field, value, reason }
    );

    logger.warn('Validation Error', validationError);
    return this.categorizeError(validationError);
  }

  /**
   * Wrap async functions with error handling
   */
  wrapAsync(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        return this.handleError(error, null, false);
      }
    };
  }

  /**
   * Create error response for IPC
   */
  createErrorResponse(error) {
    const errorInfo = this.categorizeError(error);
    
    return {
      success: false,
      error: {
        message: errorInfo.userMessage,
        details: errorInfo.details,
        code: errorInfo.code,
        recoverable: errorInfo.recoverable
      }
    };
  }

  /**
   * Create success response for IPC
   */
  createSuccessResponse(data) {
    return {
      success: true,
      data
    };
  }

  /**
   * Open log file in default text editor
   */
  openLogFile() {
    const { shell } = require('electron');
    const path = require('path');
    const logger = require('./logger');
    
    const logPath = path.join(
      logger.logPath,
      `${new Date().toISOString().split('T')[0]}.log`
    );

    shell.openPath(logPath).catch(err => {
      logger.error('Failed to open log file', err);
    });
  }
}

// Export singleton instance
const errorHandler = new ErrorHandler();

module.exports = {
  errorHandler,
  AppError,
  StorageError,
  ValidationError,
  ServiceError,
  IPCError
};