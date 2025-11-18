
import React from 'react';
import { Message } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  const containerClasses = isModel
    ? 'flex items-start space-x-4'
    : 'flex items-start flex-row-reverse space-x-4 space-x-reverse';
  
  const bubbleClasses = isModel
    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    : 'bg-blue-500 text-white';

  const avatar = isModel ? (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
      <BotIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </div>
  ) : (
     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
      <UserIcon className="w-5 h-5 text-blue-600" />
    </div>
  );

  return (
    <div className={containerClasses}>
      {avatar}
      <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${bubbleClasses} shadow-sm`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
