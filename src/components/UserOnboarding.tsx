import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, Target, ArrowRight } from 'lucide-react';

interface UserOnboardingProps {
  onComplete: (preferences: {
    studyStyle: 'focused' | 'flexible' | 'intensive';
    dailyHours: number;
    workDays: number[];
    preferredTimes: string[];
  }) => void;
  onSkip: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    studyStyle: 'focused' as const,
    dailyHours: 4,
    workDays: [1, 2, 3, 4, 5],
    preferredTimes: ['morning']
  });

  const handleComplete = () => {
    onComplete(preferences);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome to TimePilot! 🚀
            </h2>
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip Setup
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">What's your study style?</h3>
              <div className="space-y-3">
                {[
                  { key: 'focused', label: 'Focused Sessions', desc: 'I prefer longer, uninterrupted study blocks' },
                  { key: 'flexible', label: 'Flexible Schedule', desc: 'I like shorter sessions spread throughout the day' },
                  { key: 'intensive', label: 'Intensive Bursts', desc: 'I work best under pressure with deadline-driven scheduling' }
                ].map((style) => (
                  <label key={style.key} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="studyStyle"
                      value={style.key}
                      checked={preferences.studyStyle === style.key}
                      onChange={(e) => setPreferences({...preferences, studyStyle: e.target.value as any})}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{style.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">How many hours can you study per day?</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={preferences.dailyHours}
                  onChange={(e) => setPreferences({...preferences, dailyHours: parseInt(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-600">{preferences.dailyHours}h</span>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Start conservative! You can always increase this later as you build momentum.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Which days work best for studying?</h3>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <button
                    key={day}
                    onClick={() => {
                      const newDays = preferences.workDays.includes(index)
                        ? preferences.workDays.filter(d => d !== index)
                        : [...preferences.workDays, index];
                      setPreferences({...preferences, workDays: newDays});
                    }}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      preferences.workDays.includes(index)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">You're all set! 🎉</h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Your Study Profile:</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Style: {preferences.studyStyle}</li>
                  <li>• Daily Hours: {preferences.dailyHours}h</li>
                  <li>• Work Days: {preferences.workDays.length} days/week</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                Don't worry - you can change these settings anytime in the Settings tab!
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Get Started!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;