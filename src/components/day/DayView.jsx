import React, { useState, useEffect, useCallback } from 'react';
import { useWeekContext } from '../../contexts/WeekContext';
import TaskList from '../tasks/TaskList';
import HydrationTracker from '../hydration/HydrationTracker';
import NotesEditor from '../notes/NotesEditor';
import { useMeals } from '../../hooks/useMeals';

export default function DayView({ dayIndex }) {
  const { state } = useWeekContext();
  const { meals, createMeal, deleteMeal } = useMeals();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [dailyData, setDailyData] = useState({ waterGlasses: 0, notes: '' });
  const [showMealForm, setShowMealForm] = useState(false);

  const dayMeals = meals.filter(m => m.dayIndex === dayIndex);
  const totalCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);

  const loadDayData = useCallback(() => {
    if (!state.currentWeek) return;
    
    const dayData = state.currentWeek.dailyData.find(d => d.dayIndex === dayIndex);
    
    if (dayData) {
      setDailyData(dayData);
    }
  }, [state.currentWeek, dayIndex]);

  useEffect(() => {
    loadDayData();
  }, [loadDayData]);

  const handleWaterUpdate = async (newCount) => {
    try {
      await window.electronAPI.dailyData.update(
        state.currentWeek.id,
        dayIndex,
        { waterGlasses: newCount }
      );
      setDailyData(prev => ({ ...prev, waterGlasses: newCount }));
    } catch (error) {
      console.error('Failed to update water:', error);
    }
  };

  const handleNotesSave = async (notes) => {
    try {
      await window.electronAPI.dailyData.update(
        state.currentWeek.id,
        dayIndex,
        { notes }
      );
      setDailyData(prev => ({ ...prev, notes }));
    } catch (error) {
      console.error('Failed to save notes:', error);
      throw error;
    }
  };

  const handleAddMeal = async (mealData) => {
    try {
      await createMeal(dayIndex, mealData);
      setShowMealForm(false);
    } catch (error) {
      alert('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm('Delete this meal?')) {
      try {
        await deleteMeal(mealId);
      } catch (error) {
        alert('Failed to delete meal');
      }
    }
  };

  if (!state.currentWeek) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#718096' }}>Loading day data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Day Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {days[dayIndex]}
        </h2>
        <p style={{ color: '#718096' }}>
          Plan and track your day
        </p>
      </div>

      {/* Hydration Tracker */}
      <div style={{ marginBottom: '1.5rem' }}>
        <HydrationTracker
          waterGlasses={dailyData.waterGlasses}
          onUpdate={handleWaterUpdate}
          goal={8}
          showProgress={true}
        />
      </div>

      {/* Tasks Section */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          ✓ Tasks
        </h3>
        <TaskList dayIndex={dayIndex} />
      </div>

      {/* Meals Section */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            🍽️ Meals
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#718096' }}>
              Total: {totalCalories} cal
            </span>
            <button
              onClick={() => setShowMealForm(true)}
              style={{
                padding: '0.5rem 1rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              + Add Meal
            </button>
          </div>
        </div>

        {/* Meal Form */}
        {showMealForm && (
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '0.5rem'
          }}>
            <SimpleMealForm
              onSubmit={handleAddMeal}
              onCancel={() => setShowMealForm(false)}
            />
          </div>
        )}
        
        {dayMeals.length === 0 ? (
          <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>
            No meals tracked yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dayMeals.map(meal => (
              <div
                key={meal.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f7fafc',
                  borderRadius: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {meal.foodName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                    {meal.time} • {meal.calories} cal
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: 'transparent',
                    color: '#e53e3e',
                    border: '1px solid #e53e3e',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Notes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <NotesEditor
          initialNotes={dailyData.notes}
          onSave={handleNotesSave}
          autoSave={false}
          placeholder="Write your thoughts, ideas, or reflections for today..."
        />
      </div>
    </div>
  );
}

// Simple inline meal form component
function SimpleMealForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    mealType: 'lunch',
    time: '',
    foodName: '',
    calories: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.foodName || !formData.time || !formData.calories) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({
      ...formData,
      calories: parseInt(formData.calories)
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
            Type *
          </label>
          <select
            value={formData.mealType}
            onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value }))}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">☀️ Lunch</option>
            <option value="dinner">🌙 Dinner</option>
            <option value="snack">🍎 Snack</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
            Time *
          </label>
          <input
            type="text"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            placeholder="e.g., 12:00 PM"
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
          Food Name *
        </label>
        <input
          type="text"
          value={formData.foodName}
          onChange={(e) => setFormData(prev => ({ ...prev, foodName: e.target.value }))}
          placeholder="e.g., Grilled Chicken Salad"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #cbd5e0',
            borderRadius: '0.25rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: '500' }}>
          Calories *
        </label>
        <input
          type="number"
          value={formData.calories}
          onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
          placeholder="e.g., 450"
          required
          min="0"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #cbd5e0',
            borderRadius: '0.25rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem',
            background: '#e2e8f0',
            color: '#2d3748',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          Add Meal
        </button>
      </div>
    </form>
  );
}