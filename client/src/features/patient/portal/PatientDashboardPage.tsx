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

      <MotionReveal><section className="overflow-hidden rounded-2xl border border-[#DFF3EA] bg-[#F4FBF8] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={baseline ? 'blue' : 'amber'} dot>{baseline ? 'Personal baseline active' : 'Baseline not yet established'}</Pill>
              {baseline && <Pill tone="slate">Established {formatDate(baseline.establishedAt)}</Pill>}
            </div>
            <h2 className="mt-3 text-[21px] font-semibold tracking-[-0.03em] text-slate-950">
              {latestAssessment
                ? 'Your latest session has been submitted.'
                : 'Your first screening is the next step.'}
            </h2>
            <p className="mt-1.5 text-[12px] leading-6 text-slate-600">
              {latestAssessment
                ? `${formatDate(latestAssessment.date)} · ${latestAssessment.reviewStatus === 'PENDING_REVIEW' ? 'Awaiting clinician review' : 'Reviewed by your care team'}. A clinician considers these observations alongside your history and context.`
                : 'Complete a short five-part screening to establish your personal baseline. It takes about 10–15 minutes.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={latestAssessment ? '/patient/assessment/report' : '/patient/assessment/intro'}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-[12px] font-bold text-blue-800 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
              >
                {latestAssessment ? 'Read latest summary' : 'Begin assessment'} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/patient/care-plan"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-slate-700 transition hover:bg-white/70"
              >
                See my care plan
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <HealthcareScene kind="patientHome" className="w-full max-w-[420px] lg:ml-auto" title="Elderly patient at home using a tablet with supportive care" />
            <div className="grid min-w-[250px] grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white bg-white/85 p-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <Timer className="h-3.5 w-3.5" /> Duration
                </span>
                <p className="mt-1.5 text-[16px] font-semibold text-slate-900">10–15 min</p>
              </div>
              <div className="rounded-xl border border-white bg-white/85 p-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <Stethoscope className="h-3.5 w-3.5" /> Care team
                </span>
                <p className="mt-1.5 text-[12px] font-semibold text-slate-900">Dr. Sarah Sharma</p>
              </div>
              <div className="rounded-xl border border-white bg-white/85 p-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" /> Next visit
                </span>
                <p className="mt-1.5 text-[12px] font-semibold text-slate-900">
                  {nextAppointment ? formatDate(nextAppointment.date, { day: 'numeric', month: 'short' }) : 'Not scheduled'}
                </p>
              </div>
              <div className="rounded-xl border border-white bg-white/85 p-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <Activity className="h-3.5 w-3.5" /> Monitoring
                </span>
                <p className="mt-1.5 text-[12px] font-semibold text-slate-900">{monitoringStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </section></MotionReveal>

      <MotionReveal>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <SectionTitle title="Upcoming follow-up" detail="Scheduled appointments and next steps." action={<Link to="/patient/appointments" className="text-xs font-bold text-[#2F5E4E] hover:underline">Follow-up & appointments</Link>} />
            {nextAppointment ? (
              <div className="space-y-2">
                <div className="rounded-xl border border-[#DFF3EA] bg-[#F7FBF8] p-3">
                  <p className="text-[12px] font-semibold text-slate-900">{formatDate(nextAppointment.date)}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{(nextAppointment as any).type || (nextAppointment as any).reason || 'Follow-up appointment'} · {(nextAppointment as any).status || 'Scheduled'}</p>
                </div>
                <p className="text-xs leading-5 text-slate-500">Appointments and follow-up actions are coordinated by your care team.</p>
              </div>
            ) : (
              <EmptyState scene="emptyAppointments" icon={CalendarDays} title="No upcoming follow-up scheduled" detail="Your clinician can arrange follow-up or a repeat assessment when needed." action={<Link to="/patient/appointments" className="text-[12px] font-bold text-[#2F5E4E]">View appointments →</Link>} />
            )}
          </Card>
          <Card>
            <SectionTitle title="Brain health timeline (summary)" detail="Recent recorded sessions over time." action={<Link to="/patient/timeline" className="text-xs font-bold text-[#2F5E4E] hover:underline">Open timeline</Link>} />
            {recentAssessments.length ? (
              <ol className="space-y-2">
                {recentAssessments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2">
                    <div>
                      <p className="text-[12px] font-semibold text-slate-800">{formatDate(a.date)}</p>
                      <p className="text-xs text-slate-500">Personal comparison over time · clinician review context</p>
                    </div>
                    <AssessmentStatusPill reviewStatus={a.reviewStatus} status={a.status} />
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState scene="emptyAssessment" icon={TrendingUp} title="No timeline yet" detail="Completed screenings will appear on your brain health timeline." action={<Link to="/patient/assessment/intro" className="text-[12px] font-bold text-[#2F5E4E]">Start assessment →</Link>} />
            )}
          </Card>
        </div>
      </MotionReveal>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Latest assessment"
          value={latestAssessment ? formatDate(latestAssessment.date, { day: 'numeric', month: 'short' }) : 'Not started'}
          detail={latestAssessment ? `${latestAssessment.reviewStatus.replace(/_/g, ' ').toLowerCase()}` : 'Begin with a guided session'}
          icon={ClipboardList}
          tone="blue"
        />
        <StatCard
          label="Personal baseline"
          value={baseline ? 'Established' : 'Pending'}
          detail={baseline ? 'Provisional until more sessions' : 'Requires a first completed screening'}
          icon={HeartPulse}
          tone="green"
        />
        <StatCard
          label="Monitoring status"
          value={latestChange?.status === 'REVIEW' ? 'Review' : latestChange?.status === 'NO_CHANGE' ? 'Stable' : 'Building'}
          detail={latestChange ? `Last checked ${formatDate(latestChange.detectedAt)}` : 'More sessions needed'}
          icon={TrendingUp}
          tone="violet"
        />
        <StatCard
          label="Unread updates"
          value={String(unread)}
          detail={unread ? 'From your care team' : 'You are up to date'}
          icon={FileText}
          tone="amber"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle
            title="Your personal baseline"
            detail="A reference range from your own completed sessions — not a population norm."
            action={
              <Link to="/patient/assessment/baseline" className="text-xs font-bold text-blue-700 hover:underline">
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
                  <span className="text-xs text-slate-500">{formatDate(baseline.establishedAt)}</span>
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
                    <div key={String(label)} className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-0">
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="text-xs font-semibold text-slate-800">{value == null ? '—' : `${value}`}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
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
                <Link to="/patient/assessment/intro" className="text-[12px] font-bold text-blue-700">
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
              <Link to="/patient/history" className="text-xs font-bold text-blue-700 hover:underline">
                All history
              </Link>
            }
          />
          {recentAssessments.length ? (
            <ol className="relative space-y-3 border-l border-slate-200 pl-4">
              {recentAssessments.map((assessment) => (
                <li key={assessment.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-slate-800">{formatDate(assessment.date)}</span>
                      <AssessmentStatusPill reviewStatus={assessment.reviewStatus} status={assessment.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
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
              <Link to="/patient/context" className="text-xs font-bold text-blue-700 hover:underline">
                Review
              </Link>
            }
          />
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700"><Moon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">Sleep last night</p>
                <p className="text-xs text-slate-500">{sleep.durationHours} hours · quality {sleep.quality}/5</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Activity className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">Activity</p>
                <p className="text-xs text-slate-500">{sleep.steps.toLocaleString()} steps · {sleep.activeMinutes} active minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Users className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">Wellbeing</p>
                <p className="text-xs text-slate-500">Mood {wellbeing.mood}/5 · stress {wellbeing.stress}/5</p>
              </div>
            </div>
          </div>
          {context.length > 0 && (
            <p className="mt-2.5 text-xs text-slate-500">
              {context.length} context source{context.length === 1 ? '' : 's'} linked · last updated {formatDate(context[0].recordedAt)}
            </p>
          )}
        </Card>

        <Card>
          <SectionTitle title="Your care team" detail="Clinician-led review and follow-up." />
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[13px] font-bold text-blue-800">SS</span>
            <div>
              <p className="text-[12px] font-semibold text-slate-900">{treatmentTeam.doctor}</p>
              <p className="text-xs text-slate-500">{treatmentTeam.role}</p>
              <p className="mt-0.5 text-xs text-slate-500">{treatmentTeam.department} · {treatmentTeam.institution}</p>
            </div>
          </div>
          <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Next review</dt><dd className="font-semibold text-slate-800">{treatmentTeam.nextReview}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Clinic</dt><dd className="font-semibold text-slate-800">Block B · Suite 400</dd></div>
          </dl>
          <Link to="/patient/appointments" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
            View appointments <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card className="bg-slate-900 text-white">
          <Pill tone="slate">Not a diagnosis</Pill>
          <h2 className="mt-3 text-[16px] font-semibold tracking-[-0.02em]">A clearer view, together.</h2>
          <p className="mt-2 text-xs leading-5 text-white/70">
            NeuLens identifies changes that may warrant further assessment. Only your qualified clinician can interpret results and confirm next steps.
          </p>
          <Link
            to="/patient/help"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Privacy and support
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
