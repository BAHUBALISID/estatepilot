'use client';

import { motion } from 'framer-motion';
import { MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface ChatViewerProps {
  messages: Message[];
}

export function ChatViewer({ messages }: ChatViewerProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex gap-3',
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.sender === 'bot' && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div className={cn(
            'max-w-[70%] rounded-2xl px-4 py-3',
            message.sender === 'user'
              ? 'bg-primary-600 text-white rounded-tr-none'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
          )}>
            <p className="whitespace-pre-wrap">{message.text}</p>
            <div className={cn(
              'text-xs mt-2',
              message.sender === 'user'
                ? 'text-primary-200'
                : 'text-gray-500 dark:text-gray-400'
            )}>
              {message.time}
            </div>
          </div>
          
          {message.sender === 'user' && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
