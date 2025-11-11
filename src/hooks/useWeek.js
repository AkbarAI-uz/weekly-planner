import { useState, useCallback } from 'react';

export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  const error = useCallback((message, duration) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  const warning = useCallback((message, duration) => {
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  const info = useCallback((message, duration) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  };
}

// NotificationContainer Component
export function NotificationContainer({ notifications, onRemove }) {
  if (notifications.length === 0) return null;

  const getNotificationStyle = (type) => {
    const styles = {
      success: { bg: '#f0fff4', border: '#9ae6b4', text: '#22543d', icon: '✓' },
      error: { bg: '#fff5f5', border: '#fc8181', text: '#742a2a', icon: '✕' },
      warning: { bg: '#fffbeb', border: '#f6ad55', text: '#744210', icon: '⚠' },
      info: { bg: '#ebf8ff', border: '#90cdf4', text: '#2c5282', icon: 'ℹ' }
    };
    return styles[type] || styles.info;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '400px'
    }}>
      {notifications.map(notification => {
        const style = getNotificationStyle(notification.type);
        
        return (
          <div
            key={notification.id}
            style={{
              padding: '1rem 1.5rem',
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: '0.5rem',
              color: style.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {style.icon}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {notification.message}
              </span>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: style.text,
                opacity: 0.7,
                padding: '0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        );
      })}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}