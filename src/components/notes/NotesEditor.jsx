import React, { useState, useEffect } from 'react';
import { Card, Button } from '../common/Button';

export default function NotesEditor({ 
  initialNotes = '', 
  onSave, 
  autoSave = false,
  autoSaveDelay = 2000,
  placeholder = 'Write your thoughts, ideas, or reflections...'
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
    setHasChanges(false);
  }, [initialNotes]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [notes, autoSave, autoSaveDelay, hasChanges]);

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await onSave(notes);
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
      alert('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setNotes(e.target.value);
    setHasChanges(true);
  };

  const wordCount = notes.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = notes.length;

  return (
    <Card>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📝 Notes
          </h3>
          {lastSaved && (
            <p style={{
              fontSize: '0.75rem',
              color: '#718096',
              marginTop: '0.25rem'
            }}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        {!autoSave && (
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            variant={hasChanges ? 'primary' : 'secondary'}
            size="sm"
          >
            {isSaving ? 'Saving...' : hasChanges ? 'Save' : 'Saved'}
          </Button>
        )}

        {autoSave && hasChanges && !isSaving && (
          <span style={{
            fontSize: '0.75rem',
            color: '#ed8936',
            fontWeight: '500'
          }}>
            ● Unsaved changes
          </span>
        )}

        {autoSave && isSaving && (
          <span style={{
            fontSize: '0.75rem',
            color: '#667eea',
            fontWeight: '500'
          }}>
            💾 Saving...
          </span>
        )}
      </div>

      <textarea
        value={notes}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '200px',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          resize: 'vertical',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.2s',
          ':focus': {
            borderColor: '#667eea'
          }
        }}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.75rem',
        fontSize: '0.75rem',
        color: '#718096'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
        </div>

        {autoSave && (
          <span>
            Auto-save enabled
          </span>
        )}
      </div>

      {/* Quick Tips */}
      {notes.length === 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f7fafc',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#4a5568'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            💡 Quick Tips:
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <li>Reflect on your day's accomplishments</li>
            <li>Note any challenges you faced</li>
            <li>Set intentions for tomorrow</li>
            <li>Track your mood or energy levels</li>
          </ul>
        </div>
      )}
    </Card>
  );
}