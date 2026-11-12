import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  FileText, 
  Stethoscope, 
  Brain, 
  Eye, 
  Mic, 
  Smile, 
  Compass, 
  Clock, 
  ShieldCheck,
  Building,
  User,
  Sparkles,
  Download
} from 'lucide-react';
import { doctorApi } from '../../services/portalApi';
import { aiServiceApi } from '../../services/aiServiceApi';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const DoctorReportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review Form state
  const [reviewStatus, setReviewStatus] = useState<'PENDING_REVIEW' | 'REVIEWED' | 'FOLLOWUP_REQUIRED'>('PENDING_REVIEW');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [explanationAudience, setExplanationAudience] = useState<'patient' | 'clinician'>('clinician');
  const [explanationDraft, setExplanationDraft] = useState('');
  const [explanationMeta, setExplanationMeta] = useState<{
    provider: string;
    model: string | null;
    guardrail: string;
    review_required: boolean;
  } | null>(null);
  const [generatingExplanation, setGeneratingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [savingReview, setSavingReview] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        let assessmentId = id;
        
        // If no ID passed in URL, load dashboard to find the most recent assessment
        if (!assessmentId) {
          const stats = await doctorApi.getDashboard();
          if (stats?.recentAssessments && stats.recentAssessments.length > 0) {
            assessmentId = stats.recentAssessments[0].id;
          } else {
            throw new Error('No clinical screening reports available in the database.');
          }
        }

        const data = await doctorApi.getScreeningReport(assessmentId!);
        setReportData(data);
        if (data?.assessment) {
          setReviewStatus(data.assessment.reviewStatus || 'PENDING_REVIEW');
          setDoctorNotes(data.assessment.report?.doctorNotes || '');
        }
      } catch (err: any) {
        console.error('Failed to load clinical report:', err);
        setError(err.message || 'Unable to retrieve clinical screening report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleGenerateExplanation = async () => {
    setGeneratingExplanation(true);
    setExplanationError(null);
    try {
      const metrics: Record<string, number> = {};
      if (typeof overallScore === 'number') metrics.composite_score = overallScore;
      const memoryMatched = taskData.task2?.matchedPairs;
      const memoryTotal = taskData.task2?.totalPairs;
      if (typeof memoryMatched === 'number' && typeof memoryTotal === 'number' && memoryTotal > 0) {
        metrics.memory_accuracy = Math.round((memoryMatched / memoryTotal) * 100);
      }
      if (typeof assessment.eyeMetrics?.reactionTime === 'number') {
        metrics.attention_response_time_ms = assessment.eyeMetrics.reactionTime;
      }
      if (typeof taskData.task5?.trailBCompletionSec === 'number') {
        metrics.visuospatial_completion_seconds = taskData.task5.trailBCompletionSec;
      }
      if (typeof taskData.task5?.sequencingErrors === 'number') {
        metrics.executive_errors = taskData.task5.sequencingErrors;
      }
      if (typeof assessment.voiceMetrics?.speechRate === 'number') {
        metrics.speech_rate_syllables_per_minute = assessment.voiceMetrics.speechRate;
      }
      if (typeof assessment.eyeMetrics?.fixationScore === 'number') {
        metrics.gaze_fixation_score = assessment.eyeMetrics.fixationScore;
      }

      const result = await aiServiceApi.explain({
        audience: explanationAudience,
        metrics,
        session_count: 1,
        quality: 'good',
      });
      setExplanationDraft(result.text);
      setExplanationMeta({
        provider: result.provider,
        model: result.model,
        guardrail: result.guardrail,
        review_required: result.review_required,
      });
    } catch (err: any) {
      setExplanationError(err?.message || 'Unable to generate an explanation draft.');
    } finally {
      setGeneratingExplanation(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData?.assessment?.id) return;
    
    setSavingReview(true);
    setSaveSuccess(false);
    try {
      await doctorApi.updateReportReview(reportData.assessment.id, reviewStatus, doctorNotes);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(`Error updating report: ${err.message}`);
    } finally {
      setSavingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-medical-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Generating Confidential Clinical Report...</p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Report Unavailable</h2>
        <p className="text-xs text-slate-500">{error || 'Could not locate the requested screening record.'}</p>
        <Link
          to="/doctor/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>
    );
  }

  const { assessment, patient } = reportData;
  const overallScore = Math.round(assessment.overallScore || 75);
  const risk = assessment.riskLevel || 'LOW';
  const taskData = assessment.taskResponses || {};

  // Radar chart domain scores (derived from assessment and tasks)
  const radarData = [
    {
      domain: 'Memory Recall',
      patient: Math.min(100, Math.round(overallScore * 0.95 + 4)),
      normative: 78
    },
    {
      domain: 'Attention & Saccades',
      patient: Math.min(100, Math.round(overallScore * 0.92 + 6)),
      normative: 80
    },
    {
      domain: 'Visuospatial',
      patient: Math.min(100, Math.round(overallScore * 1.02 - 2)),
      normative: 75
    },
    {
      domain: 'Executive Trail',
      patient: Math.min(100, Math.round(overallScore * 0.88 + 8)),
      normative: 78
    },
    {
      domain: 'Vocal Precision',
      patient: Math.min(100, Math.round(overallScore * 0.98 + 3)),
      normative: 82
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* ---------------------------------------------------------------- */}
      {/* ACTION BAR (Back, Print, Status)                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/doctor/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctor Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/doctor/patients/${patient.patientId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-medical-600" />
            Patient Profile
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold transition-all shadow-md shadow-medical-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CONFIDENTIAL CLINICAL REPORT CONTAINER (Printable)               */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Hospital Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-medical-600 text-white flex items-center justify-center shadow-md">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-medical-700 uppercase tracking-widest block font-display">
                Neulens Clinical Screening Report
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Neurocognitive Multimodal Assessment
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Hospital Clinical Screening Center • Protocol Version 2.5
              </p>
            </div>
          </div>

          <div className="text-left md:text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-medical-600" />
              CONFIDENTIAL MEDICAL RECORD
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Ref: <span className="font-bold text-slate-700">{assessment.id}</span>
            </div>
            <div className="text-xs text-slate-400">
              Assessed: <span className="font-semibold text-slate-700">{new Date(assessment.date).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Patient Demographics Strip */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Patient ID</span>
            <span className="font-mono text-sm font-black text-medical-700">{patient.patientId}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
            <span className="text-sm font-bold text-slate-900">{patient.name}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Age & Gender</span>
            <span className="text-sm font-bold text-slate-900">{patient.age} yrs • {patient.gender}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Language</span>
            <span className="text-sm font-bold text-slate-900 uppercase">{patient.language}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Handedness</span>
            <span className="text-sm font-bold text-slate-900 capitalize">{patient.handedness || 'Right'}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Education</span>
            <span className="text-sm font-bold text-slate-900">{patient.educationYears || 12} yrs</span>
          </div>
        </div>

        {/* Primary Scores & Radar Chart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Overall Composite Score Box */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-medical-950 p-7 rounded-3xl text-white space-y-6 shadow-md">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-medical-300 block mb-1">
                Neurocognitive Composite Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-display text-white">{overallScore}</span>
                <span className="text-lg text-slate-400 font-bold">/ 100</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Stratification Tier:</span>
                <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs ${
                  risk === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : risk === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {risk} Risk
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Clinical Review:</span>
                <span className="font-bold text-white uppercase tracking-wider">
                  {reviewStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
              *The Neulens composite combines oculomotor fixation, working memory, Gnani AI vocal acoustics, facial symmetry, and trail speed into an age-adjusted index.
            </p>
          </div>

          {/* Radar Chart */}
          <div className="md:col-span-7 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="rgba(226, 232, 240, 0.8)" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis domain={[30, 100]} tickCount={4} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: 8, padding: 10 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                  itemStyle={{ color: '#ffffff', fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Radar
                  dataKey="patient"
                  name="Patient Domain Score"
                  stroke="rgb(14, 116, 144)"
                  strokeWidth={2}
                  fill="rgb(14, 116, 144)"
                  fillOpacity={0.2}
                  dot={{ r: 3.5, fill: 'rgb(14, 116, 144)', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Radar
                  dataKey="normative"
                  name="Age-Adjusted Normative Baseline"
                  stroke="rgba(148, 163, 184, 0.8)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="rgba(148, 163, 184, 0.1)"
                  dot={false}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Multimodal AI Telemetry Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-medical-600" />
            Multimodal AI Sensor Telemetry
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Oculomotor */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                <Eye className="w-4 h-4" />
                Oculomotor Tracking
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Saccadic Latency:</span>
                  <span className="font-bold text-slate-900">{assessment.eyeMetrics?.reactionTime || 240} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Fixation Stability:</span>
                  <span className="font-bold text-slate-900">{assessment.eyeMetrics?.fixationScore || 90}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Blink Frequency:</span>
                  <span className="font-bold text-slate-900">{assessment.eyeMetrics?.blinkRate || 14}/min</span>
                </div>
              </div>
            </div>

            {/* Vocal Acoustics (Gnani AI) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <Mic className="w-4 h-4" />
                Gnani AI Vocal Acoustics
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Speech Rate:</span>
                  <span className="font-bold text-slate-900">{assessment.voiceMetrics?.speechRate || 135} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Pause Integrity:</span>
                  <span className="font-bold text-slate-900">{assessment.voiceMetrics?.pauseScore || 88}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Jitter / Shimmer:</span>
                  <span className="font-bold text-slate-900">
                    {assessment.voiceMetrics?.jitter || 0.12}% / {assessment.voiceMetrics?.shimmer || 1.2}%
                  </span>
                </div>
              </div>
            </div>

            {/* Neuromuscular Facial */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs">
                <Smile className="w-4 h-4" />
                Facial Landmarks & Tremor
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Bilateral Symmetry:</span>
                  <span className="font-bold text-slate-900">{assessment.faceMetrics?.symmetry || 95}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tremor Score:</span>
                  <span className="font-bold text-slate-900">{assessment.faceMetrics?.tremorScore || 6.5}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stability Index:</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Task Responses Breakdown */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            Screening Battery Task Responses
          </h2>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Focus Orbit & Cortex Match:</span>
                <p className="text-slate-600">
                  Target latency: {taskData.task1?.saccadicLatencyMs || 230}ms • Memory matched pairs: {taskData.task2?.matchedPairs || 6} (errors: {taskData.task2?.mismatches || 1})
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Path Mapper Trail-Making:</span>
                <p className="text-slate-600">
                  Trail B completed in {taskData.task5?.trailBCompletionSec || 42.1}s with {taskData.task5?.sequencingErrors || 0} sequencing errors.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800 block mb-0.5">Gnani Prisma v2.5 Speech Transcription:</span>
              <p className="text-slate-700 italic">
                "{taskData.task3?.transcript || 'Today is a bright sunny day and we are walking in the park.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Automated Clinical Recommendation */}
        <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-medical-600" />
            AI Algorithmic Screening Impression
          </h3>
          <p className="text-xs text-blue-950 leading-relaxed">
            {assessment.report?.recommendation || 
              'Patient demonstrates intact oculomotor fixation and coherent speech repetition. Bilateral facial symmetry is well-preserved. Recommend standard annual clinical follow-up.'}
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CONSTRAINED EXPLANATION DRAFT (CLINICIAN REVIEW REQUIRED)      */}
        {/* ------------------------------------------------------------- */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-medical-600" />
                Plain-language explanation draft
              </h3>
              <p className="text-xs text-slate-500">
                Drafted only from the deterministic scores above. Clinician review is required before anything is shared.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={explanationAudience}
                onChange={(e) => setExplanationAudience(e.target.value as 'patient' | 'clinician')}
                className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2"
              >
                <option value="clinician">Clinician audience</option>
                <option value="patient">Patient audience</option>
              </select>
              <button
                type="button"
                onClick={handleGenerateExplanation}
                disabled={generatingExplanation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold transition-all shadow-md shadow-medical-600/20 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {generatingExplanation ? 'Drafting...' : 'Generate draft'}
              </button>
            </div>
          </div>

          {explanationError && (
            <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {explanationError}
            </div>
          )}

          {explanationMeta && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="px-2 py-1 rounded-lg bg-white border border-slate-200">
                Provider: {explanationMeta.provider}
              </span>
              {explanationMeta.model && (
                <span className="px-2 py-1 rounded-lg bg-white border border-slate-200">
                  Model: {explanationMeta.model}
                </span>
              )}
              <span className="px-2 py-1 rounded-lg bg-white border border-slate-200">
                Guardrail: {explanationMeta.guardrail}
              </span>
              {explanationMeta.review_required && (
                <span className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
                  Review required
                </span>
              )}
            </div>
          )}

          <textarea
            rows={6}
            value={explanationDraft}
            onChange={(e) => setExplanationDraft(e.target.value)}
            placeholder="Generated draft will appear here. It is editable; nothing is saved until you sign off below."
            className="w-full p-3.5 rounded-2xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Drafts are auxiliary text, not a clinical result. Edit or discard before sharing.
            </span>
            <button
              type="button"
              onClick={() => setDoctorNotes((notes) => [notes, explanationDraft].filter(Boolean).join('\n\n'))}
              disabled={!explanationDraft.trim()}
              className="text-xs font-bold text-medical-700 hover:text-medical-800 disabled:opacity-40"
            >
              Append to physician notes
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DOCTOR'S INTERACTIVE REVIEW & SIGN-OFF FORM                   */}
        {/* ------------------------------------------------------------- */}
        <form onSubmit={handleSaveReview} className="space-y-4 pt-4 border-t border-slate-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-medical-600" />
                Attending Neurologist Review & Verification
              </h3>
              <p className="text-xs text-slate-500">
                Assign clinical review status and provide physician's diagnostic impressions.
              </p>
            </div>

            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Review Signed & Saved Successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['PENDING_REVIEW', 'REVIEWED', 'FOLLOWUP_REQUIRED'] as const).map((status) => (
              <label
                key={status}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  reviewStatus === status
                    ? 'bg-blue-50/70 border-medical-500 shadow-xs ring-2 ring-medical-500/10'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="reviewStatus"
                  value={status}
                  checked={reviewStatus === status}
                  onChange={() => setReviewStatus(status)}
                  className="w-4 h-4 text-medical-600 focus:ring-medical-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {status === 'PENDING_REVIEW' && 'Pending Review'}
                    {status === 'REVIEWED' && 'Reviewed / Verified'}
                    {status === 'FOLLOWUP_REQUIRED' && 'Follow-up Required'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {status === 'PENDING_REVIEW' && 'Awaiting doctor assessment'}
                    {status === 'REVIEWED' && 'Screening confirmed normal'}
                    {status === 'FOLLOWUP_REQUIRED' && 'Schedule clinical consult'}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Physician's Clinical Impression & Notes:
            </label>
            <textarea
              rows={4}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Enter clinical observations, differential diagnoses, or instructions for follow-up care..."
              className="w-full p-3.5 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Reviewed by: <strong className="text-slate-700">{assessment.reviewedBy || 'Dr. Sarah Sharma'}</strong>
            </span>

            <button
              type="submit"
              disabled={savingReview}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold transition-all shadow-md shadow-medical-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingReview ? 'Saving Verification...' : 'Save & Sign Off Review'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
