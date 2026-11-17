import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  Info,
  LineChart,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { treatmentTeam, usePatientPortalStore } from '../../../store/patientPortalStore';
import { usePatientOverview } from './usePatientOverview';
import { BrainHealthPathway, derivePathwayFromOverview } from '../../../components/BrainHealthPathway';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import {
  Card,
  EmptyState,
  InfoRow,
  Pill,
  PortalPageHeader,
  ScoreDial,
  SectionTitle,
  formatDate,
  primaryButton,
  secondaryButton
} from './ui';

const labelClass = 'mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-sage-deep';

const activityLabels: Record<string, string> = {
  appointments: 'Remembering appointments',
  medication: 'Managing medicines',
  finances: 'Handling money or bills',
  household: 'Household tasks',
  shopping: 'Shopping or errands',
  transport: 'Getting around / transport',
  cooking: 'Preparing meals',
  communication: 'Communication / phone use'
};

const responseLabel = (value: any) => {
  if (value == null || value === '') return 'Not recorded';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
  if (typeof value === 'number') return String(value);
  return 'Recorded';
};

export const PatientHealthProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const store = usePatientPortalStore() as any;
  const { health = {}, sleep = {}, wellbeing = {} } = store;
  const contextLog = store.contextLog || store.contextEntries || [];
  const { context } = usePatientOverview();
  const hasContext = (Array.isArray(contextLog) && contextLog.length > 0) || Object.values(sleep || {}).some(Boolean) || Object.values(wellbeing || {}).some(Boolean) || Boolean(health?.conditions || health?.medications || health?.familyHistory);

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Patient portal · Health profile & context"
        title="Health Profile & Context"
        description="Physical health, sleep, lifestyle, mood, clinical/family history, and caregiver/support information recorded for clinical context. Missing information stays missing."
        actions={<Link to="/patient/context/clinical" className={secondaryButton}><Stethoscope className="h-4 w-4" /> Edit history</Link>}
      />

      <MotionReveal><HealthcareScene kind="profile" className="w-full max-w-3xl" /></MotionReveal>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Personal & care profile" detail="Recorded identity and support details." />
          <dl>
            <InfoRow label="Name" value={user?.name || 'Not recorded'} />
            <InfoRow label="Patient ID" value={user?.patientId || 'Not recorded'} />
            <InfoRow label="Primary clinician" value={treatmentTeam.doctor} />
            <InfoRow label="Care team role" value={treatmentTeam.role} />
            <InfoRow label="Caregiver / support" value={health?.caregiverName || health?.caregiver || health?.supportContact || 'Not recorded'} />
          </dl>
          <p className="mt-3 text-[13px] leading-5 text-muted">Caregiver/support details are context for discussion and are not diagnostic.</p>
        </Card>

        <Card>
          <SectionTitle title="Physical health & history" />
          <dl>
            <InfoRow label="Conditions" value={health?.conditions || 'Not recorded'} />
            <InfoRow label="Medications" value={health?.medications || 'Not recorded'} />
            <InfoRow label="Family history" value={health?.familyHistory || 'Not recorded'} />
            <InfoRow label="Previous assessments" value={health?.previousAssessments || 'Not recorded'} />
            <InfoRow label="Context entries (recorded)" value={String(context?.entries?.length ?? contextLog.length ?? 0)} />
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/patient/context/clinical" className={secondaryButton}>Clinical & family</Link>
            <Link to="/patient/profile" className={secondaryButton}>My profile</Link>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Sleep & lifestyle (recorded)" />
          <dl>
            {Object.keys(sleep || {}).length ? Object.entries(sleep).slice(0, 8).map(([k, v]) => (
              <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')} value={v == null || v === '' ? 'Not recorded' : String(v)} />
            )) : <InfoRow label="Status" value="Not recorded" />}
          </dl>
          <Link to="/patient/context/sleep" className={`${secondaryButton} mt-3`}>View / update sleep & lifestyle</Link>
        </Card>

        <Card>
          <SectionTitle title="Mood & wellbeing (recorded)" />
          <dl>
            {Object.keys(wellbeing || {}).length ? Object.entries(wellbeing).slice(0, 8).map(([k, v]) => (
              <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')} value={v == null || v === '' ? 'Not recorded' : String(v)} />
            )) : <InfoRow label="Status" value="Not recorded" />}
          </dl>
          <Link to="/patient/context/wellbeing" className={`${secondaryButton} mt-3`}>View / update wellbeing</Link>
        </Card>
      </div>

      {!hasContext && (
        <div className="rounded-xl border border-amber/60 bg-amber\/10 p-3.5 text-[13px] leading-5 text-amber-900 flex gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>Limited context recorded so far. Adding sleep, lifestyle, mood, or health history can help your clinician interpret observations; it does not change screening scores.</span>
        </div>
      )}
    </div>
  );
};

export const DailyFunctionQuestionnairePage: React.FC = () => {
  const { assessments, latestAssessment } = usePatientOverview();
  const latestFunctional = (latestAssessment?.taskResponses as any)?.functionalCheckIn || (latestAssessment?.taskResponses as any)?.functionalAssessment || (latestAssessment?.taskResponses as any)?.dailyFunction;

  const entries = latestFunctional?.activities && typeof latestFunctional.activities === 'object'
    ? Object.entries(latestFunctional.activities)
    : latestFunctional && typeof latestFunctional === 'object' && !Array.isArray(latestFunctional)
      ? Object.entries(latestFunctional).filter(([k]) => !['completedAt', 'skipped', 'note'].includes(k))
      : [];

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Patient portal · Daily function questionnaire"
        title="Daily Function Questionnaire"
        description="Everyday activities and independence, as recorded in check-ins. These responses support clinical discussion and are not independently diagnostic."
        actions={<Link to="/patient/assessment/intro" className={primaryButton}><Sparkles className="h-4 w-4" /> Complete check-in in assessment</Link>}
      />

      <MotionReveal><HealthcareScene kind="functional" className="w-full max-w-3xl" /></MotionReveal>
      <div className="rounded-xl border border-forest/40 bg-mint/50 p-3.5 text-[13px] leading-5 text-forest/90 flex gap-2">
        <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Do not treat these responses as independently diagnostic. A clinician interprets them together with history, context, and observations over time.</span>
      </div>

      <Card>
        <SectionTitle title="Most recent recorded check-in" detail={latestAssessment ? `From assessment ${formatDate(latestAssessment.date)}` : 'No recorded assessment yet'} />
        {latestFunctional?.skipped ? (
          <p className="text-[14px] text-muted">The daily function check-in was skipped in the latest recorded session.</p>
        ) : entries.length ? (
          <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-start justify-between border-b border-line py-2 gap-3">
                <dt className="text-[14px] text-muted">{activityLabels[key] || key.replace(/_/g, ' ')}</dt>
                <dd className="text-[14px] font-semibold text-ink text-right">{responseLabel(value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <EmptyState
            scene="emptyAssessment"
            icon={ClipboardList}
            title="No daily function responses recorded yet"
            detail="Complete the functional check-in during a screening session to record everyday activities and independence here."
            action={<Link to="/patient/assessment/intro" className={primaryButton}>Start assessment</Link>}
          />
        )}
      </Card>

      <Card>
        <SectionTitle title="Recorded sessions with functional data" detail={`${assessments.length} assessment(s) in history (recorded only).`} />
        {assessments.length ? (
          <ul className="divide-y divide-line">
            {assessments.slice(0, 8).map((a: any) => {
              const fc = a?.taskResponses?.functionalCheckIn || a?.taskResponses?.functionalAssessment || a?.taskResponses?.dailyFunction;
              const has = fc && !fc.skipped && typeof fc === 'object';
              return (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{formatDate(a.date)}</p>
                    <p className="text-[13px] text-muted">{has ? 'Daily function responses recorded' : 'Not recorded / skipped in this session'}</p>
                  </div>
                  <Pill tone={has ? 'forestSoft' : 'sage'}>{has ? 'Recorded' : 'Missing'}</Pill>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-muted">No assessment history yet.</p>
        )}
      </Card>
    </div>
  );
};

export const BrainHealthTimelinePage: React.FC = () => {
  const { assessments, baseline, changes, brainHealth } = usePatientOverview();
  const pathway = derivePathwayFromOverview({ baseline, changes, brainHealth, assessments } as any);

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Patient portal · Brain health timeline"
        title="Brain Health Timeline"
        description="Previous assessments and recorded changes over time, compared within your own history when quality/comparability allows. Not a diagnosis."
        actions={
          <div className="flex gap-2">
            <Link to="/patient/history" className={secondaryButton}><ClipboardList className="h-4 w-4" /> History</Link>
            <Link to="/patient/trends" className={secondaryButton}><LineChart className="h-4 w-4" /> Trends</Link>
          </div>
        }
      />

      <MotionReveal><HealthcareScene kind="timeline" className="w-full max-w-3xl" /></MotionReveal>
      <Card>
        <SectionTitle title="Monitoring pathway" detail="Recorded pathway status (deterministic, clinician-in-the-loop)." />
        <BrainHealthPathway pathway={pathway} personalizedPrevention={null} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle title="Timeline of assessments" detail="Most recent first. Only recorded sessions are shown." />
          {assessments.length ? (
            <ol className="relative border-s border-line/80 ms-2 space-y-4 ps-4">
              {assessments.slice(0, 12).map((a: any, idx: number) => (
                <li key={a.id} className="relative">
                  <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${idx === 0 ? 'bg-forest' : 'bg-line-strong'}`} />
                  <p className="text-[14px] font-semibold text-ink">{formatDate(a.date)} <span className="font-normal text-muted">· {a.assessmentType || 'Screening'}</span></p>
                  <p className="text-[13px] text-muted">Overall: {a.overallScore != null ? `${Math.round(a.overallScore)} / 100` : '—'} · {a.reviewStatus?.replace(/_/g, ' ').toLowerCase() || 'status not recorded'}</p>
                  {baseline && idx === assessments.length - 1 && <p className="text-[13px] text-forest mt-0.5">Baseline reference context available</p>}
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState scene="emptyAssessment" icon={Activity} title="No assessments yet" detail="Your timeline will appear after your first completed screening." action={<Link to="/patient/assessment/intro" className={primaryButton}>Start assessment</Link>} />
          )}
        </Card>

        <Card>
          <SectionTitle title="Recorded change summaries" detail="Within-person change cues (not diagnoses). Poor quality does not mean decline." />
          {changes.length ? (
            <ul className="space-y-2">
              {changes.slice(0, 8).map((c: any, i: number) => (
                <li key={c.id || i} className="rounded-xl border border-line bg-warm/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-ink">{formatDate(c.detectedAt || c.createdAt || c.date)}</p>
                    <Pill tone={c.status === 'REVIEW' ? 'amber' : c.status === 'NO_CHANGE' ? 'forestSoft' : 'sage'}>{c.status || 'Recorded'}</Pill>
                  </div>
                  <p className="mt-1 text-[13px] leading-5 text-muted">
                    {Array.isArray(c.reasons) && c.reasons.length ? c.reasons.map((r: string) => r.replace(/_/g, ' ').toLowerCase()).join(', ') : (c.summary || 'No reason details recorded.')}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] leading-5 text-muted">No change summaries recorded yet. Change is interpreted only across comparable, quality-acceptable sessions.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export const PersonalizedPreventionPlanPage: React.FC = () => {
  const { baseline, changes, brainHealth, assessments, context } = usePatientOverview();
  const { carePlan } = usePatientPortalStore();
  const pathway = derivePathwayFromOverview({ baseline, changes, brainHealth, assessments, context } as any);

  const nextSteps = (brainHealth?.nextSteps || []) as any[];
  const prevention = nextSteps.filter((s) => s?.stage === 4 || s?.type === 'PERSONALIZED_PREVENTION' || s?.type === 'REVIEW_CONTEXT' || s?.type === 'LIFESTYLE_SUPPORT');
  const general = nextSteps.filter((s) => !prevention.includes(s));

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Patient portal · Personalized prevention plan"
        title="Personalized Prevention Plan"
        description="Clinician-approved, evidence-informed supportive suggestions based on recorded inputs. Not a diagnosis and not autonomous treatment."
        actions={<Link to="/patient/care-plan" className={secondaryButton}><ShieldCheck className="h-4 w-4" /> Care plan</Link>}
      />

      <MotionReveal><HealthcareScene kind="prevention" className="w-full max-w-3xl" /></MotionReveal>
      <div className="rounded-xl border border-amber/60 bg-amber\/10 p-3.5 text-[13px] leading-5 text-amber-900 flex gap-2">
        <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Suggestions are supportive and for clinician discussion/approval. They are derived only from recorded task/context/functional inputs (no invented data) and never constitute a prescription or inferred disease.</span>
      </div>

      <Card>
        <SectionTitle title="Recorded prevention/support signals" detail="From available monitoring and context (recorded only)." />
        <BrainHealthPathway pathway={pathway} personalizedPrevention={prevention.length ? { note: 'See recorded next steps below.' } : null} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Clinician-guided next steps (recorded)" />
          {prevention.length || general.length ? (
            <ul className="space-y-2">
              {[...prevention, ...general].map((step: any, i: number) => (
                <li key={step.id || i} className="flex gap-2 rounded-xl border border-line bg-warm/70 p-3">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${step.done ? 'text-forest' : 'text-muted'}`} aria-hidden="true" />
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{step.action || step.title || step.type || 'Recorded step'}</p>
                    <p className="text-[13px] text-muted mt-0.5">{step.reason || step.detail || 'Supportive/monitoring step recorded for discussion.'}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] leading-5 text-muted">No personalized prevention/support steps recorded yet. Complete assessments and context, then review with your clinician.</p>
          )}
        </Card>

        <Card>
          <SectionTitle title="Care plan & follow-up" detail="Your clinician-approved plan and schedule." />
          <dl className="mb-3">
            <InfoRow label="Next review" value={carePlan?.nextReview ? formatDate(carePlan.nextReview) : 'Not scheduled'} />
            <InfoRow label="Plan items" value={String(carePlan?.steps?.length ?? 0)} />
          </dl>
          {carePlan?.steps?.length ? (
            <ul className="space-y-2 mb-3">
              {carePlan.steps.slice(0, 4).map((s: any) => (
                <li key={s.id} className="flex gap-2 text-[13px] text-muted"><CheckCircle2 className={`h-4 w-4 shrink-0 ${s.done ? 'text-forest' : 'text-muted'}`} aria-hidden="true" />{s.title}</li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Link to="/patient/care-plan" className={secondaryButton}>Open care plan</Link>
            <Link to="/patient/appointments" className={secondaryButton}><CalendarClock className="h-4 w-4" /> Follow-up & appointments</Link>
          </div>
        </Card>
      </div>

      <p className="text-[13px] text-muted">Sources: recorded assessments, context, and clinician-entered plan data only. No synthetic or invented data.</p>
    </div>
  );
};
