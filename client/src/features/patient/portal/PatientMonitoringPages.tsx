import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Info,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Waves
} from 'lucide-react';
import { usePatientPortalStore, treatmentTeam } from '../../../store/patientPortalStore';
import { usePatientOverview } from './usePatientOverview';
import { ErrorState, LoadingState, MonitoringResultState } from '../../../components/systemStates';
import {
  AssessmentStatusPill,
  Card,
  EmptyState,
  InfoRow,
  Pill,
  PortalPageHeader,
  ScoreDial,
  SectionTitle,
  TrendLine,
  formatDate
} from './ui';

const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-[12px] font-bold text-white shadow-sm transition hover:bg-blue-800';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50';

const statusCopy = (status?: string) => {
  switch (status) {
    case 'NO_CHANGE':
      return { label: 'Stable', tone: 'green' as const, detail: 'No review prompt was raised at this check.' };
    case 'REVIEW':
      return { label: 'Review suggested', tone: 'amber' as const, detail: 'At least one observation fell outside the recorded personal range.' };
    case 'INSUFFICIENT_DATA':
      return { label: 'Insufficient data', tone: 'slate' as const, detail: 'Not enough comparable sessions to interpret change.' };
    default:
      return { label: 'Monitoring', tone: 'blue' as const, detail: 'Building a comparable monitoring history.' };
  }
};

const reasonLabel = (reason: string) => {
  if (reason === 'OUTSIDE_OBSERVED_BASELINE') return 'An observation fell outside the recorded personal range';
  if (reason === 'FUNCTIONAL_CHANGE') return 'A daily-function response changed';
  if (reason === 'CONTEXT_CHANGE') return 'Sleep, activity, or mood context changed';
  return reason.replace(/_/g, ' ').toLowerCase();
};

// ---------------------------------------------------------------------------
// Screen 30 — Brain Health Overview
// ---------------------------------------------------------------------------
export const BrainHealthOverviewPage: React.FC = () => {
  const { assessments, latestAssessment, baseline, changes, brainHealth } = usePatientOverview();
  const { carePlan } = usePatientPortalStore();
  const latestChange = changes[0];
  const status = statusCopy(latestChange?.status);

  const domainDeltas: Array<{ label: string; value: string; direction: 'up' | 'down' | 'flat' }> = [];
  if (baseline && latestAssessment) {
    const overall = latestAssessment.overallScore - baseline.overallScore;
    domainDeltas.push({
      label: 'Cognitive',
      value: `${overall >= 0 ? '+' : ''}${overall.toFixed(1)}`,
      direction: Math.abs(overall) < 0.5 ? 'flat' : overall > 0 ? 'up' : 'down'
    });
    if (latestAssessment.eyeMetrics && baseline.eyeScore != null) {
      domainDeltas.push({
        label: 'Ocular',
        value: `${latestAssessment.eyeMetrics.fixationScore - baseline.eyeScore >= 0 ? '+' : ''}${(latestAssessment.eyeMetrics.fixationScore - baseline.eyeScore).toFixed(1)}`,
        direction:
          Math.abs(latestAssessment.eyeMetrics.fixationScore - baseline.eyeScore) < 0.5
            ? 'flat'
            : latestAssessment.eyeMetrics.fixationScore > baseline.eyeScore
            ? 'up'
            : 'down'
      });
    }
    if (latestAssessment.voiceMetrics && baseline.voiceScore != null) {
      domainDeltas.push({
        label: 'Vocal',
        value: `${latestAssessment.voiceMetrics.pauseScore - baseline.voiceScore >= 0 ? '+' : ''}${(latestAssessment.voiceMetrics.pauseScore - baseline.voiceScore).toFixed(1)}`,
        direction:
          Math.abs(latestAssessment.voiceMetrics.pauseScore - baseline.voiceScore) < 0.5
            ? 'flat'
            : latestAssessment.voiceMetrics.pauseScore > baseline.voiceScore
            ? 'up'
            : 'down'
      });
    }
    if (latestAssessment.faceMetrics && baseline.faceScore != null) {
      domainDeltas.push({
        label: 'Facial',
        value: `${latestAssessment.faceMetrics.symmetry - baseline.faceScore >= 0 ? '+' : ''}${(latestAssessment.faceMetrics.symmetry - baseline.faceScore).toFixed(1)}`,
        direction:
          Math.abs(latestAssessment.faceMetrics.symmetry - baseline.faceScore) < 0.5
            ? 'flat'
            : latestAssessment.faceMetrics.symmetry > baseline.faceScore
            ? 'up'
            : 'down'
      });
    }
  }

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 30 · Brain-health overview"
        title="Your monitoring picture"
        description="A single view of your personal baseline, latest observations, and monitoring status. Trends are shown only where enough valid sessions exist."
        actions={
          <Link to="/patient/assessment/intro" className={primaryButton}>
            <Sparkles className="h-4 w-4" /> Next assessment
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="flex flex-col items-center justify-center text-center">
          <ScoreDial value={brainHealth?.profileScore ?? baseline?.overallScore ?? 0} label="Brain health" tone="#0D9488" />
          <div className="mt-3">
            <Pill tone={status.tone} dot>{status.label}</Pill>
          </div>
          <p className="mt-2 max-w-[250px] text-xs leading-5 text-slate-500">
            {brainHealth?.interpretation ||
              'A monitoring summary will appear after enough comparable sessions and a clinician context review.'}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
            Prototype summary · not a diagnosis
          </p>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Monitoring status" detail={latestChange ? `Last check ${formatDate(latestChange.detectedAt)}` : 'Not yet assessed'} />
            <div className={`rounded-xl border p-3 ${status.label === 'Review suggested' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <p className="text-[12px] font-semibold text-slate-900">{status.detail}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                A review prompt is not a diagnosis. Your clinician considers it with your history, context, and other sessions.
              </p>
            </div>
            <dl className="mt-3">
              <InfoRow label="Latest valid assessment" value={latestAssessment ? formatDate(latestAssessment.date) : 'None'} />
              <InfoRow label="Valid sessions recorded" value={String(assessments.length)} />
              <InfoRow label="Personal baseline" value={baseline ? 'Active · provisional' : 'Not established'} />
              <InfoRow label="Next scheduled assessment" value={formatDate(carePlan.nextReview)} />
            </dl>
          </Card>

          <Card>
            <SectionTitle title="Domain-wise change" detail="Compared with your recorded baseline, when conditions allow." />
            {domainDeltas.length ? (
              <div className="grid grid-cols-2 gap-2.5">
                {domainDeltas.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">{item.label}</p>
                    <p className={`mt-1 text-[18px] font-semibold ${
                      item.direction === 'up' ? 'text-emerald-700' : item.direction === 'down' ? 'text-amber-700' : 'text-slate-700'
                    }`}>
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">points from baseline</p>
                  </div>
                ))}
              </div>
            ) : (
              <MonitoringResultState
                compact
                finding={
                  !baseline
                    ? 'NO_BASELINE'
                    : latestChange?.status === 'INSUFFICIENT_DATA'
                    ? 'INSUFFICIENT_DATA'
                    : 'NO_SIGNIFICANT_CHANGE'
                }
                actions={
                  <Link to="/patient/assessment/intro" className={primaryButton}>
                    {baseline ? 'Complete another session' : 'Complete your first assessment'}
                  </Link>
                }
              />
            )}
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Higher is not always better; some observations are descriptive. Values are exploratory prototype outputs.
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionTitle title="Latest observations" />
          <dl>
            <InfoRow label="Ocular" value={latestAssessment?.eyeMetrics ? `${Math.round(latestAssessment.eyeMetrics.fixationScore)} fixation` : 'Not available'} />
            <InfoRow label="Vocal" value={latestAssessment?.voiceMetrics ? `${Math.round(latestAssessment.voiceMetrics.speechRate)} wpm` : 'Not available'} />
            <InfoRow label="Facial" value={latestAssessment?.faceMetrics ? `${Math.round(latestAssessment.faceMetrics.symmetry)} symmetry` : 'Not available'} />
            <InfoRow label="Functional" value={latestAssessment?.taskResponses?.task5?.trailBCompletionSec ? `${latestAssessment.taskResponses.task5.trailBCompletionSec}s trail` : 'Not available'} />
          </dl>
        </Card>

        <Card>
          <SectionTitle title="What comes next" detail="From your clinician-approved monitoring plan." />
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
            <div>
              <p className="text-xs font-semibold text-blue-950">Next assessment</p>
              <p className="mt-0.5 text-xs leading-5 text-blue-900/80">
                Aim for {formatDate(carePlan.nextReview)}. A similar time of day and environment helps comparison.
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
            {carePlan.steps.slice(0, 2).map((step) => (
              <li key={step.id} className="flex gap-2">
                <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${step.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                {step.title}
              </li>
            ))}
          </ul>
          <Link to="/patient/care-plan" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
            Open care plan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card>
          <SectionTitle title="Clinician context" />
          <p className="text-[12px] font-semibold text-slate-900">{treatmentTeam.doctor}</p>
          <p className="mt-0.5 text-xs text-slate-500">{treatmentTeam.role}</p>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            {brainHealth?.reviewedAt
              ? `Reviewed ${formatDate(brainHealth.reviewedAt)}. ${brainHealth.reviewedBy || treatmentTeam.doctor} considers this summary alongside your history and context.`
              : 'A clinician has not reviewed this monitoring summary yet.'}
          </p>
          <Link to="/patient/appointments" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
            View follow-up <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 31 — Assessment History
// ---------------------------------------------------------------------------
export const AssessmentHistoryPage: React.FC = () => {
  const { assessments, baseline, isLoading, error, refresh } = usePatientOverview();

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 31 · Assessment history"
        title="All previous sessions"
        description="Every completed screening, with completion status and access to its summary."
        actions={<Link to="/patient/assessment/intro" className={primaryButton}>New assessment</Link>}
      />

      {isLoading ? (
        <LoadingState label="Loading your sessions" detail="Fetching every completed screening." />
      ) : error && assessments.length === 0 ? (
        <ErrorState
          title="Your assessment history did not load"
          description="We could not reach your records. Nothing has been deleted — please try again."
          onRetry={refresh}
        />
      ) : assessments.length === 0 ? (
        <EmptyState
          scene="emptyAssessment"
          icon={ClipboardList}
          title="No assessment history"
          detail="Your completed sessions will be listed here."
          action={<Link to="/patient/assessment/intro" className={primaryButton}>Start your first screening</Link>}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Sessions</p>
              <p className="mt-1 text-[22px] font-semibold text-slate-900">{assessments.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Reviewed</p>
              <p className="mt-1 text-[22px] font-semibold text-slate-900">
                {assessments.filter((item) => item.reviewStatus === 'REVIEWED').length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Awaiting review</p>
              <p className="mt-1 text-[22px] font-semibold text-slate-900">
                {assessments.filter((item) => item.reviewStatus === 'PENDING_REVIEW').length}
              </p>
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-slate-500 md:grid">
              <span>Session</span><span>Date</span><span>Status</span><span>Vs baseline</span><span>Report</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {assessments.map((assessment) => {
                const change = baseline ? assessment.overallScore - baseline.overallScore : null;
                return (
                  <li key={assessment.id} className="grid gap-2 px-4 py-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] md:items-center md:gap-3">
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">Five-part screening</p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">{assessment.id}</p>
                    </div>
                    <p className="text-xs text-slate-600">{formatDate(assessment.date)}</p>
                    <div><AssessmentStatusPill reviewStatus={assessment.reviewStatus} status={assessment.status} /></div>
                    <p className="text-xs text-slate-600">
                      {change == null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(1)} pts`}
                    </p>
                    <Link to={`/patient/assessment/report?id=${assessment.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
                      <FileText className="h-3.5 w-3.5" /> View
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Link to="/patient/trends" className={secondaryButton}><TrendingUp className="h-4 w-4" /> Longitudinal trends</Link>
            <Link to="/patient/documents" className={secondaryButton}><FileText className="h-4 w-4" /> Reports & documents</Link>
          </div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 32 — Longitudinal Trends
// ---------------------------------------------------------------------------
export const LongitudinalTrendsPage: React.FC = () => {
  const { assessments, baseline, longitudinal } = usePatientOverview();

  const ordered = [...assessments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const valid = ordered.filter((item) => item.taskResponses?.quality?.comparable !== false);
  const canShowTrend = valid.length >= 3;

  const labelFor = (index: number) => formatDate(valid[index].date, { day: 'numeric', month: 'short' });

  const cognitive = valid.map((item, index) => ({ label: labelFor(index), value: Number(item.overallScore.toFixed(1)) }));
  const ocular = valid
    .filter((item) => item.eyeMetrics)
    .map((item) => ({ label: formatDate(item.date, { day: 'numeric', month: 'short' }), value: item.eyeMetrics!.fixationScore }));
  const vocal = valid
    .filter((item) => item.voiceMetrics)
    .map((item) => ({ label: formatDate(item.date, { day: 'numeric', month: 'short' }), value: item.voiceMetrics!.pauseScore }));
  const functional = valid
    .filter((item) => item.taskResponses?.task5?.trailBCompletionSec != null)
    .map((item) => ({
      label: formatDate(item.date, { day: 'numeric', month: 'short' }),
      value: item.taskResponses!.task5.trailBCompletionSec
    }));

  const trendDirection = longitudinal[longitudinal.length - 1]?.trendDirection;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 32 · Longitudinal trends"
        title="How things look over time"
        description="Trends are shown only where at least three comparable, quality-checked observations exist. Descriptive only — no clinical threshold is applied."
        actions={<Pill tone={canShowTrend ? 'green' : 'amber'} dot>{canShowTrend ? `${valid.length} comparable sessions` : 'More data needed'}</Pill>}
      />

      {!canShowTrend ? (
        <EmptyState
          scene="emptyAssessment"
          icon={LineChart}
          title="Not enough comparable sessions"
          detail="At least three valid sessions with matching task version, language, and accessibility conditions are needed before a trend is shown."
          action={<Link to="/patient/assessment/intro" className={primaryButton}>Complete a screening</Link>}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Sessions plotted</p>
              <p className="mt-1 text-[22px] font-semibold text-slate-900">{valid.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Direction</p>
              <p className="mt-1 text-[16px] font-semibold capitalize text-slate-900">{trendDirection?.toLowerCase() || 'Building'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Baseline</p>
              <p className="mt-1 text-[16px] font-semibold text-slate-900">{baseline ? `${Math.round(baseline.overallScore)}` : 'Not established'}</p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <SectionTitle title="Cognitive trend" detail="Exploratory composite across sessions." action={<Pill tone="blue">Composite</Pill>} />
              <TrendLine points={cognitive} min={Math.min(...cognitive.map((p) => p.value), baseline?.overallScore ?? 100) - 3} max={Math.max(...cognitive.map((p) => p.value), baseline?.overallScore ?? 0) + 3} />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {baseline ? `Your baseline of ${Math.round(baseline.overallScore)} is shown for reference, not as a target.` : 'A baseline is not established.'}
              </p>
            </Card>
            <Card>
              <SectionTitle title="Ocular trend" detail="Fixation observation across sessions." action={<Eye className="h-4 w-4 text-slate-400" />} />
              <TrendLine points={ocular} tone="#0D9488" />
              <p className="mt-2 text-xs leading-5 text-slate-500">Eye-movement observations are descriptive; lighting and device differences can affect them.</p>
            </Card>
            <Card>
              <SectionTitle title="Vocal trend" detail="Pause observation across sessions." action={<Waves className="h-4 w-4 text-slate-400" />} />
              <TrendLine points={vocal} tone="#7FA692" />
              <p className="mt-2 text-xs leading-5 text-slate-500">Microphone placement and background noise can affect acoustic observations.</p>
            </Card>
            <Card>
              <SectionTitle title="Functional trend" detail="Trail sequencing time (lower is faster)." action={<Activity className="h-4 w-4 text-slate-400" />} />
              <TrendLine points={functional} tone="#D97706" valueSuffix=" s" />
              <p className="mt-2 text-xs leading-5 text-slate-500">A slower session can reflect fatigue, distraction, or device familiarity rather than a change in ability.</p>
            </Card>
          </div>

          <Card>
            <SectionTitle title="Quality indicators across sessions" detail="Trend validity depends on these conditions." />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Comparable sessions', `${valid.length}`],
                ['Sessions withheld', `${ordered.length - valid.length}`],
                ['Quality-checked', 'Yes'],
                ['Clinical thresholds', 'Not applied']
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-[12px] font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 flex gap-1.5 text-xs leading-5 text-slate-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              These charts are not validated clinical trend lines and must not be used to infer diagnosis or treatment response.
            </p>
          </Card>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 33 — Change Detection Details
// ---------------------------------------------------------------------------
export const ChangeDetectionPage: React.FC = () => {
  const { changes, brainHealth } = usePatientOverview();
  const latest = changes[0];
  const status = statusCopy(latest?.status);
  const previous = changes[1];

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 33 · Change detection details"
        title="What changed, and how sure are we?"
        description="This view explains a monitoring prompt in plain language. It is a review aid, not a clinical finding."
        actions={<Pill tone={status.tone} dot>{status.label}</Pill>}
      />

      {!latest ? (
        <EmptyState
          scene="emptyAssessment"
          icon={Activity}
          title="No change checks yet"
          detail="After enough comparable assessments, NeuLens will summarise whether observations stayed within your recorded range."
        />
      ) : (
        <>
          <div className={`rounded-2xl border p-4 ${status.label === 'Review suggested' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.label === 'Review suggested' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {status.label === 'Review suggested' ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
              </span>
              <div>
                <h2 className="text-[15px] font-semibold text-slate-950">{status.label}: {status.detail}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Detected {formatDate(latest.detectedAt)}. A review prompt means the observations deserve a closer look with context — not that a condition is present.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
            <Card>
              <SectionTitle title="What changed" detail="Contributing observations and review reasons." />
              <dl>
                <InfoRow label="Cognitive change" value={latest.cognitiveChange == null ? 'Not available' : `${latest.cognitiveChange.toFixed(1)} points`} />
                <InfoRow label="Outside recorded range" value={latest.outsideBaseline ? 'Yes' : 'No'} />
                <InfoRow label="First detected" value={formatDate(latest.detectedAt)} />
                <InfoRow label="Persisted across checks" value={previous && previous.status === latest.status ? 'Yes — same status at previous check' : 'Not yet established'} />
                <InfoRow label="Contributed domains" value={(latest.reviewReasons || []).length ? `${(latest.reviewReasons || []).length} reason(s)` : 'None'} />
              </dl>
              {latest.reviewReasons?.length ? (
                <ul className="mt-3 space-y-2">
                  {latest.reviewReasons.map((reason) => (
                    <li key={reason} className="flex gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" /> {reasonLabel(reason)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>

            <div className="space-y-4">
              <Card>
                <SectionTitle title="Uncertainty & limitations" />
                <ul className="space-y-2 text-xs leading-5 text-slate-600">
                  <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Prototype thresholds are not validated clinical thresholds.</li>
                  <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Sleep, stress, medication timing, or a noisy environment can influence a session.</li>
                  <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />A single session outside range is not evidence of persistent change.</li>
                </ul>
              </Card>
              <Card>
                <SectionTitle title="Suggested next step" />
                <p className="text-xs leading-5 text-slate-600">
                  {brainHealth?.nextSteps?.[0] || 'Repeat the screening in a similar setting in about four weeks, and discuss any persistent concern with your clinician.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/patient/care-plan" className={primaryButton}>Open care plan</Link>
                  <Link to="/patient/appointments" className={secondaryButton}>Talk to my clinician</Link>
                </div>
              </Card>
            </div>
          </div>

          <Card>
            <SectionTitle title="Monitoring timeline" detail="Every change check on record." />
            <ol className="space-y-2.5">
              {changes.map((change) => {
                const copy = statusCopy(change.status);
                return (
                  <li key={change.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${change.status === 'REVIEW' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {change.status === 'REVIEW' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{copy.label}</p>
                        <p className="text-xs text-slate-500">{formatDate(change.detectedAt)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {change.cognitiveChange == null ? 'No numeric change' : `${change.cognitiveChange >= 0 ? '+' : ''}${change.cognitiveChange.toFixed(1)} points`}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </>
      )}
    </div>
  );
};
