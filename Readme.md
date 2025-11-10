# Weekly Planner - Architecture Enhancement Plan

## Current Architecture Analysis

### Strengths
- Simple file-based storage system
- Clear separation between main and renderer processes
- Good use of IPC communication
- React component structure

### Areas for Improvement

## 1. **Separation of Concerns**

### Current Issues
- Business logic mixed with UI in `App.js`
- Data management scattered across component
- No clear state management pattern
- Storage logic tightly coupled to main process

### Proposed Solution

```
src/
├── main/
│   ├── index.js                 # Main process entry
│   ├── storage/
│   │   ├── StorageManager.js    # Abstract storage interface
│   │   ├── FileStorage.js       # File-based implementation
│   │   └── migrations.js        # Data migrations
│   ├── services/
│   │   ├── WeekService.js       # Week business logic
│   │   ├── TaskService.js       # Task operations
│   │   └── MealService.js       # Meal tracking
│   ├── ipc/
│   │   └── handlers.js          # IPC handler registration
│   └── utils/
│       ├── notifications.js     # Notification helpers
│       └── tray.js              # System tray setup
├── renderer/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeekHeader/
│   │   │   ├── DaySelector/
│   │   │   ├── TaskList/
│   │   │   ├── Hydration/
│   │   │   ├── Meals/
│   │   │   └── Notes/
│   │   ├── contexts/
│   │   │   └── WeekContext.js   # Global state
│   │   ├── hooks/
│   │   │   ├── useWeek.js
│   │   │   ├── useTasks.js
│   │   │   └── useMeals.js
│   │   ├── services/
│   │   │   └── api.js           # IPC wrapper
│   │   └── utils/
│   │       └── dateHelpers.js
│   └── App.js
└── shared/
    ├── types/
    │   └── index.js             # TypeScript/JSDoc types
    └── constants/
        └── index.js             # Shared constants
```

## 2. **State Management Enhancement**

### Implement Context + Reducer Pattern

```javascript
// contexts/WeekContext.js
const WeekContext = createContext();

function weekReducer(state, action) {
  switch (action.type) {
    case 'SET_WEEK':
      return { ...state, currentWeek: action.payload };
    case 'UPDATE_TASK':
      return {
        ...state,
        currentWeek: {
          ...state.currentWeek,
          tasks: state.currentWeek.tasks.map(t =>
            t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
          )
        }
      };
    // ... more cases
  }
}

export function WeekProvider({ children }) {
  const [state, dispatch] = useReducer(weekReducer, initialState);
  return (
    <WeekContext.Provider value={{ state, dispatch }}>
      {children}
    </WeekContext.Provider>
  );
}
```

## 3. **Service Layer Architecture**

### Main Process Services

```javascript
// main/services/WeekService.js
class WeekService {
  constructor(storage) {
    this.storage = storage;
  }

  async getCurrentWeek() {
    return this.storage.get('currentWeek');
  }

  async archiveWeek() {
    const current = await this.getCurrentWeek();
    current.is_current = false;
    current.archived_date = new Date().toISOString();
    
    await this.storage.archive(current);
    const newWeek = this.createNewWeek();
    await this.storage.set('currentWeek', newWeek);
    
    return newWeek;
  }

  createNewWeek() {
    // Week creation logic
  }

  async getWeekStats(weekId) {
    // Analytics logic
  }
}
```

### Renderer Services

```javascript
// renderer/services/api.js
class WeekAPI {
  async getCurrentWeek() {
    return window.electronAPI.getCurrentWeek();
  }

  async updateTask(taskId, updates) {
    return window.electronAPI.updateTask(taskId, updates);
  }
  
  // Cache implementation
  cache = new Map();
  
  async getCachedWeek() {
    if (this.cache.has('currentWeek')) {
      return this.cache.get('currentWeek');
    }
    const week = await this.getCurrentWeek();
    this.cache.set('currentWeek', week);
    return week;
  }
}

export default new WeekAPI();
```

## 4. **Component Modularity**

### Break Down Large Components

```javascript
// components/TaskList/TaskList.jsx
export function TaskList({ tasks, dayIndex, isFutureDay }) {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          isFutureDay={isFutureDay} 
        />
      ))}
    </div>
  );
}

// components/TaskList/TaskItem.jsx
export function TaskItem({ task, isFutureDay }) {
  const [isEditing, setIsEditing] = useState(false);
  const { toggleTask, updateTask, deleteTask } = useTasks();
  
  if (isEditing) {
    return <TaskEditForm task={task} onSave={...} onCancel={...} />;
  }
  
  return <TaskDisplay task={task} onEdit={...} />;
}
```

## 5. **Error Handling & Logging**

```javascript
// main/utils/logger.js
class Logger {
  info(message, meta) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
  }
  
  error(message, error, meta) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
      error: error.message,
      stack: error.stack,
      ...meta
    });
  }
}

// main/utils/errorHandler.js
class ErrorHandler {
  handle(error, context) {
    logger.error('Operation failed', error, { context });
    
    // Show user-friendly notification
    new Notification({
      title: 'Error',
      body: this.getUserMessage(error)
    }).show();
  }
  
  getUserMessage(error) {
    // Map technical errors to user-friendly messages
  }
}
```

## 6. **Data Validation & Types**

```javascript
// shared/types/index.js
/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {number} day_index
 * @property {string} time
 * @property {string} task_name
 * @property {boolean} is_editable
 * @property {boolean} is_completed
 * @property {number} order
 */

// main/validators/taskValidator.js
class TaskValidator {
  validate(task) {
    const errors = [];
    
    if (!task.time || !/^\d{1,2}:\d{2}\s?(AM|PM)?/.test(task.time)) {
      errors.push('Invalid time format');
    }
    
    if (!task.task_name || task.task_name.length < 1) {
      errors.push('Task name is required');
    }
    
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    
    return true;
  }
}
```

## 7. **Testing Structure**

```
tests/
├── unit/
│   ├── services/
│   │   ├── WeekService.test.js
│   │   └── TaskService.test.js
│   └── components/
│       ├── TaskList.test.jsx
│       └── Hydration.test.jsx
├── integration/
│   ├── ipc.test.js
│   └── storage.test.js
└── e2e/
    └── userFlows.spec.js
```

## 8. **Configuration Management**

```javascript
// main/config/index.js
const config = {
  storage: {
    path: app.getPath('userData'),
    filename: 'planner-data.json',
    backupEnabled: true,
    backupInterval: 3600000 // 1 hour
  },
  notifications: {
    enabled: true,
    taskReminders: true,
    reminderMinutes: 15
  },
  features: {
    analytics: true,
    export: true,
    sync: false
  }
};
```

## 9. **Performance Optimizations**

### Memoization & Lazy Loading

```javascript
// Use React.memo for expensive components
const TaskList = React.memo(({ tasks }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.tasks.length === nextProps.tasks.length &&
         prevProps.tasks.every((t, i) => t.id === nextProps.tasks[i].id);
});

// Lazy load archive view
const ArchiveView = React.lazy(() => import('./views/ArchiveView'));

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';
```

## 10. **Security Enhancements**

```javascript
// preload.js - Minimal exposure
contextBridge.exposeInMainWorld('electronAPI', {
  // Only expose what's needed
  week: {
    getCurrent: () => ipcRenderer.invoke('week:get-current'),
    update: (updates) => ipcRenderer.invoke('week:update', updates)
  },
  tasks: {
    toggle: (id) => ipcRenderer.invoke('task:toggle', id),
    update: (id, updates) => ipcRenderer.invoke('task:update', id, updates)
  }
});

// Input sanitization
function sanitizeInput(input) {
  return input.trim().replace(/[<>]/g, '');
}
```

## Implementation Priority

1. **High Priority**
   - Service layer extraction (Week, Task, Meal services)
   - Component breakdown (TaskList, TaskItem, etc.)
   - Context-based state management
   - Error handling system

2. **Medium Priority**
   - Data validation
   - Configuration management
   - Logging system
   - Performance optimizations

3. **Low Priority**
   - Testing infrastructure
   - Advanced caching
   - Analytics features
   - Sync capabilities

## Migration Strategy

1. **Phase 1**: Create service layer without breaking existing code
2. **Phase 2**: Implement Context API alongside current state
3. **Phase 3**: Break down components incrementally
4. **Phase 4**: Add validation and error handling
5. **Phase 5**: Implement testing and optimization

## Benefits

- **Maintainability**: Clear separation of concerns
- **Testability**: Isolated units easy to test
- **Scalability**: Easy to add features
- **Reliability**: Better error handling
- **Performance**: Optimized rendering and data flow
- **Developer Experience**: Clearer code organization
