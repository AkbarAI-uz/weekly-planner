import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';

export default function TaskList({ dayIndex }) {
  const { tasks, createTask, toggleTask, deleteTask, updateTask } = useTasks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    category: 'general',
    estimatedMinutes: ''
  });

  const dayTasks = tasks
    .filter(t => t.dayIndex === dayIndex)
    .sort((a, b) => a.order - b.order);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          name: formData.name,
          time: formData.time,
          category: formData.category,
          estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null
        });
        setEditingTask(null);
      } else {
        await createTask(dayIndex, {
          name: formData.name,
          time: formData.time,
          category: formData.category,
          estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null
        });
      }
      
      setFormData({ name: '', time: '', category: 'general', estimatedMinutes: '' });
      setShowAddForm(false);
    } catch (error) {
      alert('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      time: task.time,
      category: task.category,
      estimatedMinutes: task.estimatedMinutes || ''
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTask(null);
    setFormData({ name: '', time: '', category: 'general', estimatedMinutes: '' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: '#667eea',
      personal: '#48bb78',
      health: '#ed8936',
      general: '#718096'
    };
    return colors[category] || colors.general;
  };

  return (
    <div>
      {/* Task List */}
      {dayTasks.length === 0 && !showAddForm && (
        <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>
          No tasks for this day yet
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {dayTasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: task.isCompleted ? '#f0fff4' : '#f7fafc',
              borderLeft: `4px solid ${getCategoryColor(task.category)}`,
              borderRadius: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask(task.id)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />

            {/* Task Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '500',
                textDecoration: task.isCompleted ? 'line-through' : 'none',
                color: task.isCompleted ? '#718096' : '#2d3748',
                marginBottom: '0.25rem'
              }}>
                {task.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096', display: 'flex', gap: '0.75rem' }}>
                <span>🕐 {task.time}</span>
                {task.estimatedMinutes && <span>⏱️ {task.estimatedMinutes}min</span>}
                <span style={{
                  padding: '0.125rem 0.5rem',
                  background: getCategoryColor(task.category),
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem',
                  fontWeight: '500'
                }}>
                  {task.category}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleEdit(task)}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: 'transparent',
                  color: '#667eea',
                  border: '1px solid #667eea',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this task?')) {
                    deleteTask(task.id);
                  }
                }}
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
          </div>
        ))}
      </div>

      {/* Add/Edit Task Form */}
      {showAddForm ? (
        <form onSubmit={handleSubmit} style={{
          padding: '1rem',
          background: '#edf2f7',
          borderRadius: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              Task Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="e.g., Morning workout"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #cbd5e0',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Time *
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
                placeholder="e.g., 5:00 AM"
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #cbd5e0',
                  borderRadius: '0.25rem',
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
              Estimated Time (minutes)
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
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancel}
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
              {editingTask ? 'Update' : 'Add'} Task
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            color: '#667eea',
            border: '2px dashed #667eea',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          + Add New Task
        </button>
      )}
    </div>
  );
}