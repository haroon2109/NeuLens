import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Eye,
  FileText,
  Info,
  ListChecks,
  ShieldCheck,
  Users
} from 'lucide-react';
import { doctorApi, type DoctorDashboardStats } from '../../../services/portalApi';
import { useDoctorPortalStore } from '../../../store/doctorPortalStore';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import { Card, ChangePill, DoctorPageHeader, EmptyState, Notice, Pill, ReviewPill, RiskPill, StatCard, formatDate, primaryButton, secondaryButton } from './ui';

const metricRow = (label: string, value: string, detail: string) => (
  <div key={label} className="rounded-xl border border-slate-200 p-3">
    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
    <p className="mt-1 text-[18px] font-semibold text-slate-900">{value}</p>
    <p className="mt-1 text-xs leading-4 text-slate-500">{detail}</p>
  </div>
);

export const DoctorClinicalReviewQueuePage: React.FC = () => {
  // Integrates into existing review workflow: change-detection queue + pending assessments.
  return (
    <div className="space-y-5">
      <DoctorPageHeader
        screen="Clinical review queue"
        title="Clinical Review Queue"
        description="Cases awaiting review, with recorded urgency/status cues. Review change signals and pending assessments before recording a clinical decision."
        actions={
          <>
            <Link to="/doctor/change-detection" className={primaryButton}><AlertTriangle className="h-4 w-4" /> Open change queue</Link>
            <Link to="/doctor/patients" className={secondaryButton}><Users className="h-4 w-4" /> Patient list</Link>
          </>
        }
      />
      <MotionReveal><HealthcareScene kind="clinicalReview" className="w-full max-w-4xl" /></MotionReveal>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-[13px] font-semibold text-slate-900">Change detection queue</h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">Within-person signals needing acknowledgement (recorded, not diagnostic). Includes urgency/status where available.</p>
          <Link to="/doctor/change-detection" className={`${primaryButton} mt-3 inline-flex`}>View cases awaiting review <ArrowRight className="h-4 w-4" /></Link>
        </Card>
        <Card>
          <h2 className="text-[13px] font-semibold text-slate-900">Assessment reviews & approvals</h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">Open a patient to review the latest assessment, compare longitudinally, check evidence/quality, and record an approval or follow-up decision.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/doctor/patients" className={secondaryButton}>Open patient records</Link>
            <Link to="/doctor/reports" className={secondaryButton}><FileText className="h-4 w-4" /> Reports</Link>
          </div>
        </Card>
      </div>
      <Notice tone="info" title="Clinician-in-the-loop">
        Urgency and status are derived from recorded observations and quality/comparability gates. Poor quality or missing data must not be interpreted as decline. Final actions require clinician judgement and approval.
      </Notice>
    </div>
  );
};

export const DoctorQualityEquityPage: React.FC = () => {
  const [stats, setStats] = React.useState<DoctorDashboardStats | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    doctorApi.getDashboard().then((d) => { if (!cancelled) setStats(d); }).catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Unavailable'); });
    return () => { cancelled = true; };
  }, []);

  const total = stats?.totalPatients ?? 0;
  const completed = stats?.completedAssessments ?? 0;
  const today = stats?.assessmentsToday ?? 0;
  const pending = stats?.pendingReviews ?? 0;
  const completionRate = total > 0 ? Math.round((completed / Math.max(completed + pending, 1)) * 100) : null;

  return (
    <div className="space-y-5">
      <DoctorPageHeader
        screen="Quality & equity"
        title="Quality & Equity Dashboard"
        description="Reliability, completion, quality and recorded operational metrics. No accuracy/sensitivity/specificity figures are shown from synthetic data as if they were real clinical performance."
        actions={<Link to="/doctor/dashboard" className={secondaryButton}>Back to dashboard</Link>}
      />      <MotionReveal><HealthcareScene kind="quality" className="w-full max-w-4xl" /></MotionReveal>


      <Notice tone="warning" title="Recorded data only">
        Performance claims (sensitivity, specificity, test-retest reliability, meaningful change detection performance) are shown only when computed from real, validated clinical data available to this deployment. If not available, they are reported as “Not available (insufficient recorded/validated data)” — never fabricated or presented from synthetic data.
      </Notice>

      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">Live metrics unavailable ({error}). Values below may be incomplete.</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assessment completion (recorded)" value={completionRate != null ? `${completionRate}%` : 'Not available'} detail={`${completed} completed · ${pending} pending review`} icon={ClipboardCheck} />
        <StatCard label="Assessments recorded" value={String(completed)} detail={`${today} in last 24h`} icon={Activity} tone="blue" />
        <StatCard label="Pending reviews" value={String(pending)} detail="Awaiting clinician review" icon={ListChecks} tone="amber" />
        <StatCard label="Enrolled patients" value={String(total)} detail="Registered records" icon={Users} tone="green" />
      </div>

      <Card>
        <h2 className="text-[13px] font-semibold text-slate-900">Performance & reliability (validated data required)</h2>
        <p className="mt-1 text-xs text-slate-500">Metrics appear only from real recorded/validated datasets. Synthetic values are never shown as clinical performance.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ['Test-retest reliability', 'Not available (insufficient recorded/validated data)', 'Requires repeated comparable sessions with validated ground truth/protocol.'],
            ['Sensitivity', 'Not available (insufficient recorded/validated data)', 'Not computed from synthetic data.'],
            ['Specificity', 'Not available (insufficient recorded/validated data)', 'Not computed from synthetic data.'],
            ['False-referral burden', 'Not available (insufficient recorded/validated data)', 'Requires verified referral outcomes.'],
            ['Meaningful change detection', 'Not available (insufficient recorded/validated data)', 'Deterministic cues exist; validated performance not established here.'],
            ['Time to clinical assessment', 'Not available (insufficient recorded/validated data)', 'Requires recorded referral-to-assessment timestamps.'],
            ['Data quality', 'Recorded per session (see Evidence & Data Quality)', 'Audio/video/completion/comparability captured per assessment.']
          ].map(([l, v, d]) => metricRow(l, v, d))}
        </div>
      </Card>

      <Card>
        <h2 className="text-[13px] font-semibold text-slate-900">Population breakdowns (recorded characteristics only)</h2>
        <p className="mt-1 text-xs leading-5 text-slate-600">Breakdowns by Age, Language, Education level, Hearing and vision accessibility, Digital familiarity, and other relevant characteristics are shown only when those fields are recorded for the cohort. No imputation or invented demographics.</p>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Current status</p>
          <p className="mt-1 leading-5">Cohort-level breakdowns not available in this view without aggregated recorded characteristic fields. Collect and store these fields (with consent) to enable equity monitoring. Interpret any subgroup metrics cautiously and only when sample sizes and data quality are sufficient.</p>
        </div>
      </Card>
    </div>
  );
};

export const DoctorEvidenceDataQualityPage: React.FC = () => {
  const [stats, setStats] = React.useState<DoctorDashboardStats | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    doctorApi.getDashboard().then((d) => { if (!cancelled) setStats(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const recent = (stats?.recentAssessments || []).slice(0, 8);
  return (
    <div className="space-y-5">
      <DoctorPageHeader
        screen="Evidence & data quality"
        title="Evidence & Data Quality"
        description="Sources, missing fields, limitations, quality/comparability, and model/workflow versions for recorded observations. Deterministic scoring; missing data remains missing."
        actions={<Link to="/doctor/reports" className={secondaryButton}><FileText className="h-4 w-4" /> Reports</Link>}
      />      <MotionReveal><HealthcareScene kind="report" className="w-full max-w-4xl" /></MotionReveal>


      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900"><Database className="h-4 w-4 text-blue-700" /> Evidence sources & provenance</h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-700">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /><span><strong>Fixed-observation cognitive tasks</strong> (standardized form/versioned where recorded). Scores are deterministic from recorded task responses.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /><span><strong>Session quality & comparability</strong> (audio/video/completion/comprehension/interruptions) gate interpretation; poor quality never implies decline.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /><span><strong>Functional & health context</strong> self/caregiver/clinician-entered inputs used for discussion, not independent diagnosis.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /><span><strong>Workflow/orchestrator</strong> records rule-based stages and evidence/limitations when available (e.g. deterministic-orchestrator-v1); LLM assistance not used by default.</span></li>
            <li className="flex gap-2"><AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" /><span><strong>Adaptive practice</strong> (if present) is explicitly excluded from clinical scores, baselines, and change comparison.</span></li>
          </ul>
        </Card>

        <Card>
          <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900"><ShieldCheck className="h-4 w-4 text-blue-700" /> Limitations & missing data</h2>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700 list-disc pl-4">
            <li>Observations are screening/monitoring support, not a diagnosis. Provisional baselines and population norms may not apply; within-person comparison requires comparable, quality-acceptable sessions.</li>
            <li>Missing fields remain missing and are surfaced explicitly; absence of data is not evidence of decline or stability.</li>
            <li>Model/task/workflow versions should be reviewed per assessment record when available; comparisons across different forms/conditions may be invalid.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">Review per-patient assessment details for session-specific quality flags, comparability, and evidence links.</p>
        </Card>
      </div>

      <Card padded={false}>
        <div className="border-b border-slate-100 px-4 py-3.5">
          <h2 className="text-[13px] font-semibold text-slate-900">Recent assessments (open for quality/evidence review)</h2>
          <p className="mt-0.5 text-xs text-slate-500">Select a patient assessment to inspect recorded quality, comparability, and review context.</p>
        </div>
        {recent.length ? (
          <ul className="divide-y divide-slate-100">
            {recent.map((a) => (
              <li key={a.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link to={`/doctor/patients/${a.patientId}/review?assessment=${a.id}`} className="text-[12px] font-semibold text-slate-900 hover:text-blue-700">{a.patientName}</Link>
                  <p className="text-xs text-slate-500">{formatDate(a.date)} · {a.assessmentType || 'Screening'} · score {Math.round(a.score)}/100</p>
                </div>
                <div className="flex items-center gap-2">
                  <RiskPill risk={a.riskLevel} />
                  <ReviewPill status={a.reviewStatus} />
                  <Link to={`/doctor/patients/${a.patientId}/review?assessment=${a.id}`} className={secondaryButton}>Review evidence <ArrowRight className="h-3.5 w-3.5" /></Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6"><EmptyState scene="emptyAssessment" icon={Eye} title="No recent assessments recorded" detail="Completed assessments will appear here for evidence and quality review." /></div>
        )}
      </Card>
    </div>
  );
};

export const DoctorClinicalApprovalPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <DoctorPageHeader
        screen="Clinical approval"
        title="Clinical Approval"
        description="Approve, edit, reject, or request reassessment for reviewed cases. Decisions are clinician-owned and recorded; no autonomous diagnosis or treatment."
        actions={<Link to="/doctor/change-detection" className={primaryButton}>Open review queue</Link>}
      />

      <MotionReveal><HealthcareScene kind="clinicalReview" className="w-full max-w-4xl" /></MotionReveal>      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-[13px] font-semibold text-slate-900">Record a decision</h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">Open a patient’s assessment review or clinical notes to approve findings, edit the interpretation/plan, reject an action, or request reassessment. Use evidence and data-quality context before deciding.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/doctor/patients" className={secondaryButton}>Select patient</Link>
            <Link to="/doctor/change-detection" className={secondaryButton}>Change review queue</Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-[13px] font-semibold text-slate-900">Approval principles</h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-700 list-disc pl-4">
            <li>Clinicians own actions, referrals, and follow-up decisions.</li>
            <li>Do not treat screening observations or LLM-assisted text as diagnosis or prescription.</li>
            <li>Request reassessment when quality/comparability is insufficient or context is missing.</li>
            <li>Document rationale, limitations, and next steps in the clinical record.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
