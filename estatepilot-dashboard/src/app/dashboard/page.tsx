'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LeadsOverviewChart } from '@/components/charts/LeadsOverviewChart';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // For demo, using mock data
      // In real app, fetch from API
      return {
        totalLeads: 156,
        hotLeads: 42,
        activeConversations: 23,
        totalProjects: 8,
        leadGrowth: 12.5,
        conversionRate: 8.2
      };
    }
  });

  const recentLeads = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', status: 'HOT', project: 'Sky Towers', time: '10 min ago' },
    { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', status: 'WARM', project: 'Green Valley', time: '25 min ago' },
    { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', status: 'COLD', project: 'Royal Residency', time: '1 hour ago' },
    { id: 4, name: 'Sneha Reddy', phone: '+91 98765 43213', status: 'HOT', project: 'Sky Towers', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon={<Users className="h-6 w-6" />}
          trend={12.5}
          trendDirection="up"
          color="blue"
        />
        <StatCard
          title="Hot Leads"
          value={stats?.hotLeads || 0}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={8.2}
          trendDirection="up"
          color="red"
        />
        <StatCard
          title="Active Conversations"
          value={stats?.activeConversations || 0}
          icon={<MessageSquare className="h-6 w-6" />}
          trend={-3.1}
          trendDirection="down"
          color="green"
        />
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={<Building2 className="h-6 w-6" />}
          trend={0}
          trendDirection="neutral"
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Leads Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last 30 days performance
              </p>
            </div>
          </div>
          <div className="h-80">
            <LeadsOverviewChart />
          </div>
        </motion.div>

        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Leads
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest lead interactions
              </p>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${
                    lead.status === 'HOT' ? 'bg-red-500' :
                    lead.status === 'WARM' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{lead.project}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <QuickActionCard
          title="Add New Project"
          description="Create a new real estate project"
          icon={<Building2 className="h-8 w-8" />}
          actionText="Create Project"
          href="/dashboard/projects"
          color="blue"
        />
        <QuickActionCard
          title="View All Leads"
          description="Manage and filter all leads"
          icon={<Users className="h-8 w-8" />}
          actionText="View Leads"
          href="/dashboard/leads"
          color="green"
        />
        <QuickActionCard
          title="Analytics Report"
          description="Detailed performance insights"
          icon={<TrendingUp className="h-8 w-8" />}
          actionText="Generate Report"
          href="/dashboard/analytics"
          color="purple"
        />
      </motion.div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection,
  color 
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trendDirection !== 'neutral' && (
          <div className={`flex items-center text-sm ${
            trendDirection === 'up' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {trendDirection === 'up' ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  actionText,
  href,
  color
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg w-fit ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      <a
        href={href}
        className={`inline-flex items-center text-sm font-medium ${
          color === 'blue' ? 'text-blue-600 hover:text-blue-700' :
          color === 'green' ? 'text-green-600 hover:text-green-700' :
          'text-purple-600 hover:text-purple-700'
        }`}
      >
        {actionText}
        <ArrowUpRight className="ml-1 h-4 w-4" />
      </a>
    </div>
  );
}
