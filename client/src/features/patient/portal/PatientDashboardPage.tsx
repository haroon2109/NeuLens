import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  Moon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { treatmentTeam, usePatientPortalStore } from '../../../store/patientPortalStore';
import { usePatientOverview } from './usePatientOverview';
import { ErrorState, LoadingState } from '../../../components/systemStates';
import { BrainHealthPathway, derivePathwayFromOverview } from '../../../components/BrainHealthPathway';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import {
  AssessmentStatusPill,
  Card,
  EmptyState,
  Pill,
  PortalPageHeader,
  ScoreDial,
  SectionTitle,
  StatCard,
  formatDate
} from './ui';

const contextLabel = (source: string) => {
  if (source === 'sleep') return 'Sleep';
  if (source === 'lifestyle_activity') return 'Activity';
  if (source === 'clinical_metabolic') return 'Clinical measurements';
  return source.replace(/_/g, ' ');
};

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, notifications, sleep, wellbeing } = usePatientPortalStore();
  const { assessments, latestAssessment, baseline, changes, brainHealth, context, isLoading, error, refresh } =
    usePatientOverview();

  const firstName = (user?.name || 'there').split(' ')[0];
  const nextAppointment = appointments.find((item) => item.status === 'UPCOMING' || item.status === 'RESCHEDULED');
  const latestChange = changes[0];
  const unread = notifications.filter((item) => !item.read).length;
  const recentAssessments = assessments.slice(0, 3);

  const monitoringStatus = brainHealth?.riskTier === 'LOW' ? 'Monitoring' : 'Review suggested';
  const pathway = derivePathwayFromOverview({ baseline, changes, brainHealth, assessments, context });
  const preventionSteps = (brainHealth?.nextSteps || []).filter((s: any) => s?.stage === 4 || s?.type === 'PERSONALIZED_PREVENTION' || s?.type === 'REVIEW_CONTEXT');
  const personalizedPrevention = preventionSteps.length ? { signals: undefined, note: preventionSteps.map((s: any) => s.action || s).filter(Boolean).join(' ') } : null;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Your brain-health home"
        title={`Good to see you, ${firstName}.`}
        description="Here is a calm overview of your screening history, personal baseline, and what comes next."
        actions={
          <Link
            to="/patient/assessment/intro"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-700 px-4 text-[12px] font-bold text-white transition hover:bg-blue-800"
          >
            <Sparkles className="h-4 w-4" /> Start assessment
          </Link>
        }
      />

      <MotionReveal>
        <section className="pp-card overflow-hidden p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={baseline ? 'forest' : 'amber'} dot>
                  {baseline ? 'Personal baseline active' : 'Baseline not yet established'}
                </Pill>
                {baseline && <Pill tone="sage">Established {formatDate(baseline.establishedAt)}</Pill>}
              </div>
              <h2 className="mt-3 text-[21px] font-semibold tracking-[-0.03em] text-ink">
                {latestAssessment
                  ? 'Your latest session has been submitted.'
                  : 'Your first screening is the next step.'}
              </h2>
              <p className="mt-1.5 text-[12px] leading-6 text-body">
                {latestAssessment
                  ? `${formatDate(latestAssessment.date)} · ${latestAssessment.reviewStatus === 'PENDING_REVIEW' ? 'Awaiting clinician review' : 'Reviewed by your care team'}. A clinician considers these observations alongside your history and context.`
                  : 'Complete a short five-part screening to establish your personal baseline. It takes about 10–15 minutes.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={latestAssessment ? '/patient/assessment/report' : '/patient/assessment/intro'}
                  className="pp-btn pp-btn-primary pp-btn-sm"
                >
                  {latestAssessment ? 'Read latest summary' : 'Begin assessment'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/patient/care-plan"
                  className="pp-btn pp-btn-secondary pp-btn-sm"
                >
                  See my care plan
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <HealthcareScene
                kind="patientHome"
                className="w-full max-w-[420px] lg:ml-auto"
                title="Elderly patient at home using a tablet with supportive care"
                animated={false}
              />
              <div className="grid min-w-[250px] grid-cols-2 gap-2.5">
                {[
                  { icon: Timer, label: 'Duration', value: '10–15 min' },
                  { icon: Stethoscope, label: 'Care team', value: 'Dr. Sarah Sharma' },
                  { icon: CalendarDays, label: 'Next visit', value: nextAppointment ? formatDate(nextAppointment.date, { day: 'numeric', month: 'short' }) : 'Not scheduled' },
                  { icon: Activity, label: 'Monitoring', value: monitoringStatus }
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-line bg-warm p-3">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-sage-deep">
                      <Icon className="h-3.5 w-3.5 text-sage-deep" aria-hidden="true" />
                      {label}
                    </span>
                    <p className="mt-1.5 text-[15px] font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <SectionTitle
              title="Upcoming follow-up"
              detail="Scheduled appointments and next steps."
              action={
                <Link to="/patient/appointments" className="text-[11px] font-bold text-forest hover:underline">
                  Follow-up &amp; appointments
                </Link>
              }
            />
            {nextAppointment ? (
              <div className="space-y-2">
                <div className="rounded-xl border border-mint bg-mint/50 p-3">
                  <p className="text-[12px] font-semibold text-ink">{formatDate(nextAppointment.date)}</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {(nextAppointment as any).type || (nextAppointment as any).reason || 'Follow-up appointment'} · {(nextAppointment as any).status || 'Scheduled'}
                  </p>
                </div>
                <p className="text-[11px] leading-5 text-muted">Appointments and follow-up actions are coordinated by your care team.</p>
              </div>
            ) : (
              <EmptyState
                scene="emptyAppointments"
                icon={CalendarDays}
                title="No upcoming follow-up scheduled"
                detail="Your clinician can arrange follow-up or a repeat assessment when needed."
                action={
                  <Link to="/patient/appointments" className="text-[11px] font-bold text-forest">
                    View appointments →
                  </Link>
                }
              />
            )}
          </Card>

          <Card>
            <SectionTitle
              title="Brain health timeline (summary)"
              detail="Recent recorded sessions over time."
              action={
                <Link to="/patient/timeline" className="text-[11px] font-bold text-forest hover:underline">
                  Open timeline
                </Link>
              }
            />
            {recentAssessments.length ? (
              <ol className="space-y-2">
                {recentAssessments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-warm/70 px-3 py-2">
                    <div>
                      <p className="text-[12px] font-semibold text-ink">{formatDate(a.date)}</p>
                      <p className="text-[11px] text-muted">Personal comparison over time · clinician review context</p>
                    </div>
                    <AssessmentStatusPill reviewStatus={a.reviewStatus} status={a.status} />
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState
                scene="emptyAssessment"
                icon={TrendingUp}
                title="No timeline yet"
                detail="Completed screenings will appear on your brain health timeline."
                action={
                  <Link to="/patient/assessment/intro" className="text-[11px] font-bold text-forest">
                    Start assessment →
                  </Link>
                }
              />
            )}
          </Card>
        </div>
      </MotionReveal>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Latest assessment"
          value={latestAssessment ? formatDate(latestAssessment.date, { day: 'numeric', month: 'short' }) : 'Not started'}
          detail={latestAssessment ? latestAssessment.reviewStatus.replace(/_/g, ' ').toLowerCase() : 'Begin with a guided session'}
          icon={ClipboardList}
          tone="forest"
        />
        <StatCard
          label="Personal baseline"
          value={baseline ? 'Established' : 'Pending'}
          detail={baseline ? 'Provisional until more sessions' : 'Requires a first completed screening'}
          icon={HeartPulse}
          tone="forestSoft"
        />
        <StatCard
          label="Monitoring status"
          value={latestChange?.status === 'REVIEW' ? 'Review' : latestChange?.status === 'NO_CHANGE' ? 'Stable' : 'Building'}
          detail={latestChange ? `Last checked ${formatDate(latestChange.detectedAt)}` : 'More sessions needed'}
          icon={TrendingUp}
          tone="mint"
        />
        <StatCard
          label="Unread updates"
          value={String(unread)}
          detail={unread ? 'From your care team' : 'You are up to date'}
          icon={FileText}
          tone="amber"
        />
      </div>      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle
            title="Your personal baseline"
            detail="A reference range from your own completed sessions — not a population norm."
            action={
              <Link to="/patient/assessment/baseline" className="text-[11px] font-bold text-forest hover:underline">
                View report
              </Link>
            }
          />
          {isLoading ? (
            <LoadingState label="Loading your baseline" detail="This usually takes a few seconds." rows={2} />
          ) : error && !baseline ? (
            <ErrorState
              title="Your baseline did not load"
              description="We could not reach your assessment history. Nothing has been lost — try again in a moment."
              onRetry={refresh}
            />
          ) : baseline ? (
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <ScoreDial value={baseline.overallScore} label="Baseline" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="amber" dot>Provisional baseline</Pill>
                  <span className="text-[11px] text-muted">{formatDate(baseline.establishedAt)}</span>
                </div>
                <dl className="mt-3 grid gap-x-5 gap-y-1 sm:grid-cols-2">
                  {[
                    ['Cognitive', baseline.cognitiveScore],
                    ['Functional', baseline.functionalScore],
                    ['Eye movement', baseline.eyeScore],
                    ['Voice', baseline.voiceScore],
                    ['Facial movement', baseline.faceScore],
                    ['Context', baseline.contextScore]
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex items-center justify-between border-b border-line py-1.5 last:border-0">
                      <dt className="text-[11px] text-muted">{label}</dt>
                      <dd className="text-[11px] font-semibold text-ink">{value == null ? '—' : `${value}`}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 rounded-lg bg-amber/10 border border-amber/60 px-3 py-2 text-[11px] leading-5 text-amber-900">
                  Provisional: repeatability and clinical validation are still being established. Treat this as a conversation aid.
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              scene="emptyAssessment"
              icon={Brain}
              title="No baseline yet"
              detail="Complete your first screening to create a provisional personal baseline."
              action={
                <Link to="/patient/assessment/intro" className="text-[11px] font-bold text-forest">
                  Start assessment →
                </Link>
              }
            />
          )}
        </Card>

        <Card>
          <SectionTitle
            title="Recent sessions"
            detail="Your monitoring timeline, most recent first."
            action={
              <Link to="/patient/history" className="text-[11px] font-bold text-forest hover:underline">
                All history
              </Link>
            }
          />
          {recentAssessments.length ? (
            <ol className="relative space-y-3 border-l border-line pl-4">
              {recentAssessments.map((assessment) => (
                <li key={assessment.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-forest" />
                  <div className="rounded-xl border border-line bg-warm/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-ink">{formatDate(assessment.date)}</span>
                      <AssessmentStatusPill reviewStatus={assessment.reviewStatus} status={assessment.status} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      Five-part screening · personal comparison {assessment.reviewStatus === 'REVIEWED' ? 'reviewed' : 'available after review'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState scene="emptyAssessment" icon={ClipboardList} title="No sessions yet" detail="Your completed screenings will appear here." />
          )}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <SectionTitle
            title="Health context"
            detail="What may be shaping this month's observations."
            action={
              <Link to="/patient/context" className="text-[11px] font-bold text-forest hover:underline">
                Review
              </Link>
            }
          />
          <div className="space-y-2.5">
            {[
              { icon: Moon, label: 'Sleep last night', detail: `${sleep.durationHours} hours · quality ${sleep.quality}/5`, chip: 'mint' },
              { icon: Activity, label: 'Activity', detail: `${sleep.steps.toLocaleString()} steps · ${sleep.activeMinutes} active minutes`, chip: 'forestSoft' },
              { icon: Users, label: 'Wellbeing', detail: `Mood ${wellbeing.mood}/5 · stress ${wellbeing.stress}/5`, chip: 'amber' }
            ].map(({ icon: Icon, label, detail, chip }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-line p-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${chip === 'mint' ? 'border-mint bg-mint' : chip === 'forestSoft' ? 'border-line bg-white' : 'border-amber/60 bg-amber/10'}`}>
                  <Icon className="h-4 w-4 text-forest" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-ink">{label}</p>
                  <p className="text-[11px] text-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
          {context.length > 0 && (
            <p className="mt-2.5 text-[11px] text-muted">
              {context.length} context source{context.length === 1 ? '' : 's'} linked · last updated {formatDate(context[0].recordedAt)}
            </p>
          )}
        </Card>

        <Card>
          <SectionTitle title="Your care team" detail="Clinician-led review and follow-up." />
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold text-forest shadow-xs">SS</span>
            <div>
              <p className="text-[12px] font-semibold text-ink">{treatmentTeam.doctor}</p>
              <p className="text-[11px] text-muted">{treatmentTeam.role}</p>
              <p className="mt-0.5 text-[11px] text-muted">{treatmentTeam.department} · {treatmentTeam.institution}</p>
            </div>
          </div>
          <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[11px]">
            <div className="flex justify-between gap-3"><dt className="text-muted">Next review</dt><dd className="font-semibold text-ink">{treatmentTeam.nextReview}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Clinic</dt><dd className="font-semibold text-ink">Block B · Suite 400</dd></div>
          </dl>
          <Link to="/patient/appointments" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-forest hover:underline">
            View appointments <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Card>

        <Card className="rounded-2xl border border-line bg-forest text-white shadow-[0_24px_70px_-48px_rgba(27,51,43,0.28),0_2px_8px_rgba(27,51,43,0.035)]">
          <Pill tone="mint">Not a diagnosis</Pill>
          <h2 className="mt-3 text-[16px] font-semibold tracking-[-0.02em] text-white">A clearer view, together.</h2>
          <p className="mt-2 text-[11px] leading-5 text-white/80">
            NeuLens identifies changes that may warrant further assessment. Only your qualified clinician can interpret results and confirm next steps.
          </p>
          <Link
            to="/patient/help"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/20"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Privacy and support
          </Link>
        </Card>
      </div>
      <BrainHealthPathway
        pathway={pathway}
        personalizedPrevention={personalizedPrevention}
        compact
      />
    </div>
  );
};

export default PatientDashboardPage;
