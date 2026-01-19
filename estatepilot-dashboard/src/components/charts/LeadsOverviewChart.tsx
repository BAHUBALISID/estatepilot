'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { date: 'Jan 1', leads: 12, hot: 4, warm: 5, cold: 3 },
  { date: 'Jan 2', leads: 15, hot: 5, warm: 6, cold: 4 },
  { date: 'Jan 3', leads: 18, hot: 6, warm: 7, cold: 5 },
  { date: 'Jan 4', leads: 16, hot: 5, warm: 6, cold: 5 },
  { date: 'Jan 5', leads: 20, hot: 8, warm: 7, cold: 5 },
  { date: 'Jan 6', leads: 22, hot: 9, warm: 8, cold: 5 },
  { date: 'Jan 7', leads: 25, hot: 10, warm: 9, cold: 6 },
];

export function LeadsOverviewChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
        <XAxis 
          dataKey="date" 
          stroke="rgb(148, 163, 184)"
          fontSize={12}
        />
        <YAxis 
          stroke="rgb(148, 163, 184)"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgb(30, 41, 59)',
            border: 'none',
            borderRadius: '8px',
            color: 'white'
          }}
        />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="rgb(59, 130, 246)"
          fill="rgba(59, 130, 246, 0.2)"
          strokeWidth={2}
          name="Total Leads"
        />
        <Area
          type="monotone"
          dataKey="hot"
          stroke="rgb(239, 68, 68)"
          fill="rgba(239, 68, 68, 0.2)"
          strokeWidth={2}
          name="Hot Leads"
        />
        <Area
          type="monotone"
          dataKey="warm"
          stroke="rgb(245, 158, 11)"
          fill="rgba(245, 158, 11, 0.2)"
          strokeWidth={2}
          name="Warm Leads"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
