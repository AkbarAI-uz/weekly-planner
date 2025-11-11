import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../common/Button';
import { useTaskTemplates } from '../../hooks/useMeals';

export default function TaskTemplates({ onUseTemplate }) {
  const { getTemplates, createTemplate, deleteTemplate } = useTaskTemplates();
  const [templates, setTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      await createTemplate(templateData);
      await loadTemplates();
      setShowCreateModal(false);
    } catch (error) {
      alert('Failed to create template');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Delete this template?')) {
      try {
        await deleteTemplate(templateId);
        await loadTemplates();
      } catch (error) {
        alert('Failed to delete template');
      }
    }
  };

  const handleUseTemplate = (template) => {
    onUseTemplate({
      name: template.name,
      time: template.time,
      category: template.category,
      estimatedMinutes: template.estimatedMinutes
    });
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
          Loading templates...
        </div>
      </Card>
    );
  }

  return (
    <>
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
            📋 Task Templates
          </h3>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="sm"
          >
            + Create Template
          </Button>
        </div>

        {templates.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#a0aec0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
            <p>No templates yet</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Create templates for recurring tasks
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {templates.map(template => (
              <div
                key={template.id}
                style={{
                  padding: '1rem',
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  position: 'relative'
                }}
              >
                {template.isDefault && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.625rem',
                    fontWeight: '600'
                  }}>
                    DEFAULT
                  </div>
                )}

                <div style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  paddingRight: template.isDefault ? '4rem' : 0
                }}>
                  {template.name}
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: '#718096',
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div>🕐 {template.time}</div>
                  <div>📂 {template.category}</div>
                  {template.estimatedMinutes && (
                    <div>⏱️ {template.estimatedMinutes} min</div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    Use
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    style={{
                      padding: '0.5rem',
                      background: 'transparent',
                      color: '#e53e3e',
                      border: '1px solid #fc8181',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Template Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Task Template"
      >
        <TemplateForm
          onSubmit={handleCreateTemplate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </>
  );
}

// Template Form Component
function TemplateForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    category: 'general',
    estimatedMinutes: '',
    isDefault: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
          Template Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          placeholder="e.g., Morning Exercise"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #cbd5e0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Time *
          </label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
            placeholder="e.g., 7:00 AM"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
          Duration (minutes)
        </label>
        <input
          type="number"
          value={formData.estimatedMinutes}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: e.target.value }))}
          placeholder="Optional"
          min="0"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #cbd5e0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
          style={{ width: '16px', height: '16px' }}
        />
        <label htmlFor="isDefault" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
          Add to new weeks automatically
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Template
        </Button>
      </div>
    </form>
  );
}