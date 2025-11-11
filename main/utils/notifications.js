const { Notification } = require('electron');

class NotificationManager {
  constructor() {
    this.enabled = true;
  }

  show(title, body, options = {}) {
    if (!this.enabled) return;

    const notification = new Notification({
      title,
      body,
      ...options
    });

    notification.show();
    return notification;
  }

  taskCompleted(taskName) {
    return this.show('Task Completed! ✓', taskName, {
      urgency: 'low'
    });
  }

  weekArchived() {
    return this.show('Week Archived', 'New week started successfully!', {
      urgency: 'normal'
    });
  }

  dailyReminder(tasksRemaining) {
    return this.show(
      'Daily Reminder',
      `You have ${tasksRemaining} tasks remaining today`,
      { urgency: 'normal' }
    );
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

module.exports = new NotificationManager();