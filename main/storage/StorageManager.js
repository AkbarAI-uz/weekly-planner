class StorageManager {
  async initialize() {
    throw new Error('Must implement initialize()');
  }

  async get(key) {
    throw new Error('Must implement get()');
  }

  async set(key, value) {
    throw new Error('Must implement set()');
  }

  async delete(key) {
    throw new Error('Must implement delete()');
  }

  async getAll(prefix) {
    throw new Error('Must implement getAll()');
  }
}

module.exports = StorageManager;