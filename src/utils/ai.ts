import { AIsuggestion } from '../types';

const importantTaskSuggestions: AIsuggestion[] = [
  {
    id: 'important-1',
    title: 'Review urgent project deadline',
    description: 'Check and prioritize tasks that are approaching critical deadlines',
    priority: 'high'
  },
  {
    id: 'important-2',
    title: 'Schedule important meeting',
    description: 'Set up crucial discussion with key stakeholders',
    priority: 'high'
  },
  {
    id: 'important-3',
    title: 'Complete high-impact task',
    description: 'Focus on task that will have significant positive impact',
    priority: 'high'
  },
  {
    id: 'important-4',
    title: 'Follow up on pending items',
    description: 'Check status of important pending tasks and communications',
    priority: 'medium'
  },
  {
    id: 'important-5',
    title: 'Plan next week priorities',
    description: 'Organize and prioritize upcoming tasks for better productivity',
    priority: 'medium'
  },
  {
    id: 'important-6',
    title: 'Review and organize workspace',
    description: 'Clean and organize physical or digital workspace for better focus',
    priority: 'low'
  },
  {
    id: 'important-7',
    title: 'Update progress tracking',
    description: 'Record progress on ongoing projects and goals',
    priority: 'low'
  }
];

export const generateAISuggestions = (): AIsuggestion[] => {
  // Shuffle and return a random selection of important tasks
  const shuffled = [...importantTaskSuggestions].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4); // Return 4 suggestions
  return selected.map(suggestion => ({
    ...suggestion,
    id: `${suggestion.id}-${Date.now()}`
  }));
};

export const getSmartPriorityRecommendation = (title: string, description: string): 'low' | 'medium' | 'high' => {
  const text = (title + ' ' + description).toLowerCase();
  
  // High priority indicators - focus on urgency and importance
  if (text.includes('urgent') || text.includes('asap') || text.includes('critical') || 
      text.includes('important') || text.includes('deadline') || text.includes('due') ||
      text.includes('emergency') || text.includes('priority') || text.includes('must') ||
      text.includes('required') || text.includes('essential') || text.includes('crucial')) {
    return 'high';
  }
  
  // Medium priority indicators - moderately important tasks
  if (text.includes('soon') || text.includes('schedule') || text.includes('meeting') || 
      text.includes('review') || text.includes('complete') || text.includes('follow up') ||
      text.includes('check') || text.includes('update') || text.includes('plan') ||
      text.includes('organize') || text.includes('prepare')) {
    return 'medium';
  }
  
  // Low priority for everything else
  return 'low';
};