import React, { useState } from 'react';
import MealItem from './MealItem';
import MealForm from './MealForm';
import { Card } from '../common/Button';
import { useMeals } from '../../hooks/useMeals';

export default function MealList({ dayIndex }) {
  const { meals, createMeal, deleteMeal } = useMeals();
  const [showForm, setShowForm] = useState(false);

  const dayMeals = meals
    .filter(m => m.dayIndex === dayIndex)
    .sort((a, b) => {
      const order = { breakfast: 1, lunch: 2, dinner: 3, snack: 4 };
      return order[a.mealType] - order[b.mealType];
    });

  const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);

  const handleAddMeal = async (mealData) => {
    try {
      await createMeal(dayIndex, mealData);
      setShowForm(false);
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

  const getMealsByType = (type) => {
    return dayMeals.filter(m => m.mealType === type);
  };

  const mealTypes = [
    { type: 'breakfast', icon: '🌅', label: 'Breakfast' },
    { type: 'lunch', icon: '☀️', label: 'Lunch' },
    { type: 'dinner', icon: '🌙', label: 'Dinner' },
    { type: 'snack', icon: '🍎', label: 'Snacks' }
  ];

  return (
    <Card>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.25rem'
          }}>
            🍽️ Meals & Nutrition
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#718096'
          }}>
            Total: <span style={{ fontWeight: '600', color: '#ed8936' }}>{totalCalories}</span> calories
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            background: showForm ? '#e2e8f0' : '#667eea',
            color: showForm ? '#2d3748' : 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Meal'}
        </button>
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <div style={{ marginBottom: '1.5rem' }}>
          <MealForm
            onSubmit={handleAddMeal}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Meals by Type */}
      {dayMeals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: '#a0aec0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <p>No meals tracked yet</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Click "Add Meal" to start tracking
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {mealTypes.map(({ type, icon, label }) => {
            const typeMeals = getMealsByType(type);
            if (typeMeals.length === 0) return null;

            const typeCalories = typeMeals.reduce((sum, m) => sum + m.calories, 0);

            return (
              <div key={type}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#2d3748'
                  }}>
                    <span>{icon}</span>
                    {label}
                  </h4>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#ed8936'
                  }}>
                    {typeCalories} cal
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {typeMeals.map(meal => (
                    <MealItem
                      key={meal.id}
                      meal={meal}
                      onDelete={() => handleDeleteMeal(meal.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily Summary */}
      {dayMeals.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f7fafc',
          borderRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
              Daily Total
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ed8936' }}>
              {totalCalories} calories
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
              Meals Logged
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
              {dayMeals.length}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}