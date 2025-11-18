
import React from 'react';
import { BotIcon } from './Icons';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
        <BotIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl flex items-center space-x-1.5 shadow-sm">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
