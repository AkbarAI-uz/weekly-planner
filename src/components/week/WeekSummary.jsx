import React, { useState } from 'react';
import { Card, Button } from '../common/Button';

export default function WeekSummary({ weekId, initialSummary = '', onSave }) {
  const [summary, setSummary] = useState(initialSummary);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(weekId, summary);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to save summary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSummary(initialSummary);
    setIsEditing(false);
  };

  return (
    <Card>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📄 Week Summary
        </h3>

        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Reflect on your week: accomplishments, challenges, lessons learned..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '1rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e0'}
            autoFocus
          />

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            marginTop: '1rem'
          }}>
            <Button
              onClick={handleCancel}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </>
      ) : (
        <>
          {summary ? (
            <div style={{
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: '#2d3748',
              whiteSpace: 'pre-wrap'
            }}>
              {summary}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#a0aec0'
            }}>
              <p>No summary yet</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Click "Edit" to add your week summary
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}