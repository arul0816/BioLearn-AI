import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm border-white/20">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformanceLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="avgScore"
        name="Avg Score"
        unit="%"
        stroke="#10b981"
        strokeWidth={2.5}
        dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
        activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#064e3b' }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export const TopicBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data.slice(0, 8)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
        tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + '…' : v}
      />
      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip content={<CustomTooltip />} />
      <Bar
        dataKey="avgMastery"
        name="Mastery"
        unit="%"
        fill="url(#masteryGradient)"
        radius={[6, 6, 0, 0]}
      />
      <defs>
        <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#0d9488" stopOpacity={0.6} />
        </linearGradient>
      </defs>
    </BarChart>
  </ResponsiveContainer>
);

const ProgressChart = ({ type = 'line', data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center">
        <p className="text-slate-500 text-sm">No data yet. Complete some quizzes to see your progress!</p>
      </div>
    );
  }

  if (type === 'bar') return <TopicBarChart data={data} />;
  return <PerformanceLineChart data={data} />;
};

export default ProgressChart;