
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message } from './types';
import { initializeChat } from './services/geminiService';
import { SYSTEM_INSTRUCTION } from './constants';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { BotIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! I'm MiniChat, a lightweight AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatRef.current = initializeChat(SYSTEM_INSTRUCTION);
    } catch (e) {
      setError('Failed to initialize the chat service. Please check your API key.');
      console.error(e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (isLoading || !userInput.trim()) return;

    setIsLoading(true);
    setError(null);
    const userMessage: Message = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);

    if (!chatRef.current) {
      setError('Chat is not initialized.');
      setIsLoading(false);
      return;
    }

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userInput });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = 'Sorry, something went wrong. Please try again.';
      setError(errorMessage);
      setMessages(prev => {
         const newMessages = [...prev];
         if (newMessages[newMessages.length - 1].role === 'model' && newMessages[newMessages.length - 1].text === '') {
            newMessages[newMessages.length - 1].text = errorMessage;
         } else {
            newMessages.push({ role: 'model', text: errorMessage });
         }
         return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
        <header className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-full">
                <BotIcon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">MiniChat</h1>
                <p className="text-sm text-green-500">Online</p>
            </div>
        </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;
