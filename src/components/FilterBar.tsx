import React from 'react';
import { TaskFilter } from '../types';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  taskCounts: {
    total: number;
    active: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange, taskCounts }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ ...filter, status: e.target.value as TaskFilter['status'] })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All ({taskCounts.total})</option>
              <option value="active">Active ({taskCounts.active})</option>
              <option value="completed">Completed ({taskCounts.completed})</option>
            </select>
          </div>

          <select
            value={filter.priority}
            onChange={(e) => onFilterChange({ ...filter, priority: e.target.value as TaskFilter['priority'] })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
};