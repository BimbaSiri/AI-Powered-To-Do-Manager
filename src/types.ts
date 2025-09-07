export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  search: string;
}

export interface AIsuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}