import React from 'react';
import { Activity, Brain, GitBranch, HeartPulse, ShieldCheck, Stethoscope, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

type PathwayStage = {
  stage: number;
  key: string;
  title: string;
  state: string;
  summary: string;
  details?: Record<string, any>;
};

type Prevention = {
  signals?: string[];
  note?: string;
};

const icons = [Activity, Brain, GitBranch, HeartPulse, Stethoscope];

function toneForState(state: string) {
  const s = (state || '').toUpperCase();
  if (s.includes('REVIEW') || s.includes('SAFETY_GATED') || s.includes('RECOMMENDED')) return 'border-amber-200 bg-amber-50 text-amber-800';
  if (s.includes('PROVISIONAL') || s.includes('INSUFFICIENT')) return 'border-blue-200 bg-blue-50 text-blue-800';
  if (s.includes('WITHIN') || s.includes('COLLECTED') || s.includes('ACTIVE') || s.includes('COMPLETED') || s.includes('REVIEWED') || s.includes('MONITORING')) return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

function prettyState(state: string) {
  return (state || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export const BrainHealthPathway: React.FC<{
  pathway?: PathwayStage[] | null;
  personalizedPrevention?: Prevention | null;
  compact?: boolean;
  title?: string;
}> = ({ pathway, personalizedPrevention, compact = false, title = 'Five-stage brain-health pathway' }) => {
  if (!pathway || pathway.length === 0) return null;

  return (
    <section className={`rounded-2xl border border-slate-200 bg-white ${compact ? 'p-4' : 'p-5'} space-y-4`} aria-label="Brain-health pathway">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Longitudinal care pathway</p>
          <h3 className={`${compact ? 'text-[15px]' : 'text-[17px]'} font-semibold text-slate-900 mt-0.5`}>{title}</h3>
          <p className="text-[12px] text-slate-600 mt-1">Screening support only — not a diagnosis. Poor-quality sessions are never interpreted as decline; clinicians own care decisions.</p>
        </div>
        <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
      </div>

      <ol className="space-y-2.5">
        {pathway.map((stage, idx) => {
          const Icon = icons[idx] || Activity;
          const tone = toneForState(stage.state);
          return (
            <li key={stage.key || stage.stage} className={`rounded-xl border p-3 ${compact ? '' : 'sm:p-3.5'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 flex-shrink-0">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold text-slate-900">{stage.stage}. {stage.title}</p>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${tone}`}>
                      {prettyState(stage.state)}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-5 text-slate-600">{stage.summary}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {personalizedPrevention && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <p className="text-[12px] font-semibold text-emerald-900">Personalized prevention (supportive)</p>
          </div>
          <p className="mt-1 text-[12px] leading-5 text-emerald-900/90">
            {personalizedPrevention.note || 'Supportive, non-diagnostic suggestions to discuss with a clinician; not medical advice or a treatment plan.'}
          </p>
          {personalizedPrevention.signals && personalizedPrevention.signals.length > 0 && (
            <p className="mt-1.5 text-xs text-emerald-800">
              Signals noted (from recorded inputs only): <span className="font-semibold">{personalizedPrevention.signals.join(', ').replace(/_/g, ' ')}</span>
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default BrainHealthPathway;



export function derivePathwayFromOverview(args: {
  baseline: any;
  changes: any[];
  brainHealth: any;
  assessments: any[];
  context: any[];
}) {
  const { baseline, changes, brainHealth, assessments, context } = args;
  const latestChange = changes?.[0];
  const comparableCount = assessments?.filter((a: any) => a?.status === 'COMPLETED').length || 0;
  const hasContext = (context || []).length > 0;
  const stage3State = !latestChange
    ? (comparableCount >= 2 ? 'INSUFFICIENT_DATA' : 'INSUFFICIENT_DATA')
    : latestChange.status === 'REVIEW' ? 'REVIEW_SIGNAL'
    : latestChange.status === 'NO_CHANGE' ? 'WITHIN_PERSONAL_RANGE'
    : 'INSUFFICIENT_DATA';
  const stage3Summary = stage3State === 'REVIEW_SIGNAL'
    ? 'A meaningful review signal was detected relative to personal baseline and comparable history. Normal variation and measurement quality are considered.'
    : stage3State === 'WITHIN_PERSONAL_RANGE'
      ? 'Recent comparable observations are within the recorded personal range. Poor quality is never treated as decline.'
      : 'Not enough comparable, quality-checked sessions yet to determine meaningful change; continue follow-up.';

  const review = latestChange?.status === 'REVIEW' || brainHealth?.riskTier === 'HIGH';
  const preventionSteps = (brainHealth?.nextSteps || []).filter((s: any) => s?.stage === 4 || s?.type === 'PERSONALIZED_PREVENTION' || s?.type === 'REVIEW_CONTEXT');

  return [
    {
      stage: 1, key: 'population_signals_and_screening', title: 'Population signals and screening', state: 'COLLECTED',
      summary: 'Cognitive, functional, and available lifestyle/health/context screening signals are collected over time.',
      details: { hasHealthContext: hasContext }
    },
    {
      stage: 2, key: 'personal_baseline', title: 'Personal baseline', state: baseline ? 'ACTIVE' : 'PENDING',
      summary: baseline ? 'A personal brain-health baseline is established for within-person comparison (early baselines may be provisional).' : 'Complete initial screening(s) to establish a provisional personal baseline.',
      details: { assessmentsCount: comparableCount }
    },
    {
      stage: 3, key: 'meaningful_change_detection', title: 'Meaningful change detection', state: stage3State,
      summary: stage3Summary,
    },
    {
      stage: 4, key: 'personalized_prevention', title: 'Personalized prevention', state: preventionSteps.length ? 'SUGGESTED' : 'AVAILABLE',
      summary: 'Personalized, non-diagnostic prevention and brain-health support suggestions to discuss with a clinician.',
    },
    {
      stage: 5, key: 'clinical_referral_and_closed_loop_outcomes', title: 'Clinical referral and closed-loop outcomes', state: review ? 'CLINICAL_REVIEW_RECOMMENDED' : 'MONITORING',
      summary: review ? 'Clinician review is recommended to determine appropriate care, referral needs, and follow-up; outcomes should be tracked to close the loop.' : 'Continue clinician-guided monitoring and track follow-up outcomes over time; referral is a clinician decision if indicated.',
    },
  ];
}
