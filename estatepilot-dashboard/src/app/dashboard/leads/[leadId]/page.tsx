'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  MessageSquare,
  User,
  MoreVertical,
  Send
} from 'lucide-react';
import { ChatViewer } from '@/components/chat/ChatViewer';
import { LeadMetaPanel } from '@/components/chat/LeadMetaPanel';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { cn } from '@/lib/cn';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with API call
  const lead = {
    id: params.leadId,
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    status: 'HOT',
    project: 'Sky Towers',
    budget: '₹1.2Cr - ₹1.8Cr',
    unitType: '3BHK',
    timeline: 'Immediate',
    language: 'English',
    qualificationScore: 9,
    lastMessage: '2 hours ago',
    createdAt: '2024-01-15T10:30:00Z',
    location: 'Mumbai, Maharashtra',
    intent: 'PRICING',
    followupCount: 2,
    nextFollowupAt: '2024-01-16T14:00:00Z'
  };

  const messages = [
    { id: 1, sender: 'user', text: 'Hi, I\'m interested in Sky Towers project', time: '10:30 AM' },
    { id: 2, sender: 'bot', text: 'Hello! Welcome to Sky Towers. I\'m your AI assistant. How can I help you today?', time: '10:31 AM' },
    { id: 3, sender: 'user', text: 'Can you tell me about the pricing?', time: '10:32 AM' },
    { id: 4, sender: 'bot', text: 'The price range for Sky Towers is ₹1.2Cr to ₹2.5Cr. We have 2BHK, 3BHK, and Penthouse units available.', time: '10:33 AM' },
    { id: 5, sender: 'user', text: 'What about 3BHK specifically?', time: '10:35 AM' },
    { id: 6, sender: 'bot', text: '3BHK units range from ₹1.5Cr to ₹1.8Cr, with carpet area of 1200-1400 sq.ft. Would you like to know about payment plans?', time: '10:36 AM' },
    { id: 7, sender: 'user', text: 'Yes, please share payment options', time: '10:40 AM' },
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    // Send message API call here
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessage('');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {lead.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={lead.status} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {lead.project}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            <Phone className="h-4 w-4" />
            Call Now
          </button>
          <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {lead.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.phone} • {lead.language}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last seen {lead.lastMessage}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <ChatViewer messages={messages} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message here..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Information */}
          <LeadMetaPanel lead={lead} />

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Schedule Follow-up</span>
                </div>
                <Calendar className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium">Send Email</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">Schedule Site Visit</span>
                </div>
              </button>
            </div>
          </div>

          {/* Qualification Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Qualification Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Overall Score</span>
                  <span className="font-medium">{lead.qualificationScore}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      lead.qualificationScore >= 8
                        ? 'bg-red-500'
                        : lead.qualificationScore >= 4
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    )}
                    style={{ width: `${lead.qualificationScore * 10}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-medium">Budget</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Set</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium">Unit Type</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Set</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <div className="text-sm font-medium">Timeline</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Set</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
