import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  ArrowUpRight, 
  Calendar, 
  Eye, 
  Mic, 
  Brain, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  lastScreening: string;
  assessmentType: 'Multimodal' | 'Cognitive' | 'Speech' | 'Ocular Focus';
  riskLevel: 'LOW' | 'MODERATE' | 'FLAGGED';
  compositeScore: number;
  status: 'Completed' | 'In Progress' | 'Needs Review';
  doctor: string;
}

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-1024',
    name: 'Eleanor Vance',
    age: 72,
    gender: 'Female',
    lastScreening: 'Today, 09:30 AM',
    assessmentType: 'Multimodal',
    riskLevel: 'LOW',
    compositeScore: 84,
    status: 'Completed',
    doctor: 'Dr. Sharma'
  },
  {
    id: 'P-1025',
    name: 'Robert Sterling',
    age: 68,
    gender: 'Male',
    lastScreening: 'Today, 11:15 AM',
    assessmentType: 'Speech',
    riskLevel: 'FLAGGED',
    compositeScore: 58,
    status: 'Needs Review',
    doctor: 'Dr. Sharma'
  },
  {
    id: 'P-1026',
    name: 'Margaret Chen',
    age: 76,
    gender: 'Female',
    lastScreening: 'Yesterday, 03:40 PM',
    assessmentType: 'Multimodal',
    riskLevel: 'LOW',
    compositeScore: 88,
    status: 'Completed',
    doctor: 'Dr. Evelyn Carter'
  },
  {
    id: 'P-1027',
    name: 'Arthur Pendelton',
    age: 81,
    gender: 'Male',
    lastScreening: 'Yesterday, 01:10 PM',
    assessmentType: 'Cognitive',
    riskLevel: 'MODERATE',
    compositeScore: 71,
    status: 'Completed',
    doctor: 'Dr. Sharma'
  },
  {
    id: 'P-1028',
    name: 'Kavita Sundaram',
    age: 65,
    gender: 'Female',
    lastScreening: '29 Sep 2026',
    assessmentType: 'Ocular Focus',
    riskLevel: 'LOW',
    compositeScore: 92,
    status: 'Completed',
    doctor: 'Dr. Marcus Vance'
  },
  {
    id: 'P-1029',
    name: 'David Reynolds',
    age: 74,
    gender: 'Male',
    lastScreening: '28 Sep 2026',
    assessmentType: 'Multimodal',
    riskLevel: 'FLAGGED',
    compositeScore: 54,
    status: 'Needs Review',
    doctor: 'Dr. Sharma'
  }
];

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LOW' | 'MODERATE' | 'FLAGGED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New patient modal state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newGender, setNewGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [newType, setNewType] = useState<Patient['assessmentType']>('Multimodal');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.assessmentType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'ALL' || patient.riskLevel === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge) return;

    const newId = `P-${1030 + patients.length}`;
    const newEntry: Patient = {
      id: newId,
      name: newName,
      age: Number(newAge),
      gender: newGender,
      lastScreening: 'Just now',
      assessmentType: newType,
      riskLevel: 'LOW',
      compositeScore: 82,
      status: 'In Progress',
      doctor: 'Dr. Sharma'
    };

    setPatients([newEntry, ...patients]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewAge('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Patient Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Neurological cohorts, longitudinal records, and active screening queues
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-sm shadow-pill"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filter Tabs */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient by name, ID (e.g. P-1024), or protocol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200/90 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/15 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'LOW', 'MODERATE', 'FLAGGED'] as const).map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {filter === 'ALL' && 'All Patients'}
                {filter === 'LOW' && 'Low Risk (Stable)'}
                {filter === 'MODERATE' && 'Moderate Drift'}
                {filter === 'FLAGGED' && 'Flagged for Review'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Cards / Rows */}
      <div className="space-y-3.5">
        {filteredPatients.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-base font-semibold text-slate-700">No patients found</p>
            <p className="text-xs text-slate-400">Try adjusting your search terms or filter criteria.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 hover:border-sky-300/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Avatar & Patient Demographics */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-700 font-bold font-display text-base shadow-sm">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {patient.name}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {patient.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {patient.age} yrs • {patient.gender} • In-Charge: {patient.doctor}
                    </p>
                  </div>
                </div>

                {/* Middle: Assessment Type & Latest Date */}
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                      Screening Module
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      {patient.assessmentType === 'Multimodal' && <Brain className="w-3.5 h-3.5 text-sky-600" />}
                      {patient.assessmentType === 'Speech' && <Mic className="w-3.5 h-3.5 text-purple-600" />}
                      {patient.assessmentType === 'Ocular Focus' && <Eye className="w-3.5 h-3.5 text-teal-600" />}
                      {patient.assessmentType === 'Cognitive' && <Brain className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{patient.assessmentType}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                      Last Screened
                    </span>
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {patient.lastScreening}
                    </span>
                  </div>
                </div>

                {/* Status & Risk Pill */}
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display text-slate-900">
                        {patient.compositeScore}%
                      </span>
                      <span className="text-xs text-slate-400">Score</span>
                    </div>
                    
                    {patient.riskLevel === 'LOW' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Low Risk
                      </span>
                    )}
                    {patient.riskLevel === 'MODERATE' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-2.5 h-2.5" />
                        Moderate
                      </span>
                    )}
                    {patient.riskLevel === 'FLAGGED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Review Needed
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/report/${patient.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Report
                    </Link>
                    <Link
                      to="/dashboard/screen"
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <span>Screen</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Register New Patient
                </h3>
                <p className="text-xs text-slate-500">
                  Add patient details for cognitive and neurological baseline screening.
                </p>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harold Jenkins"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Age</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="120"
                      placeholder="e.g. 70"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Gender</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Initial Assessment Protocol</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="Multimodal">Multimodal Full Battery (~5 min)</option>
                    <option value="Cognitive">Cognitive & Memory Battery</option>
                    <option value="Speech">Acoustic Speech & Voice Battery</option>
                    <option value="Ocular Focus">Ocular Tracking & Saccades</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-glass flex-1 py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2.5 text-xs font-bold"
                  >
                    Save & Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PatientsPage;
