import React, { useState, useEffect } from 'react';
import { WeekProvider } from './contexts/WeekContext';
import Layout from './components/layout/Layout';

function App() {
  const [isElectron, setIsElectron] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI && window.electronAPI.isElectron) {
      setIsElectron(true);
    } else {
      setError('Not running in Electron environment');
      console.error('window.electronAPI not found');
    }
  }, []);

  // Show error if not in Electron
  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️ Electron Required</h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            This application must be run through Electron.
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7, marginTop: '12px' }}>
            Run: npm start
          </p>
        </div>
      </div>
    );
  }

  // Show loading while checking environment
  if (!isElectron) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <WeekProvider>
      <Layout />
    </WeekProvider>
  );
}

export default App;