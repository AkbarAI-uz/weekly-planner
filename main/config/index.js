const path = require('path');
const { app } = require('electron');
const defaults = require('./defaults');

class Config {
  constructor() {
    this.config = { ...defaults };
    this.paths = this.initializePaths();
  }

  initializePaths() {
    const userDataPath = app.getPath('userData');
    
    return {
      userData: userDataPath,
      data: path.join(userDataPath, 'planner-data.json'),
      backups: path.join(userDataPath, 'backups'),
      logs: path.join(userDataPath, 'logs'),
      temp: path.join(userDataPath, 'temp')
    };
  }

  get(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.config);
  }

  set(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, k) => {
      if (!obj[k]) obj[k] = {};
      return obj[k];
    }, this.config);
    
    target[lastKey] = value;
  }

  getPath(pathName) {
    return this.paths[pathName];
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  getAll() {
    return { ...this.config };
  }
}

module.exports = new Config();