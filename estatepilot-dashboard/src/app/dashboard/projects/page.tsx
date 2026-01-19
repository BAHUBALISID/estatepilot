'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with API call
  const projects = [
    {
      id: '1',
      name: 'Sky Towers',
      location: 'Bandra, Mumbai',
      priceRange: '₹1.2Cr - ₹2.5Cr',
      units: '2BHK, 3BHK, Penthouse',
      possession: 'Dec 2025',
      rera: 'P123456789',
      leads: 42,
      status: 'active',
      amenities: ['Swimming Pool', 'Gym', 'Park', 'Clubhouse', '24/7 Security']
    },
    {
      id: '2',
      name: 'Green Valley',
      location: 'Whitefield, Bangalore',
      priceRange: '₹80L - ₹1.8Cr',
      units: '2BHK, 3BHK',
      possession: 'Mar 2025',
      rera: 'B987654321',
      leads: 28,
      status: 'active',
      amenities: ['Garden', 'Gym', 'Children\'s Play Area', 'Security']
    },
    {
      id: '3',
      name: 'Royal Residency',
      location: 'Gurgaon, Delhi NCR',
      priceRange: '₹1.5Cr - ₹3Cr',
      units: '3BHK, 4BHK, Penthouse',
      possession: 'Jun 2026',
      rera: 'D456789123',
      leads: 35,
      status: 'active',
      amenities: ['Swimming Pool', 'Gym', 'Spa', 'Theatre', 'Multi-purpose Hall']
    },
    {
      id: '4',
      name: 'Ocean View',
      location: 'Chennai',
      priceRange: '₹1Cr - ₹2.2Cr',
      units: '2BHK, 3BHK',
      possession: 'Completed',
      rera: 'C789123456',
      leads: 19,
      status: 'completed',
      amenities: ['Swimming Pool', 'Gym', 'Park', 'Security']
    },
  ];

  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false;
    if (search && !project.name.toLowerCase().includes(search.toLowerCase()) && 
        !project.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalLeads: projects.reduce((sum, p) => sum + p.leads, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all your real estate projects and configurations
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.total}
          icon={<Building2 className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats.active}
          icon={<Building2 className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Completed Projects"
          value={stats.completed}
          icon={<Building2 className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={<Eye className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search projects by name or location..."
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Project Image */}
            <div className="h-48 bg-gradient-to-br from-primary-600/20 to-primary-400/20 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-primary-600 dark:text-primary-400" />
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {project.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.priceRange}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Price Range</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.leads}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Leads</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Unit Types</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.units}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Possession</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.possession}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">RERA Number</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.rera}
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Amenities
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.slice(0, 3).map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {project.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                      +{project.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  )}>
                    {project.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                  <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add New Project Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Add New Project
          </h3>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">
            Create a new project to start generating leads and conversations
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            <Plus className="h-4 w-4" />
            Create New Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );
}
