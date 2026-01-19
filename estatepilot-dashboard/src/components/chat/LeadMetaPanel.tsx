'use client';

import {
  Phone,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Calendar,
  Globe,
  Target
} from 'lucide-react';

interface LeadMetaPanelProps {
  lead: {
    name: string;
    phone: string;
    email?: string;
    status: string;
    project: string;
    budget: string;
    unitType: string;
    timeline: string;
    language: string;
    qualificationScore: number;
    location: string;
    intent: string;
    followupCount: number;
    nextFollowupAt?: string;
    createdAt: string;
  };
}

export function LeadMetaPanel({ lead }: LeadMetaPanelProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Lead Information
      </h3>
      
      <div className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{lead.phone}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
            </div>
          </div>
          
          {lead.email && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.email}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{lead.location}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
            </div>
          </div>
        </div>
        
        {/* Project Details */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Project Details
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.project}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Project</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.budget}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Budget Range</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.unitType}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Unit Type</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline & Intent */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Timeline & Intent
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.timeline}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Purchase Timeline</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Target className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.intent}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Primary Intent</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{lead.language}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Language</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Follow-up Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Follow-up Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {lead.followupCount} attempts
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Follow-ups</div>
              </div>
            </div>
            
            {lead.nextFollowupAt && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <Calendar className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDate(lead.nextFollowupAt)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Next Follow-up</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-500/10">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(lead.createdAt)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Created On</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
