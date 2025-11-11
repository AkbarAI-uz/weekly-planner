import React from 'react';
import { Card } from '../common/Button';

export default function CalorieTracker({ 
  meals = [], 
  dailyGoal = 2000,
  showBreakdown = true 
}) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const percentage = Math.min((totalCalories / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - totalCalories, 0);
  const isOverGoal = totalCalories > dailyGoal;

  // Calculate calories by meal type
  const caloriesByType = {
    breakfast: meals.filter(m => m.mealType === 'breakfast').reduce((s, m) => s + m.calories, 0),
    lunch: meals.filter(m => m.mealType === 'lunch').reduce((s, m) => s + m.calories, 0),
    dinner: meals.filter(m => m.mealType === 'dinner').reduce((s, m) => s + m.calories, 0),
    snack: meals.filter(m => m.mealType === 'snack').reduce((s, m) => s + m.calories, 0)
  };

  return (
    <Card>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🔥 Calorie Tracker
      </h3>

      {/* Main Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          padding: '1rem',
          background: isOverGoal ? '#fff5f5' : '#f0fff4',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#718096',
            marginBottom: '0.25rem'
          }}>
            Consumed
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: isOverGoal ? '#e53e3e' : '#48bb78'
          }}>
            {totalCalories}
          </div>
        </div>

        <div style={{
          padding: '1rem',
          background: '#f7fafc',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#718096',
            marginBottom: '0.25rem'
          }}>
            {isOverGoal ? 'Over Goal' : 'Remaining'}
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: isOverGoal ? '#e53e3e' : '#667eea'
          }}>
            {isOverGoal ? totalCalories - dailyGoal : remaining}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#718096',
          marginBottom: '0.5rem'
        }}>
          <span>Progress</span>
          <span>{Math.round(percentage)}% of {dailyGoal} cal goal</span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          background: '#e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: isOverGoal
              ? 'linear-gradient(90deg, #fc8181 0%, #e53e3e 100%)'
              : percentage >= 80
              ? 'linear-gradient(90deg, #f6ad55 0%, #ed8936 100%)'
              : 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)',
            transition: 'width 0.3s ease'
          }} />
          
          {/* Goal marker */}
          {!isOverGoal && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#667eea'
            }} />
          )}
        </div>
      </div>

      {/* Breakdown by Meal Type */}
      {showBreakdown && meals.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f7fafc',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            color: '#4a5568'
          }}>
            Breakdown
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem'
          }}>
            {[
              { type: 'breakfast', icon: '🌅', label: 'Breakfast' },
              { type: 'lunch', icon: '☀️', label: 'Lunch' },
              { type: 'dinner', icon: '🌙', label: 'Dinner' },
              { type: 'snack', icon: '🍎', label: 'Snacks' }
            ].map(({ type, icon, label }) => {
              const calories = caloriesByType[type];
              if (calories === 0) return null;
              
              return (
                <div
                  key={type}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    background: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {icon} {label}
                  </span>
                  <span style={{ fontWeight: '600', color: '#ed8936' }}>
                    {calories} cal
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Message */}
      {meals.length > 0 && (
        <p style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: isOverGoal ? '#fff5f5' : percentage >= 80 ? '#fffbeb' : '#ebf8ff',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: isOverGoal ? '#742a2a' : percentage >= 80 ? '#744210' : '#2c5282',
          textAlign: 'center'
        }}>
          {isOverGoal 
            ? '⚠️ You\'ve exceeded your daily calorie goal'
            : percentage >= 80
            ? '⚡ Almost at your goal! Stay mindful'
            : percentage >= 50
            ? '👍 Good progress! Keep it balanced'
            : '🎯 Great start! Stay on track'}
        </p>
      )}
    </Card>
  );
}