import React from 'react';
import { Modal } from '../common/Button';
import TaskForm from './TaskForm';

export default function TaskEditModal({ 
  isOpen, 
  task, 
  onClose, 
  onSave 
}) {
  const handleSubmit = (formData) => {
    onSave(task.id, formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Add Task'}
    >
      <TaskForm
        initialData={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}