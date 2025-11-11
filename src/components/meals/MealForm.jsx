import React, { useState } from 'react';
import { Input, Select } from '../common/Button';

export default function MealForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    mealType: 'lunch',
    time: '',
    foodName: '',
    calories: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const mealTypeOptions = [
    { value: 'breakfast', label: '🌅 Breakfast' },
    { value: 'lunch', label: '☀️ Lunch' },
    { value: 'dinner', label: '🌙 Dinner' },
    { value: 'snack', label: '🍎 Snack' }
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    }

    if (!formData.calories || formData.calories <= 0) {
      newErrors.calories = 'Valid calories required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        calories: parseInt(formData.calories)
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
      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <Select
            label="Meal Type"
            value={formData.mealType}
            onChange={(e) => handleChange('mealType', e.target.value)}
            options={mealTypeOptions}
            required
          />

          <Input
            type="text"
            label="Time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            placeholder="e.g., 12:00 PM"
            error={errors.time}
            required
          />
        </div>

        <Input
          type="text"
          label="Food Name"
          value={formData.foodName}
          onChange={(e) => handleChange('foodName', e.target.value)}
          placeholder="e.g., Grilled Chicken Salad"
          error={errors.foodName}
          required
        />

        <Input
          type="number"
          label="Calories"
          value={formData.calories}
          onChange={(e) => handleChange('calories', e.target.value)}
          placeholder="e.g., 450"
          error={errors.calories}
          required
          min="0"
        />

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
            placeholder="Add any additional notes..."
            style={{
              padding: '0.75rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        marginTop: '1.5rem'
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#e2e8f0',
            color: '#2d3748',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {initialData ? 'Update' : 'Add'} Meal
        </button>
      </div>
    </form>
  );
}