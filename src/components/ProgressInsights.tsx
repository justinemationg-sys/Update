import React from 'react';
import { TrendingUp, Target, Clock, Calendar, Award, AlertCircle } from 'lucide-react';
import { Task, StudyPlan } from '../types';

interface ProgressInsightsProps {
  tasks: Task[];
  studyPlans: StudyPlan[];
  weeklyGoal?: number;
}

const ProgressInsights: React.FC<ProgressInsightsProps> = ({ 
  tasks, 
  studyPlans, 
  weeklyGoal = 20 
}) => {
  // Calculate insights
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  
  // Weekly progress
  const thisWeek = new Date();
  const weekStart = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()));
  const weeklyPlans = studyPlans.filter(plan => new Date(plan.date) >= weekStart);
  const weeklyHoursCompleted = weeklyPlans.reduce((sum, plan) => 
    sum + plan.plannedTasks.filter(s => s.done).reduce((sessionSum, session) => 
      sessionSum + session.allocatedHours, 0), 0);

  // Productivity trends
  const last7Days = studyPlans.slice(-7);
  const avgDailyHours = last7Days.reduce((sum, plan) => 
    sum + plan.plannedTasks.filter(s => s.done).reduce((sessionSum, session) => 
      sessionSum + session.allocatedHours, 0), 0) / 7;

  // Task completion rate
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  // Upcoming deadlines
  const upcomingDeadlines = pendingTasks
    .filter(task => {
      const deadline = new Date(task.deadline);
      const daysUntil = (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7 && daysUntil > 0;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const insights = [
    {
      title: 'Weekly Progress',
      value: `${weeklyHoursCompleted.toFixed(1)}h / ${weeklyGoal}h`,
      percentage: (weeklyHoursCompleted / weeklyGoal) * 100,
      icon: Target,
      color: 'blue',
      trend: weeklyHoursCompleted >= weeklyGoal * 0.8 ? 'good' : 'needs-attention'
    },
    {
      title: 'Task Completion',
      value: `${completionRate.toFixed(0)}%`,
      percentage: completionRate,
      icon: Award,
      color: 'green',
      trend: completionRate >= 70 ? 'good' : 'needs-attention'
    },
    {
      title: 'Daily Average',
      value: `${avgDailyHours.toFixed(1)}h`,
      percentage: (avgDailyHours / 4) * 100, // Assuming 4h daily goal
      icon: Clock,
      color: 'purple',
      trend: avgDailyHours >= 2 ? 'good' : 'needs-attention'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <TrendingUp className="mr-2 text-blue-500" size={20} />
        Progress Insights
      </h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <insight.icon 
                className={`text-${insight.color}-500`} 
                size={20} 
              />
              <span className={`text-xs px-2 py-1 rounded-full ${
                insight.trend === 'good' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {insight.trend === 'good' ? 'On Track' : 'Needs Focus'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {insight.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {insight.title}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className={`bg-${insight.color}-500 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(100, insight.percentage)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 mr-2" size={20} />
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              Upcoming Deadlines This Week
            </h4>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.slice(0, 3).map((task) => {
              const daysUntil = Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={task.id} className="flex justify-between items-center text-sm">
                  <span className="text-yellow-800 dark:text-yellow-200">{task.title}</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {completionRate >= 80 ? 
            "🎉 Excellent progress! You're crushing your goals!" :
            completionRate >= 60 ?
            "💪 Good momentum! Keep pushing forward!" :
            "🚀 Every small step counts. You've got this!"
          }
        </p>
      </div>
    </div>
  );
};

export default ProgressInsights;