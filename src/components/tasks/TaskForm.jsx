import React, { useState } from 'react';
import { Input, Select, Button } from '../common/Button';


export default function TaskForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    time: '',
    category: 'general',
    estimatedMinutes: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'general', label: '📋 General' },
    { value: 'work', label: '💼 Work' },
    { value: 'personal', label: '👤 Personal' },
    { value: 'health', label: '🏃 Health' }
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    } else if (!/^\d{1,2}:\d{2}\s?(AM|PM)?/i.test(formData.time)) {
      newErrors.time = 'Invalid time format (e.g., 9:00 AM)';
    }

    if (formData.estimatedMinutes && (formData.estimatedMinutes < 0 || formData.estimatedMinutes > 1440)) {
      newErrors.estimatedMinutes = 'Must be between 0 and 1440 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '1.5rem',
        background: '#f7fafc',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}
    >
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Task Name */}
        <Input
          type="text"
          label="Task Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Morning workout"
          error={errors.name}
          required
        />

        {/* Time and Category Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <Input
            type="text"
            label="Time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            placeholder="e.g., 9:00 AM"
            error={errors.time}
            required
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            options={categoryOptions}
          />
        </div>

        {/* Estimated Time */}
        <Input
          type="number"
          label="Estimated Duration (minutes)"
          value={formData.estimatedMinutes}
          onChange={(e) => handleChange('estimatedMinutes', e.target.value)}
          placeholder="Optional - e.g., 30"
          error={errors.estimatedMinutes}
          min="0"
          max="1440"
        />

        {/* Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#2d3748'
          }}>
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add any additional details or context..."
            style={{
              padding: '0.75rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e0'}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        marginTop: '1.5rem'
      }}>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          size="md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          {initialData ? 'Update' : 'Add'} Task
        </Button>
      </div>
    </form>
  );
}