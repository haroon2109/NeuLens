import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  MessageSquare, 
  Eye, 
  Smile, 
  AlertTriangle, 
  Play, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  Network,
  Cpu,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface LobeTelemetry {
  title: string;
  sub: string;
  biomarker: string;
  val: string;
  status: string;
  color: string;
}

export const DashboardPage: React.FC = () => {
  const [selectedLobe, setSelectedLobe] = useState<'frontal' | 'temporal' | 'parietal' | 'occipital' | 'cerebellar'>('frontal');

  const lobeData: Record<string, LobeTelemetry> = {
    frontal: {
      title: 'Frontal Cortex & Executive Network',
      sub: 'Working memory, trail-making planning, and motor response latency',
      biomarker: 'Trail Task Latency (TMT-B)',
      val: '1.42s',
      status: 'Optimal (Baseline ±0.1s)',
      color: '#0284c7'
    },
    temporal: {
      title: 'Temporal Lobe & Speech Prosody',
      sub: 'Acoustic vocal jitter, speech rate, and auditory working memory',
      biomarker: 'Vocal Micro-Tremor / Jitter',
      val: '0.11%',
      status: 'Normal Acoustic Stability',
      color: '#6366f1'
    },
    parietal: {
      title: 'Parietal Spatial Processing',
      sub: 'Visuospatial pattern alignment and mental rotation speed',
      biomarker: 'Card Pattern Matching Speed',
      val: '88% accuracy',
      status: 'Intact Spatial Navigation',
      color: '#0d9488'
    },
    occipital: {
      title: 'Occipital Visual Field & Saccades',
      sub: 'Gaze fixation stability, smooth pursuit velocity, and blink rates',
      biomarker: 'Ocular Fixation Stability',
      val: '94.2%',
      status: 'Stable Target Retention',
      color: '#f59e0b'
    },
    cerebellar: {
      title: 'Cerebellar Coordination & Mimicry',
      sub: 'Dynamic facial symmetry, micro-tremor, and movement timing',
      biomarker: 'Facial Landmark Symmetry',
      val: '96.1%',
      status: 'Symmetrical Response',
      color: '#10b981'
    }
  };

  const recentScreenings = [
    { id: 'P-1024', name: 'Eleanor Vance', age: '72y', test: 'Full Multimodal Battery', status: 'Completed', score: '84%', date: 'Today, 09:30 AM', risk: 'Low' },
    { id: 'P-1025', name: 'Arthur Pendelton', age: '68y', test: 'Speech & Vocal Prosody', status: 'Needs Review', score: '58%', date: 'Today, 08:45 AM', risk: 'High' },
    { id: 'P-1026', name: 'Margaret Chen', age: '75y', test: 'Ocular Tracking & Saccades', status: 'Completed', score: '79%', date: 'Yesterday', risk: 'Moderate' },
    { id: 'P-1027', name: 'Robert Kowalski', age: '81y', test: 'Psychomotor Trail Making', status: 'In Progress', score: '—', date: 'Yesterday', risk: 'Pending' },
    { id: 'P-1028', name: 'Beatrice Lawson', age: '69y', test: 'Full Multimodal Battery', status: 'Completed', score: '91%', date: 'Jul 28, 2026', risk: 'Low' }
  ];

  const trendChartData = [
    { period: 'Feb', composite: 74, ocular: 71 },
    { period: 'Mar', composite: 76, ocular: 73 },
    { period: 'Apr', composite: 75, ocular: 72 },
    { period: 'May', composite: 79, ocular: 76 },
    { period: 'Jun', composite: 81, ocular: 78 },
    { period: 'Jul (Current)', composite: 84, ocular: 81 }
  ];

  const axisTick = { fill: '#64748b', fontSize: 11, fontFamily: 'Inter' };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. TOP SECTION: Dashboard Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Screening Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cognitive and neurological screening overview across session observations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full shadow-xs text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Clinical Session Active</span>
          </div>
          <Link to="/dashboard/screen" className="btn-primary text-xs py-2.5 px-4 font-bold rounded-2xl shadow-pill flex items-center gap-2">
            <Play className="w-3.5 h-3.5 fill-white" />
            Start New Screening
          </Link>
        </div>
      </div>

      {/* 2. METRICS SECTION (4 Clean KPI Cards with Sparklines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Screenings</span>
            <div className="w-8 h-8 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-display text-slate-900">248</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Historical clinic total</span>
            <span className="text-slate-500 font-medium">Updated 5m ago</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Screenings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-display text-slate-900">18</span>
            <span className="text-xs font-semibold text-slate-500">12 scheduled</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Daily queue capacity</span>
            <span className="text-blue-600 font-semibold">60% of goal</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-display text-slate-900">16</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              88.9% rate
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Validated batteries</span>
            <span className="text-slate-500 font-medium">Avg 3.8 min</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged For Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-display text-amber-600">4</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Action Required
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Cognitive drift alerts</span>
            <span className="text-amber-600 font-semibold">Triage queue</span>
          </div>
        </div>

      </div>

      {/* 3. MAIN AI VISUAL: NEURAL HEALTH OVERVIEW & 3D BRAIN MAP */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Neural Health Overview</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multimodal AI analysis across cognitive, visual, facial, and speech signals mapped to functional cortical networks.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
            {(['frontal', 'temporal', 'parietal', 'occipital', 'cerebellar'] as const).map((lobe) => (
              <button
                key={lobe}
                onClick={() => setSelectedLobe(lobe)}
                className={`px-3 py-1.5 text-xs font-bold capitalize rounded-xl transition-all ${
                  selectedLobe === lobe 
                    ? 'bg-white text-medical-600 shadow-sm border border-slate-200/80' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lobe}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Brain Diagram & Telemetry Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Stylized Neural Health Visualization */}
          <div className="lg:col-span-7 bg-gradient-to-b from-slate-50/80 via-blue-50/20 to-slate-50/50 border border-slate-200/80 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[320px] overflow-hidden">
            
            {/* Ambient neural glow */}
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

            {/* Neural Graphic SVG */}
            <svg viewBox="0 0 500 320" className="w-full max-w-md h-auto select-none">
              <defs>
                <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Anatomical Outline of Brain */}
              <path
                d="M 250 40 
                   C 320 38, 400 70, 420 140 
                   C 435 190, 410 240, 360 270 
                   C 330 285, 290 280, 270 290 
                   C 255 300, 245 300, 230 290 
                   C 210 280, 170 285, 140 270 
                   C 90 240, 65 190, 80 140 
                   C 100 70, 180 38, 250 40 Z"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Active Lobe Highlights */}
              {/* Frontal Lobe */}
              <path
                d="M 250 45 C 190 45, 120 75, 100 135 C 120 160, 160 180, 220 170 C 240 130, 250 90, 250 45 Z"
                fill={selectedLobe === 'frontal' ? 'rgba(2, 132, 199, 0.25)' : 'rgba(2, 132, 199, 0.06)'}
                stroke="#0284c7"
                strokeWidth={selectedLobe === 'frontal' ? '2.5' : '1.5'}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedLobe('frontal')}
              />

              {/* Parietal Lobe */}
              <path
                d="M 250 45 C 310 45, 380 75, 400 135 C 380 160, 340 180, 280 170 C 260 130, 250 90, 250 45 Z"
                fill={selectedLobe === 'parietal' ? 'rgba(13, 148, 136, 0.25)' : 'rgba(13, 148, 136, 0.06)'}
                stroke="#0d9488"
                strokeWidth={selectedLobe === 'parietal' ? '2.5' : '1.5'}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedLobe('parietal')}
              />

              {/* Temporal Lobe */}
              <path
                d="M 120 170 C 100 190, 110 230, 150 250 C 180 260, 210 230, 220 190 C 170 180, 140 175, 120 170 Z"
                fill={selectedLobe === 'temporal' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.06)'}
                stroke="#6366f1"
                strokeWidth={selectedLobe === 'temporal' ? '2.5' : '1.5'}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedLobe('temporal')}
              />

              {/* Occipital Lobe */}
              <path
                d="M 380 170 C 400 190, 390 230, 350 250 C 320 260, 290 230, 280 190 C 330 180, 360 175, 380 170 Z"
                fill={selectedLobe === 'occipital' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.06)'}
                stroke="#f59e0b"
                strokeWidth={selectedLobe === 'occipital' ? '2.5' : '1.5'}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedLobe('occipital')}
              />

              {/* Cerebellar Network */}
              <ellipse
                cx="250"
                cy="255"
                rx="55"
                ry="32"
                fill={selectedLobe === 'cerebellar' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.06)'}
                stroke="#10b981"
                strokeWidth={selectedLobe === 'cerebellar' ? '2.5' : '1.5'}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedLobe('cerebellar')}
              />

              {/* Neural Synapse Points */}
              <circle cx="160" cy="110" r="4" fill="#0284c7" style={{ animationDuration: '3s' }} />
              <circle cx="340" cy="110" r="4" fill="#0d9488" style={{ animationDuration: '2.5s' }} />
              <circle cx="170" cy="210" r="4" fill="#6366f1" style={{ animationDuration: '3.5s' }} />
              <circle cx="330" cy="210" r="4" fill="#f59e0b" style={{ animationDuration: '2.8s' }} />
              <circle cx="250" cy="255" r="4" fill="#10b981" style={{ animationDuration: '3.2s' }} />

              {/* Central AI Nucleus Core */}
              <circle cx="250" cy="160" r="14" fill="#0284c7" fillOpacity="0.15" stroke="#0284c7" strokeWidth="2" />
              <circle cx="250" cy="160" r="6" fill="#0284c7" />
            </svg>

            <span className="text-xs text-slate-400 font-medium mt-2">
              Interactive 5-Region Functional Cortical Map • Click any lobe to inspect live telemetry
            </span>
          </div>

          {/* Right: Selected Lobe Telemetry Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                  Active Cortical Readout
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 shadow-xs">
                  Real-Time AI Stream
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{lobeData[selectedLobe].title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{lobeData[selectedLobe].sub}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Assayed Digital Biomarker:</span>
                  <span className="font-bold text-slate-800">{lobeData[selectedLobe].biomarker}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Computed Metric Value:</span>
                  <span className="font-bold text-medical-600 font-display text-sm">{lobeData[selectedLobe].val}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Population Baseline Match:</span>
                  <span className="font-semibold text-emerald-600">{lobeData[selectedLobe].status}</span>
                </div>
              </div>
            </div>

            <div className="bg-medical-50/60 border border-medical-100 rounded-2xl p-4 flex gap-3 text-left">
              <Sparkles className="w-4 h-4 text-medical-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Biomarkers reflect non-invasive sensor signals recorded during ocular saccade, speech repetition, and memory games.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. MULTIMODAL AI ANALYSIS ARCHITECTURE CARD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-card space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-medical-600" />
            <h2 className="text-xl font-bold text-slate-900 font-display">Multimodal AI Analysis Engine</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Neulens combines multiple non-invasive biometric signals simultaneously rather than relying on an isolated test.
          </p>
        </div>

        {/* Multimodal Signal Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          
          {/* Signal 1: Face */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Smile className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Face & Eye</h4>
            <p className="text-xs text-slate-500">Saccadic velocity, smooth pursuit, blink rates, and 468-point facial symmetry.</p>
          </div>

          {/* Signal 2: Voice */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Voice & Speech</h4>
            <p className="text-xs text-slate-500">Acoustic pitch, prosodic jitter/shimmer, hesitation pauses, and MFCC spectrum.</p>
          </div>

          {/* Signal 3: Cognition */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center mx-auto">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cognition</h4>
            <p className="text-xs text-slate-500">Dual-task working memory recall, pattern retention, and executive attention.</p>
          </div>

          {/* Signal 4: Behavior */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Behavior & Motor</h4>
            <p className="text-xs text-slate-500">Trail Making psychomotor latency, tapping precision, and task hesitation indices.</p>
          </div>

        </div>

        {/* Integration Arrow Pipeline Banner */}
        <div className="bg-gradient-to-r from-medical-50 via-blue-50 to-indigo-50 border border-medical-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-medical-200 text-medical-600 flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 font-display">Deep Multimodal Fusion Network</span>
              <p className="text-xs text-slate-500">Cross-attention alignment correlates vocal and ocular markers for objective screening</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medical-700 bg-white px-3 py-1.5 rounded-xl border border-medical-200 shadow-xs">
              Confidence Index: 94.2%
            </span>
          </div>
        </div>
      </div>

      {/* 5. SCREENING OVERVIEW: RECENT SCREENINGS & POPULATION TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Screenings Table / Cards */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Recent Screenings</h3>
              <p className="text-xs text-slate-500">Real-time patient intake and diagnostic triage queue</p>
            </div>
            <Link to="/dashboard/patients" className="text-xs text-medical-600 hover:text-medical-700 font-bold flex items-center gap-1">
              View All Patients <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentScreenings.map((p) => (
              <div 
                key={p.id}
                className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs">
                    {p.id.replace('P-', '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{p.name}</span>
                      <span className="text-xs text-slate-400">({p.age})</span>
                    </div>
                    <p className="text-xs text-slate-500">{p.test}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider ${
                    p.status === 'Completed' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : p.status === 'Needs Review'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {p.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{p.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Longitudinal Baseline Trend Line Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-medical-600" />
              <h3 className="text-lg font-bold text-slate-900 font-display">Longitudinal Performance Curve</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">6-month mean cohort baseline variance across assessment sessions</p>
          </div>

          <div className="h-56 relative w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tick={axisTick} />
                <YAxis domain={[60, 100]} ticks={[60, 70, 80, 90, 100]} tickLine={false} axisLine={false} tick={axisTick} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: 8, padding: 10 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                  itemStyle={{ color: '#ffffff', fontSize: 11 }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  wrapperStyle={{ fontSize: 11, fontWeight: 600, color: '#475569', paddingBottom: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="composite"
                  name="Mean Composite Cognitive Index"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="ocular"
                  name="Ocular Tracking Latency Index"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2.5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Clinical Stability:</span>
            <span className="font-bold text-emerald-600">Low Variance (+2.4%)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
export default DashboardPage;
