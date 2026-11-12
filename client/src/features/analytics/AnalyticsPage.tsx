import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  PieChart as PieIcon, 
  Brain, 
  Download, 
  Filter,
  ArrowUpRight
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const chartTooltip = {
    contentStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    },
    labelStyle: { color: '#0f172a', fontSize: 11, fontWeight: 600 },
    itemStyle: { color: '#334155', fontSize: 11 }
  };
  const mutedTick = { fill: '#94a3b8', fontSize: 10 };
  const gridStroke = '#f1f5f9';

  // Chart 1: Screenings Over Time (Line Chart)
  const timelineData = [
    { period: '1 Sep', completed: 28, flagged: 4 },
    { period: '5 Sep', completed: 36, flagged: 6 },
    { period: '10 Sep', completed: 42, flagged: 7 },
    { period: '15 Sep', completed: 38, flagged: 5 },
    { period: '20 Sep', completed: 48, flagged: 8 },
    { period: '25 Sep', completed: 54, flagged: 7 },
    { period: '30 Sep', completed: 62, flagged: 6 }
  ];

  // Chart 2: Screening Outcome Distribution (Donut Chart)
  const outcomeData = [
    { name: 'Low Risk (Stable)', value: 72, fill: '#10b981' },
    { name: 'Moderate Drift', value: 19, fill: '#f59e0b' },
    { name: 'Flagged for Review', value: 9, fill: '#f43f5e' }
  ];

  // Chart 3: Age-Group Distribution (Bar Chart)
  const ageData = [
    { group: '< 50 yrs', assessed: 18 },
    { group: '50–64 yrs', assessed: 46 },
    { group: '65–74 yrs', assessed: 112 },
    { group: '75–84 yrs', assessed: 84 },
    { group: '85+ yrs', assessed: 28 }
  ];

  // Chart 4: Module Performance (Horizontal Bar Chart)
  const moduleData = [
    { module: 'Working Memory', score: 84, fill: '#6366f1' },
    { module: 'Visual Search', score: 79, fill: '#0ea5e9' },
    { module: 'Speech Cadence', score: 88, fill: '#8b5cf6' },
    { module: 'Facial Symmetry', score: 91, fill: '#f59e0b' },
    { module: 'Ocular Latency', score: 82, fill: '#10b981' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Clinical Population Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cohort longitudinal trajectories, completion efficacy, and biomarker population benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range pills */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1">
            {(['7d', '30d', '90d', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === r
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="btn-glass text-xs py-2 px-3">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Completed Screenings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-slate-900">288</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>
          <p className="text-xs text-slate-500">Across 3 hospital pilot centers</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Average Completion Time
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-slate-900">4.8m</span>
            <span className="text-xs font-bold text-sky-600">Optimal</span>
          </div>
          <p className="text-xs text-slate-500">92% completed in under 6 minutes</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Elderly Task Completion Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-slate-900">96.4%</span>
            <span className="text-xs font-bold text-emerald-600">+3.1%</span>
          </div>
          <p className="text-xs text-slate-500">Multilingual audio guidance boost</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Clinical Referral Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-display text-slate-900">8.7%</span>
            <span className="text-xs font-bold text-amber-600">25 Flagged</span>
          </div>
          <p className="text-xs text-slate-500">Referred to specialist neurologists</p>
        </div>
      </div>

      {/* Row 1: Screenings Over Time + Screening Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Screenings Over Time (Takes 2 Columns) */}
        <div className="glass-card p-6 sm:p-7 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Screening Volume & Longitudinal Growth
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Completed neurological evaluations vs review flags over time
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              30-Day Trend
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={gridStroke} />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={mutedTick} />
                <YAxis tickLine={false} axisLine={false} tick={mutedTick} />
                <Tooltip {...chartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: 11, color: '#64748b', paddingBottom: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed Screenings"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="flagged"
                  name="Flagged for Review"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2.5, fill: '#f97316', stroke: '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Outcome Distribution (1 Column) */}
        <div className="glass-card p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Screening Outcome Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Population risk classification breakdown
            </p>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="82%"
                  paddingAngle={2}
                  stroke="none"
                >
                  {outcomeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-black font-display text-slate-900 block">72%</span>
              <span className="text-xs text-slate-400 font-semibold uppercase">Low Risk</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center leading-normal pt-2 border-t border-slate-100">
            Based on n=288 clinical patient examinations across primary care partners.
          </div>
        </div>
      </div>

      {/* Row 2: Age Distribution & Module Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Group Distribution */}
        <div className="glass-card p-6 sm:p-7 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Age-Group Patient Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Patient age cohorts screened across clinical validation sites
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={gridStroke} />
                <XAxis dataKey="group" tickLine={false} axisLine={false} tick={mutedTick} />
                <YAxis tickLine={false} axisLine={false} tick={mutedTick} />
                <Tooltip {...chartTooltip} cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }} />
                <Bar dataKey="assessed" name="Patients Assessed" fill="rgba(2, 132, 199, 0.75)" radius={[8, 8, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Performance Benchmarks */}
        <div className="glass-card p-6 sm:p-7 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Modular Benchmark Accuracy & Hold
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Average domain scores achieved across the screening modules
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleData} layout="vertical" margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={gridStroke} />
                <XAxis type="number" domain={[50, 100]} tickLine={false} axisLine={false} tick={mutedTick} />
                <YAxis
                  type="category"
                  dataKey="module"
                  width={112}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#334155', fontSize: 11 }}
                />
                <Tooltip {...chartTooltip} cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }} />
                <Bar dataKey="score" name="Cohort Average Score (%)" radius={[0, 6, 6, 0]} maxBarSize={26}>
                  {moduleData.map((entry) => (
                    <Cell key={entry.module} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
