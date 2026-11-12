import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  FileText,
  Activity,
  User,
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';
import { doctorApi } from '../../services/portalApi';

interface PatientRecord {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  language: string;
  educationYears?: number | null;
  handedness?: string | null;
  assessmentsCount: number;
  latestScore: number | null;
  latestRisk: string | null;
  latestAssessmentDate: string | null;
  changeStatus: 'INSUFFICIENT_DATA' | 'NO_CHANGE' | 'REVIEW';
  cognitiveChange: number | null;
  worsenedActivityCount: number;
}

export const DoctorPatientsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const isSelectingForScreening = searchParams.get('select') === 'true';
  
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'LOW' | 'MODERATE' | 'HIGH'>('ALL');
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async (query = searchQuery, risk = riskFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorApi.getPatients(query, risk);
      setPatients(data || []);
    } catch (err: any) {
      console.error('Failed to load patient records:', err);
      setError(err.message || 'Unable to load patient directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(searchQuery, riskFilter);
  }, [riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(searchQuery, riskFilter);
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
          No Screenings
        </span>
      );
    }
    switch (risk.toUpperCase()) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            High Risk
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Low Risk
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* ---------------------------------------------------------------- */}
      {/* HEADER                                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-medical-50 text-medical-700 border border-medical-200 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Patient Records Registry
            </span>
            <span className="text-xs text-slate-400">| Hospital Longitudinal Files</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Patient Medical Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search enrolled patients by unique ID or name, review demographic baselines, and inspect full assessment histories.
          </p>
        </div>

        <div className="text-right sm:self-center">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
            Total Patients
          </span>
          <span className="text-2xl font-black text-slate-900 font-display">
            {patients.length} Registered
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SELECTION FOR SCREENING BANNER                                   */}
      {/* ---------------------------------------------------------------- */}
      {isSelectingForScreening && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-3xl flex items-center justify-between text-xs text-medical-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-medical-600 shrink-0" />
            <span className="font-semibold">
              Please select a patient from the directory below to administer their screening battery.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              searchParams.delete('select');
              setSearchParams(searchParams);
            }}
            className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SEARCH & FILTER CONTROLS                                         */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Patient ID (e.g. CV-2026-...) or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2.5 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 font-medium"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Risk Stratification Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold self-stretch md:self-auto justify-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
            Risk Tier:
          </span>
          {(['ALL', 'LOW', 'MODERATE', 'HIGH'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                riskFilter === r
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'ALL' ? 'All Patients' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

      </div>

      {/* ---------------------------------------------------------------- */}
      {/* PATIENT LIST TABLE                                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-medical-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Querying Patient Records...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-base font-bold text-slate-800">No Patient Records Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No patients match the search identifier "{searchQuery}" under the selected risk criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Patient Identifier</th>
                  <th className="py-3.5 px-6">Demographics</th>
                  <th className="py-3.5 px-6">Clinical Baseline</th>
                  <th className="py-3.5 px-6">Assessments</th>
                  <th className="py-3.5 px-6">Latest Score</th>
                  <th className="py-3.5 px-6">Change Monitor</th>
                  <th className="py-3.5 px-6">AI Risk Tier</th>
                  <th className="py-3.5 px-6 text-right">Medical Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                    
                    {/* Patient ID */}
                    <td className="py-4 px-6 font-mono font-bold text-medical-700">
                      <Link 
                        to={`/doctor/patients/${p.patientId}`}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-medical-500"></span>
                        {p.patientId}
                      </Link>
                    </td>

                    {/* Patient Name & Age */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-400">
                        {p.age} yrs • {p.gender} • Lang: {p.language.toUpperCase()}
                      </div>
                    </td>

                    {/* Clinical Baseline */}
                    <td className="py-4 px-6 text-slate-600">
                      <div>Hand: <span className="font-semibold text-slate-800">{p.handedness || 'Right'}</span></div>
                      <div className="text-xs text-slate-400">Education: {p.educationYears || 12} yrs</div>
                    </td>

                    {/* Assessments count */}
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 font-bold text-slate-700">
                        <Activity className="w-3 h-3 text-medical-600" />
                        {p.assessmentsCount} {p.assessmentsCount === 1 ? 'Screening' : 'Screenings'}
                      </div>
                      {p.latestAssessmentDate && (
                        <div className="text-xs text-slate-400 mt-1">
                          Last: {new Date(p.latestAssessmentDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Latest Score */}
                    <td className="py-4 px-6">
                      {p.latestScore !== null ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {Math.round(p.latestScore)}
                          </span>
                          <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending</span>
                      )}
                    </td>

                    {/* Within-person change cue */}
                    <td className="py-4 px-6">
                      {p.changeStatus === 'REVIEW' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            Review cue
                          </span>
                          {p.worsenedActivityCount > 0 && (
                            <div className="text-xs text-slate-500">
                              Daily-function change reported
                            </div>
                          )}
                        </div>
                      ) : p.changeStatus === 'NO_CHANGE' ? (
                        <span className="text-xs font-medium text-slate-500">No current cue</span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">More comparisons needed</span>
                      )}
                    </td>

                    {/* Latest Risk */}
                    <td className="py-4 px-6">
                      {getRiskBadge(p.latestRisk)}
                    </td>

                    {/* Action Links */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/doctor/patients/${p.patientId}/screen`}
                          title={`Start Screening Battery for ${p.name}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-medical-700 text-xs font-bold transition-all shadow-2xs"
                        >
                          <Play className="w-3 h-3 fill-medical-700" />
                          <span className="hidden xl:inline">Screen</span>
                        </Link>
                        
                        <Link
                          to={`/doctor/patients/${p.patientId}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        >
                          <span>Open File</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
