import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  startOfWeek: 1, // 0 = Sunday, 1 = Monday
  defaultWaterGoal: 8,
  defaultCalorieGoal: 2000,
  notifications: true,
  theme: 'light',
  autoSave: true,
  autoSaveDelay: 2000,
  showTaskEstimates: true,
  showCompletionPercentage: true,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h' // '12h' or '24h'
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In a real app, you'd load from storage
      // For now, use localStorage as fallback
      const saved = localStorage.getItem('planner-settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      localStorage.setItem('planner-settings', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('planner-settings');
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    loading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

export default SettingsContext;