'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Phone,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { cn } from '@/lib/cn';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Mock data - replace with API call
  const leads = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      status: 'HOT',
      project: 'Sky Towers',
      budget: '₹1.2Cr - ₹1.8Cr',
      unitType: '3BHK',
      timeline: 'Immediate',
      lastMessage: '2 hours ago',
      messages: 12,
      qualificationScore: 9,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      status: 'WARM',
      project: 'Green Valley',
      budget: '₹80L - ₹1.2Cr',
      unitType: '2BHK',
      timeline: '1-3 months',
      lastMessage: '1 day ago',
      messages: 8,
      qualificationScore: 6,
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      name: 'Amit Patel',
      phone: '+91 98765 43212',
      status: 'COLD',
      project: 'Royal Residency',
      budget: '₹2Cr+',
      unitType: '4BHK',
      timeline: 'Exploring',
      lastMessage: '3 days ago',
      messages: 4,
      qualificationScore: 3,
      createdAt: '2024-01-12T09:15:00Z'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      phone: '+91 98765 43213',
      status: 'HOT',
      project: 'Sky Towers',
      budget: '₹1.5Cr - ₹2Cr',
      unitType: 'Penthouse',
      timeline: 'Immediate',
      lastMessage: '5 hours ago',
      messages: 15,
      qualificationScore: 10,
      createdAt: '2024-01-15T08:45:00Z'
    },
  ];

  const filteredLeads = leads.filter(lead => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (search && !lead.name.toLowerCase().includes(search.toLowerCase()) && 
        !lead.phone.includes(search)) return false;
    return true;
  });

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'HOT').length,
    warm: leads.filter(l => l.status === 'WARM').length,
    cold: leads.filter(l => l.status === 'COLD').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track all your leads in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            <MessageSquare className="h-4 w-4" />
            New Conversation
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          change="+12.5%"
          icon={<User className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Hot Leads"
          value={stats.hot}
          change="+8.2%"
          icon={<Phone className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Warm Leads"
          value={stats.warm}
          change="+3.1%"
          icon={<MessageSquare className="h-5 w-5" />}
          color="orange"
        />
        <StatCard
          title="Cold Leads"
          value={stats.cold}
          change="-2.4%"
          icon={<Calendar className="h-5 w-5" />}
          color="gray"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search leads by name, phone, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="HOT">Hot</option>
              <option value="WARM">Warm</option>
              <option value="COLD">Cold</option>
              <option value="CONVERTED">Converted</option>
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lead
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900 dark:text-white">{lead.project}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{lead.unitType}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900 dark:text-white">{lead.budget}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900 dark:text-white">{lead.lastMessage}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lead.messages} messages
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
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
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {lead.qualificationScore}/10
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredLeads.length}</span> of{' '}
              <span className="font-medium">{leads.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  color
}: {
  title: string;
  value: number;
  change: string;
  icon: React.ReactNode;
  color: string;
}) {
  const isPositive = change.startsWith('+');
  
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}
