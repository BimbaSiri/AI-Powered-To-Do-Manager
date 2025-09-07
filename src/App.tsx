import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilter, AIsuggestion } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { AISuggestions } from './components/AISuggestions';
import { FilterBar } from './components/FilterBar';
import { loadTasks, saveTasks } from './utils/storage';
import { Plus, CheckSquare, Brain } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    search: '',
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Filter tasks based on current filter settings
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filter.status === 'active' && task.completed) return false;
      if (filter.status === 'completed' && !task.completed) return false;

      // Priority filter
      if (filter.priority !== 'all' && task.priority !== filter.priority) return false;

      // Search filter
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchTerm);
        const matchesDescription = task.description.toLowerCase().includes(searchTerm);
        if (!matchesTitle && !matchesDescription) return false;
      }

      return true;
    });
  }, [tasks, filter]);

  // Calculate task counts for filter bar
  const taskCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date(),
    };

    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleAddAISuggestion = (suggestion: AIsuggestion) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Todo Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Organize your tasks with smart prioritization and intelligent suggestions
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskCounts.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskCounts.active}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        {/* Tasks List */}
        <div className="space-y-4 mb-20">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {tasks.length === 0
                  ? 'Create your first task to get started with your productivity journey'
                  : 'Try adjusting your filters or create a new task'
                }
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* AI Suggestions Button */}
        <AISuggestions onAddTask={handleAddAISuggestion} />

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;