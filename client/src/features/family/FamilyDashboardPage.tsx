import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Heart, 
  Activity, 
  Calendar, 
  Phone, 
  Clock, 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight, 
  CheckSquare, 
  Square,
  ShieldCheck,
  Building,
  CheckCircle2
} from 'lucide-react';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export const FamilyDashboardPage: React.FC = () => {
  const [meds, setMeds] = useState<Medication[]>([
    { id: 1, name: 'Donepezil (Aricept)', dosage: '10mg', time: '8:00 AM', taken: true },
    { id: 2, name: 'Memantine (Namenda)', dosage: '5mg', time: '12:00 PM', taken: true },
    { id: 3, name: 'Omega-3 Fish Oil', dosage: '1000mg', time: '8:00 PM', taken: false }
  ]);

  const toggleMed = (id: number) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const timelineEvents = [
    { time: 'Today, 10:45 AM', text: 'Jane completed cognitive screen focus tests (84% composite score)', type: 'check' },
    { time: 'Today, 8:12 AM', text: 'Jane logged morning Donepezil medication dose', type: 'med' },
    { time: 'Yesterday, 2:30 PM', text: 'Walk log: Completed 2.4-mile aerobic route', type: 'walk' },
    { time: 'July 25, 2026', text: 'Scheduled routine checkup with Dr. Carter on Aug 15', type: 'event' }
  ];

  const alerts = [
    { type: 'warning', text: 'Motor attention delays slightly elevated in yesterday\'s dot-follow session.' },
    { type: 'info', text: 'Weekly longitudinal report summarized and ready for clinic transfer.' }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header and Welcome */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-medical-50 border border-medical-200 text-medical-600 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900">Caregiver & Family Portal</h1>
              <p className="text-xs text-slate-500">Jane Doe's cognitive wellness, medication compliance, and clinician care timeline</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Patient Status: Stable</span>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Takes 2 grid blocks in large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Patient Status Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-2xl bg-medical-50 border border-medical-200 flex items-center justify-center text-medical-600 shadow-xs">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Jane Doe</h3>
                <p className="text-xs text-slate-500 mt-0.5">75 Years Old • ID: cv-p-1044 • Monitored since Jan 2026</p>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold uppercase tracking-wider">
                    Low Risk Index
                  </span>
                  <span className="text-xs font-semibold text-slate-600">Composite: 84% (Stable)</span>
                </div>
              </div>
            </div>

            {/* Sparkline Graph SVG */}
            <div className="w-44 h-20 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col justify-between shrink-0">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">6-Month Trend Curve</span>
              <svg className="w-full h-8 text-emerald-500" viewBox="0 0 100 30">
                <path
                  d="M 5,25 Q 20,20 35,22 T 65,18 T 95,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="95" cy="5" r="3" fill="currentColor" />
              </svg>
              <div className="flex justify-between text-[8px] text-slate-400 font-semibold">
                <span>Feb (72%)</span>
                <span>Jul (84%)</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Interactive Medication Reminders */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-card"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Clock className="w-4 h-4 text-medical-600" />
                  Medication Adherence Tracker
                </h4>
                <p className="text-xs text-slate-500">Log daily compliance for prescribed cognitive enhancers and nutritional supplements</p>
              </div>
              <span className="text-xs text-medical-600 font-bold bg-medical-50 border border-medical-200 px-3 py-1 rounded-full">
                {meds.filter(m => m.taken).length} of {meds.length} logged
              </span>
            </div>

            <div className="space-y-3">
              {meds.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  onClick={() => toggleMed(med.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    med.taken 
                      ? 'bg-slate-50/70 border-slate-200 opacity-75' 
                      : 'bg-white border-medical-200 shadow-sm hover:border-medical-400'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {med.taken ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{med.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{med.dosage} • Scheduled at {med.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    med.taken 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  }`}>
                    {med.taken ? 'Logged' : 'Due Now'}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Monthly Progress compliance metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* compliance 1: screen check */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between h-40 shadow-card">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Assessment</span>
                <span className="text-medical-600 font-display">100%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden my-3">
                <div className="h-full bg-medical-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Monthly diagnostic tracking screening completed on schedule.
              </p>
            </div>

            {/* compliance 2: Brain exercises */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between h-40 shadow-card">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Cognitive Tasks</span>
                <span className="text-indigo-600 font-display">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden my-3">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Completed 17 of 20 recommended brain engagement exercises.
              </p>
            </div>

            {/* compliance 3: walk logs */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between h-40 shadow-card">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Aerobic Walks</span>
                <span className="text-teal-600 font-display">75%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden my-3">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Cardiovascular walking goal reached (15 of 20 target days).
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Appointments, Emergency, Alerts) */}
        <div className="space-y-6">
          
          {/* Card 4: Upcoming Appointment */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-card"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-medical-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upcoming Clinic Consultation</h4>
            </div>

            <div className="p-4 bg-medical-50/50 border border-medical-100 rounded-2xl space-y-1.5 text-left">
              <span className="text-xs text-medical-700 font-bold uppercase tracking-wider block">August 15, 2026 • 2:30 PM</span>
              <h5 className="text-sm font-bold text-slate-900 font-display">Routine Trimester Assessment</h5>
              <p className="text-xs text-slate-500">Metro Specialty Neurology Clinic</p>
              <p className="text-xs text-medical-600 font-semibold">Dr. Evelyn Carter, MD, PhD</p>
            </div>
          </motion.div>

          {/* Card 5: Vigilance Notifications alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-card"
          >
            <div className="flex items-center gap-2 text-slate-900">
              <Bell className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Active Vigilance Alerts</h4>
            </div>

            <div className="space-y-3">
              {alerts.map((al, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border flex gap-3 text-left ${
                    al.type === 'warning' 
                      ? 'bg-amber-50/70 border-amber-200/80 text-amber-900' 
                      : 'bg-medical-50/70 border-medical-200/80 text-medical-900'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-xs leading-relaxed">{al.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 6: Emergency Contact Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-card"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Emergency Hotlines</h4>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Primary Caretaker</span>
                  <span className="text-xs font-bold text-slate-900">Jane's Family Caregiver Desk</span>
                </div>
                <a href="tel:+15559112020" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors shadow-xs">
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Lead Neurologist</span>
                  <span className="text-xs font-bold text-slate-900">Dr. Evelyn Carter</span>
                </div>
                <a href="tel:+15552345678" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors shadow-xs">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 7. Full Timeline feed row */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-card"
      >
        <div>
          <h4 className="text-base font-bold text-slate-900 font-display">Care Activity Logs Timeline</h4>
          <p className="text-xs text-slate-500">Chronological history of recent testing, medication adherence, and clinical milestones</p>
        </div>

        <div className="space-y-5 relative border-l border-slate-200 pl-6 ml-3 mt-4">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative space-y-1 text-left">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2 border-medical-500 shadow-xs" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{evt.time}</span>
              <p className="text-xs text-slate-700 font-medium">{evt.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Care-team signature stamp */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Caregiver–patient sync portal • Shared only with the care team you have authorised</span>
      </div>

    </div>
  );
};
export default FamilyDashboardPage;
