const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class Logger {
  constructor() {
    this.logPath = path.join(app.getPath('userData'), 'logs');
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath, { recursive: true });
    }
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    const logFile = path.join(this.logPath, `${new Date().toISOString().split('T')[0]}.log`);

    const consoleMsg = `[${level.toUpperCase()}] ${timestamp} - ${message}`;
    if (level === 'error') {
      console.error(consoleMsg, meta);
    } else {
      console.log(consoleMsg, meta);
    }

    fs.appendFileSync(logFile, logLine);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  error(message, error, meta = {}) {
    this.log('error', message, {
      ...meta,
      error: error.message,
      stack: error.stack
    });
  }

  debug(message, meta) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }
}

module.exports = new Logger();