import React, { useState, useEffect, useCallback } from 'react';
import { useWeekContext } from '../../contexts/WeekContext';
import TaskList from '../tasks/TaskList';

export default function DayView({ dayIndex }) {
  const { state } = useWeekContext();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [dailyData, setDailyData] = useState({ waterGlasses: 0, notes: '' });
  const [meals, setMeals] = useState([]);

  const loadDayData = useCallback(() => {
    if (!state.currentWeek) return;
    
    const dayData = state.currentWeek.dailyData.find(d => d.dayIndex === dayIndex);
    const dayMeals = state.currentWeek.meals.filter(m => m.dayIndex === dayIndex);
    
    if (dayData) {
      setDailyData(dayData);
    }
    setMeals(dayMeals);
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

  const handleNotesUpdate = async () => {
    try {
      await window.electronAPI.dailyData.update(
        state.currentWeek.id,
        dayIndex,
        { notes: dailyData.notes }
      );
      alert('Notes saved!');
    } catch (error) {
      console.error('Failed to save notes:', error);
      alert('Failed to save notes');
    }
  };

  const handleAddMeal = async () => {
    const foodName = prompt('Food name:');
    if (!foodName) return;

    const calories = prompt('Calories:');
    if (!calories) return;

    const time = prompt('Time (e.g., 12:00 PM):');
    if (!time) return;

    try {
      const meal = await window.electronAPI.meal.create(
        state.currentWeek.id,
        dayIndex,
        {
          mealType: 'lunch',
          time,
          foodName,
          calories: parseInt(calories)
        }
      );
      setMeals(prev => [...prev, meal]);
    } catch (error) {
      console.error('Failed to add meal:', error);
      alert('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Delete this meal?')) return;

    try {
      await window.electronAPI.meal.delete(mealId);
      setMeals(prev => prev.filter(m => m.id !== mealId));
    } catch (error) {
      console.error('Failed to delete meal:', error);
      alert('Failed to delete meal');
    }
  };

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

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

      {/* Water Tracker */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            💧 Water Intake
          </h3>
          <span style={{ fontSize: '0.875rem', color: '#718096' }}>
            {dailyData.waterGlasses} / 8 glasses
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[...Array(8)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleWaterUpdate(i < dailyData.waterGlasses ? i : i + 1)}
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1.5rem',
                background: i < dailyData.waterGlasses ? '#4299e1' : '#e2e8f0',
                transition: 'all 0.2s'
              }}
            >
              💧
            </button>
          ))}
        </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
            🍽️ Meals
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#718096' }}>
              Total: {totalCalories} cal
            </span>
            <button
              onClick={handleAddMeal}
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
        
        {meals.length === 0 ? (
          <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>
            No meals tracked yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {meals.map(meal => (
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
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          📝 Daily Notes
        </h3>
        <textarea
          value={dailyData.notes}
          onChange={(e) => setDailyData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Write your thoughts, ideas, or reflections for today..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button
            onClick={handleNotesUpdate}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}