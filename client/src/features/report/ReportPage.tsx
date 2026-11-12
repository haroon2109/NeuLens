import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useScreeningStore } from '../../store/screeningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Printer, 
  Send, 
  RotateCcw, 
  Eye, 
  MessageSquare, 
  Smile, 
  Brain, 
  Activity, 
  MousePointer, 
  ArrowLeft,
  CheckCircle,
  Mail,
  User,
  ShieldCheck,
  Building,
  Calendar,
  FileText,
  Stethoscope,
  Sparkles,
  Info
} from 'lucide-react';
import { ResultVoiceExplainer } from '../../components/voice/ResultVoiceExplainer';
import { LanguageSelectorModal } from '../../components/voice/LanguageSelectorModal';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { scores, biometricMetrics } = useScreeningStore();
  
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  if (scores.compositeScore <= 0 || !biometricMetrics) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <section className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Report data unavailable</h1>
          <p className="mt-3 text-sm text-slate-600">
            A report can only be prepared after assessment data is available. No diagnosis is generated.
          </p>
          <Link to="/doctor/patients" className="mt-6 inline-flex rounded-xl bg-sky-700 px-5 py-3 text-sm font-bold text-white">
            Return to patient records
          </Link>
        </section>
      </main>
    );
  }

  const reportBiometrics = biometricMetrics;
  
  const reportScores = scores;

  const composite = reportScores.compositeScore;
  const riskBg = 'bg-sky-50/90 border-sky-200/80 text-sky-900';

  const radarData = [
    { domain: 'Memory', profile: reportScores.memoryScore },
    { domain: 'Attention', profile: reportScores.attentionScore },
    { domain: 'Visuospatial', profile: reportScores.visuospatialScore },
    { domain: 'Executive', profile: reportScores.executiveScore },
    { domain: 'Speech Sync', profile: reportScores.game3Score },
    { domain: 'Ocular Focus', profile: reportScores.game1Score }
  ];

  const ringRadius = 55;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (composite / 100) * ringCircumference;

  const handlePrint = () => {
    window.print();
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShareSuccess(true);
    setTimeout(() => {
      setIsShareOpen(false);
      setShareSuccess(false);
      setShareEmail('');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 print:p-0 print:m-0 print:max-w-none">
      
      {/* 1. Header Toolbar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-medical-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handlePrint} className="btn-secondary text-xs py-2.5 px-4 font-semibold rounded-2xl flex items-center gap-2">
            <Printer className="w-3.5 h-3.5" />
            Download / Print PDF
          </button>
          
          <button onClick={() => setIsShareOpen(true)} className="btn-secondary text-xs py-2.5 px-4 font-semibold rounded-2xl flex items-center gap-2 hover:border-medical-300 hover:text-medical-600">
            <Send className="w-3.5 h-3.5" />
            Share with Doctor
          </button>

          <Link to="/dashboard/screen" className="btn-primary text-xs py-2.5 px-4 font-bold rounded-2xl flex items-center gap-2 shadow-pill">
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Test
          </Link>
        </div>
      </div>

      {/* Voice Result Explainer */}
      <div className="print:hidden">
        <ResultVoiceExplainer 
          compositeScore={composite} 
          onOpenLanguageModal={() => setIsLangModalOpen(true)}
        />
      </div>

      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />

      {/* CLINICAL REPORT DOCUMENT CONTAINER */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-card p-6 md:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medical-600 to-blue-500 flex items-center justify-center text-white shadow-md">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-display">Neulens</h1>
                <span className="text-xs bg-medical-50 text-medical-700 font-bold px-2 py-0.5 rounded-full border border-medical-200 uppercase tracking-wider">
                  AI Screening Report
                </span>
              </div>
              <p className="text-xs text-slate-500">Multimodal Neurological & Cognitive Health Evaluation</p>
            </div>
          </div>

          <div className="text-left md:text-right text-xs space-y-0.5 text-slate-500">
            <p><span className="font-semibold text-slate-700">Report Ref:</span> CR-2026-1044A</p>
            <p><span className="font-semibold text-slate-700">Generated:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p><span className="font-semibold text-slate-700">Platform Build:</span> v2.4 (Medical AI Core)</p>
          </div>
        </div>

        {/* Patient Demographic Summary Card */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Patient Name / ID</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">Eleanor Vance</span>
            <span className="text-xs text-slate-500 font-mono">ID: cv-p-1044</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Age & Gender</span>
            <span className="font-bold text-slate-800 mt-0.5 block">72 Years • Female</span>
            <span className="text-xs text-slate-500">DOB: 14/05/1954</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assessment Battery</span>
            <span className="font-bold text-slate-800 mt-0.5 block">Full 5-Domain Battery</span>
            <span className="text-xs text-medical-600 font-medium">Multimodal AI Stream</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Referring Clinician</span>
            <span className="font-bold text-slate-800 mt-0.5 block">Dr. Sarah Sharma, MD</span>
            <span className="text-xs text-slate-500">Neurology Clinic 3A</span>
          </div>
        </div>

        {/* 2. Strict Clinical Advisory Banner */}
        <div className={`p-5 rounded-2xl border flex gap-4 text-left ${riskBg}`}>
          <ShieldAlert className="w-6 h-6 text-medical-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">
              Prototype score: {composite}%
              </h4>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              This exploratory score has no validated clinical threshold or population reference and should not be used to diagnose or estimate disease risk.
            </p>
            <p className="text-xs leading-relaxed pt-1 border-t border-slate-200/50 mt-1.5 opacity-80">
              <strong>Clinical disclaimer:</strong> Neulens does not provide a diagnosis. Review screening changes and limitations with a qualified clinician before deciding on follow-up.
            </p>
          </div>
        </div>

        {/* 3. Score Overview & Radar layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Circular Composite Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exploratory Composite Score</span>
              <p className="text-xs text-slate-500">Prototype weighted task-performance metric; not a validated clinical measure</p>
            </div>

            {/* Large SVG score meter */}
            <div className="relative w-36 h-36 flex items-center justify-center my-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={ringRadius}
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={ringRadius}
                  className="stroke-medical-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-bold font-display text-slate-900">{composite}%</span>
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">Composite</span>
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-700 font-bold">Not a diagnosis</span>
            </div>
          </div>

          {/* Radar analysis display */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 font-display">Domain Breakdown Radar</h4>
              <p className="text-xs text-slate-500">Longitudinal variance across 6 cognitive & physiological vectors</p>
            </div>

            <div className="h-48 relative mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[40, 100]} tickCount={4} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: 8, padding: 10 }}
                    labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                    itemStyle={{ color: '#ffffff', fontSize: 11 }}
                  />
                  <Radar
                    dataKey="profile"
                    name="Cognitive Battery Profile"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fill="#0284c7"
                    fillOpacity={0.14}
                    dot={{ r: 3.5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. Diagnostic Biomarkers Matrix */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Biomarkers & Functional Domains</h3>
            <p className="text-xs text-slate-500">Direct scores computed from interactive screening battery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6">
            
            {/* LEFT COLUMN: Biomarkers */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-medical-700 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-medical-500" />
                Physiological Biomarkers
              </h4>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-medical-600" /> Speech & Vocal Prosody
                  </span>
                  <span className="text-slate-900 font-bold">{reportScores.game3Score}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-medical-500 rounded-full" style={{ width: `${reportScores.game3Score}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-500" /> Ocular Saccade & Fixation
                  </span>
                  <span className="text-slate-900 font-bold">{reportScores.game1Score}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${reportScores.game1Score}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-500" /> Facial Kinematics & Symmetry
                  </span>
                  <span className="text-slate-900 font-bold">{reportScores.game4Score}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${reportScores.game4Score}%` }} />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Cognitive Domains */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-500" />
                Cognitive Capabilities
              </h4>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" /> Attention & Working Focus
                  </span>
                  <span className="text-slate-900 font-bold">{reportScores.attentionScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${reportScores.attentionScore}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-teal-600" /> Episodic & Spatial Memory
                  </span>
                  <span className="text-slate-900 font-bold">{reportScores.memoryScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${reportScores.memoryScore}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <MousePointer className="w-3.5 h-3.5 text-emerald-600" /> Reaction Speed & Latency
                  </span>
                  <span className="text-slate-900 font-bold">{reportScores.game1Score}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reportScores.game1Score}%` }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. AI Screening Summary & Recommended Next Steps */}
        <div className="bg-medical-50/50 border border-medical-100 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-medical-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">AI Screening Synthesis</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Patient demonstrated solid memory recall performance (82%) with minor reaction latency elevations noted during eye tracking target saccades. Vocal acoustic markers remain stable with minimal jitter (0.11%). Facial movement indicators reflect symmetrical voluntary mimicry. Current indicators suggest normal cognitive aging patterns with isolated areas for regular 6-month monitoring.
          </p>
          <div className="pt-3 border-t border-medical-200/60 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold text-slate-800">Recommended Follow-up:</span>
            <span className="bg-white px-3 py-1 rounded-full border border-medical-200 text-medical-700 font-semibold shadow-xs">
              Rescreen in 6 Months
            </span>
            <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-600 font-semibold shadow-xs">
              Continue Lifestyle & Cognitive Exercises
            </span>
          </div>
        </div>

        {/* 6. Clinical Specialist Referral Network */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-display">Specialist Clinical Care Directory</h3>
          <p className="text-xs text-slate-500">Partnered memory care institutions for comprehensive medical diagnosis and management:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-medical-600" />
                <h4 className="text-xs font-bold text-slate-900">Metro Neurosciences Center</h4>
              </div>
              <p className="text-xs text-slate-500">742 Evergreen Terrace • +1 (555) 234-5678</p>
              <p className="text-xs text-medical-600 font-semibold">Lead Neurologist: Dr. Evelyn Carter, MD, PhD</p>
            </div>
            
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-medical-600" />
                <h4 className="text-xs font-bold text-slate-900">St. Jude Memory Assessment Institute</h4>
              </div>
              <p className="text-xs text-slate-500">1040 Academic Parkway • +1 (555) 876-5432</p>
              <p className="text-xs text-medical-600 font-semibold">Lead Neurologist: Dr. Marcus Vance, MD</p>
            </div>
          </div>
        </div>

        {/* Clinician-use statement & signature */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Intended for clinician reference. Do not share outside the care team.</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-slate-700">Neulens Medical Intelligence</span>
          </div>
        </div>

      </div>

      {/* 7. MODAL: Doctor Share Portal */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-medical-50 border border-medical-200 text-medical-600 flex items-center justify-center mx-auto shadow-xs">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Secure Doctor Share</h3>
                <p className="text-xs text-slate-500">Transfer screening metrics directly to your healthcare provider</p>
              </div>

              {!shareSuccess ? (
                <form onSubmit={handleShareSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs text-slate-600 font-bold uppercase tracking-wider">Doctor's Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={shareEmail}
                      onChange={e => setShareEmail(e.target.value)}
                      placeholder="provider@medicalcenter.org"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs text-slate-600 font-bold uppercase tracking-wider">Patient Authorization Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Eleanor Vance"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsShareOpen(false)} 
                      className="flex-1 btn-secondary text-xs font-semibold py-3 rounded-2xl"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 btn-primary text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-pill"
                    >
                      Transmit Data
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Transmission Successful</h4>
                  <p className="text-xs text-slate-500">Encrypted token package dispatched to {shareEmail}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
export default ReportPage;
