import React, { useState } from 'react';
import { Plus, Play, Calendar, Clock, Zap, Target } from 'lucide-react';
import { Task } from '../types';

interface QuickActionsProps {
  onQuickAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onStartQuickSession: (duration: number) => void;
  todaysSessions: any[];
  onSelectTask: (task: Task) => void;
  upcomingSessions: any[];
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onQuickAddTask,
  onStartQuickSession,
  todaysSessions,
  upcomingSessions
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  const handleQuickAdd = () => {
    if (quickTaskTitle.trim()) {
      onQuickAddTask({
        title: quickTaskTitle,
        description: '',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week default
        importance: false,
        estimatedHours: 1,
        status: 'pending',
        impact: 'low'
      });
      setQuickTaskTitle('');
      setShowQuickAdd(false);
    }
  };

  const nextSession = upcomingSessions[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Zap className="mr-2 text-yellow-500" size={20} />
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Quick Add Task */}
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          <Plus className="text-blue-600 dark:text-blue-400 mb-1" size={20} />
          <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Add Task</span>
        </button>

        {/* Quick Timer */}
        <button
          onClick={() => onStartQuickSession(25)}
          className="flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors"
        >
          <Play className="text-green-600 dark:text-green-400 mb-1" size={20} />
          <span className="text-xs font-medium text-green-800 dark:text-green-200">25min Focus</span>
        </button>

        {/* Next Session */}
        {nextSession && (
          <button
            onClick={() => {/* Start next session */}}
            className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
          >
            <Target className="text-purple-600 dark:text-purple-400 mb-1" size={20} />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-200">Next Session</span>
          </button>
        )}

        {/* Today's Progress */}
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Clock className="text-gray-600 dark:text-gray-400 mb-1" size={20} />
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
            {todaysSessions.filter(s => s.done).length}/{todaysSessions.length} Done
          </span>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">Quick Add Task</h4>
            <input
              type="text"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleQuickAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;