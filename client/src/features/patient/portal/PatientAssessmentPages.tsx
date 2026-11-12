import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  AudioLines,
  Brain,
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  FileText,
  Fingerprint,
  Info,
  Languages,
  ListChecks,
  Mic,
  MonitorPlay,
  PauseCircle,
  Play,
  Printer,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  Volume2,
  Waves
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PatientAssessmentRecord } from '../../../services/patientPortalApi';
import { usePatientPortalStore } from '../../../store/patientPortalStore';
import { usePatientOverview } from './usePatientOverview';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import {
  AssessmentStatusPill,
  Card,
  EmptyState,
  InfoRow,
  Pill,
  PortalPageHeader,
  ScoreDial,
  SectionTitle,
  formatDate,
  formatDateTime
} from './ui';

const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-[12px] font-bold text-white shadow-sm transition hover:bg-blue-800';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50';

const getQuality = (assessment: PatientAssessmentRecord | null) => {
  const stored = assessment?.taskResponses?.quality || {};
  return {
    audio: stored.audio || 'ADEQUATE',
    video: stored.video || 'ADEQUATE',
    completion: stored.completion || 'FULL',
    comprehension: stored.comprehension || 'CLEAR',
    interruptions: typeof stored.interruptions === 'number' ? stored.interruptions : 0,
    comparable: stored.comparable !== false
  };
};

const qualityLabel = (value: string) => {
  if (value === 'GOOD') return 'Good';
  if (value === 'ADEQUATE') return 'Adequate';
  if (value === 'POOR') return 'Limited';
  if (value === 'FULL') return 'All tasks completed';
  if (value === 'CLEAR') return 'Instructions understood';
  return value.replace(/_/g, ' ').toLowerCase();
};

const domainObservations = (assessment: PatientAssessmentRecord) => {
  const tasks = assessment.taskResponses || {};
  const task2 = tasks.task2 || {};
  const task3 = tasks.task3 || {};
  const task5 = tasks.task5 || {};

  return [
    {
      label: 'Memory & attention',
      detail:
        task2.matchedPairs != null
          ? `${task2.matchedPairs} pairs matched with ${task2.mismatches ?? 0} mismatches in the pattern activity.`
          : 'The memory and attention activity was completed this session.'
    },
    {
      label: 'Eye movement',
      detail: assessment.eyeMetrics
        ? `Average response timing of ${Math.round(assessment.eyeMetrics.reactionTime)} ms was recorded during the visual activity.`
        : 'The visual activity was completed; detailed timing was not available.'
    },
    {
      label: 'Voice & speech',
      detail: assessment.voiceMetrics
        ? `Speech was recorded at about ${Math.round(assessment.voiceMetrics.speechRate)} words per minute.`
        : 'The voice activity was completed; detailed acoustic measures were not available.'
    },
    {
      label: 'Facial movement',
      detail: assessment.faceMetrics
        ? 'Facial movement activity was captured and processed into derived observations.'
        : 'Facial movement activity finished without stored derived measures.'
    },
    {
      label: 'Functional & executive',
      detail:
        task5.trailBCompletionSec != null
          ? `The sequencing activity took ${task5.trailBCompletionSec} seconds with ${task5.sequencingErrors ?? 0} ordering errors.`
          : 'The functional sequencing activity was completed this session.'
    }
  ];
};

// ---------------------------------------------------------------------------
// Screen 21 — Assessment Introduction
// ---------------------------------------------------------------------------
const sessionSteps: Array<{ icon: LucideIcon; title: string; detail: string; minutes: string; path: string }> = [
  {
    icon: Fingerprint,
    title: 'Cognitive activities',
    detail: 'Memory, attention, orientation, language, and executive sequencing.',
    minutes: '~6 min',
    path: '/patient/assessment/cognitive'
  },
  {
    icon: Eye,
    title: 'Ocular activity',
    detail: 'Camera positioning, calibration, and guided visual tasks.',
    minutes: '~2 min',
    path: '/patient/assessment/ocular'
  },
  {
    icon: AudioLines,
    title: 'Vocal activity',
    detail: 'Microphone check, guided speech, and a short reading response.',
    minutes: '~3 min',
    path: '/patient/assessment/vocal'
  },
  {
    icon: ScanFace,
    title: 'Facial movement',
    detail: 'A guided interaction observing selected facial movement patterns.',
    minutes: '~2 min',
    path: '/patient/assessment/facial'
  }
];

export const AssessmentIntroductionPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 21 · Assessment introduction"
        title="Your screening session"
        description="A short set of guided activities. We explain what to expect before anything starts, and you stay in control throughout."
        actions={<Pill tone="blue" dot>About 10–15 minutes</Pill>}
      />

      <MotionReveal className="mx-auto w-full max-w-2xl">
        <HealthcareScene
          kind="assessmentIntro"
          className="w-full"
          title="Margaret sitting comfortably in a quiet room before her assessment"
        />
      </MotionReveal>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle title="Purpose of this assessment" detail="What we are trying to understand." />
          <p className="text-[12px] leading-6 text-slate-600">
            This session records several different observations — task responses, eye movement, voice, and facial movement — so your care team can consider them together over time. It is a screening support tool, not a diagnostic test.
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {[
              { icon: Eye, title: 'Follow visual prompts', detail: 'Watch the screen and respond when asked.' },
              { icon: Mic, title: 'Speak clearly', detail: 'Repeat a phrase and read a short passage.' },
              { icon: ScanFace, title: 'Relax your face', detail: 'A short friendly expression activity.' },
              { icon: Fingerprint, title: 'Tap to respond', detail: 'Simple memory and sequencing tasks.' }
            ].map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-slate-800">{title}</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">{detail}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <PauseCircle className="h-4 w-4" /> Pause and exit are always available
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-900/80">
              You can pause between activities, skip an activity, or stop entirely. A partly completed session may not support comparison with previous sessions.
            </p>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Required environment" detail="A quiet space helps quality." />
          <ul className="space-y-2.5">
            {[
              'Sit comfortably with your face visible to the camera.',
              'Find a quiet place with limited background noise.',
              'Use a stable internet connection and a charged device.',
              'Keep the screen at a comfortable distance.',
              'Have your glasses or hearing aids if you normally use them.'
            ].map((item) => (
              <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Info className="h-3.5 w-3.5" /> Accessibility
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-900/80">
              Your language, text size, contrast, and audio preferences are already applied. You can change them from Account Settings.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="What happens in this session" detail="One continuous session, four stages." />
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sessionSteps.map(({ icon: Icon, title, detail, minutes, path }, index) => (
            <li key={title} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="mt-3 text-[12px] font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs leading-4 text-slate-500">{detail}</p>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{minutes}</span>
                <Link to={path} className="text-xs font-bold text-blue-700 hover:underline">Preview</Link>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Camera and microphone are used only during the session. Raw recordings are not included in your portal reports.
          </p>
          <Link to="/patient/assessment" className={primaryButton}>
            <Play className="h-4 w-4" /> Begin guided session
          </Link>
        </div>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screens 22–25 — Assessment stages
// ---------------------------------------------------------------------------
type StageDefinition = {
  screen: string;
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  description: string;
  tasks: string[];
  observations: string[];
  equipment: string[];
  quality: string[];
  exploratoryNote?: string;
};

const stageDefinitions: Record<'cognitive' | 'ocular' | 'vocal' | 'facial', StageDefinition> = {
  cognitive: {
    screen: 'Screen 22',
    eyebrow: 'Cognitive assessment',
    title: 'Memory, attention, and thinking',
    icon: Fingerprint,
    description:
      'Short guided activities explore different thinking skills. Each activity has its own instructions and a clear finish.',
    tasks: [
      'Memory recall using a small set of visual patterns',
      'Attention and response timing during a visual task',
      'Orientation questions about day, place, and situation',
      'Language and word-finding activity',
      'Executive sequencing using a digital trail task'
    ],
    observations: [
      'Task responses and completion times',
      'Pattern matching accuracy and errors',
      'Sequencing order and path completion',
      'Response consistency across activities'
    ],
    equipment: ['No camera for the thinking tasks', 'A comfortable seat', 'Reading glasses if needed'],
    quality: ['Task completion is tracked per activity', 'Long pauses are recorded, not penalised', 'Skipped tasks are marked as skipped']
  },
  ocular: {
    screen: 'Screen 23',
    eyebrow: 'Ocular assessment',
    title: 'Eye movement and visual attention',
    icon: Eye,
    description:
      'The camera observes eye movement while you follow simple visual prompts. The first step is positioning and calibration.',
    tasks: [
      'Camera positioning and face alignment',
      'A short calibration sequence',
      'Following a moving target with your eyes',
      'Holding focus on a still point',
      'Responding to visual cues'
    ],
    observations: [
      'Eye movement and fixation patterns',
      'Response timing to visual prompts',
      'Signal quality during each activity',
      'Camera alignment and lighting conditions'
    ],
    equipment: ['Working front camera', 'Face fully visible', 'Avoid strong backlight', 'Remove glasses only if instructed'],
    quality: ['Live face-detection status', 'Calibration must complete before tasks', 'Poor lighting triggers a retry prompt']
  },
  vocal: {
    screen: 'Screen 24',
    eyebrow: 'Vocal assessment',
    title: 'Voice and speech activity',
    icon: AudioLines,
    description:
      'The microphone records a short spoken response. You will be shown and told exactly what to say before recording starts.',
    tasks: [
      'Microphone level calibration',
      'Repeating a short phrase',
      'A brief reading or verbal response',
      'A short conversational prompt',
      'Reviewing the recording quality indicator'
    ],
    observations: [
      'Speech timing and pause patterns',
      'Derived acoustic characteristics',
      'Transcription of the spoken response',
      'Recording quality and background noise'
    ],
    equipment: ['Working microphone', 'Quiet room', 'Speak at a natural pace', 'No need to raise your voice'],
    quality: ['Input level check before starting', 'Background noise warning', 'Re-record option if quality is insufficient']
  },
  facial: {
    screen: 'Screen 25',
    eyebrow: 'Facial / behavioral assessment',
    title: 'Facial movement activity',
    icon: ScanFace,
    description:
      'A short, friendly interaction observes selected facial movement patterns. This is an exploratory modality and is not used on its own to draw conclusions.',
    tasks: [
      'Camera positioning and face alignment',
      'A guided smile or expression activity',
      'Following a simple facial movement prompt',
      'A short rest period',
      'Processing the derived observations'
    ],
    observations: [
      'Selected facial movement patterns',
      'Bilateral movement consistency',
      'Head position stability during the activity',
      'Capture quality and completeness'
    ],
    equipment: ['Working front camera', 'Even lighting on your face', 'No mask or face covering', 'Relaxed expression'],
    quality: ['Face-detection indicator', 'Capture quality status', 'Processing completion message'],
    exploratoryNote:
      'Facial movement observations are exploratory until their clinical relevance is validated. They are interpreted only alongside other information.'
  }
};

const StagePage: React.FC<{ stage: keyof typeof stageDefinitions }> = ({ stage }) => {
  const definition = stageDefinitions[stage];
  const Icon = definition.icon;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow={`${definition.screen} · ${definition.eyebrow}`}
        title={definition.title}
        description={definition.description}
        icon={Icon}
        actions={<Link to="/patient/assessment/intro" className={secondaryButton}>Back to plan</Link>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionTitle title="What you will do" detail="Every activity includes spoken and written guidance." />
          <ol className="space-y-2.5">
            {definition.tasks.map((task, index) => (
              <li key={task} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-700 shadow-sm">
                  {index + 1}
                </span>
                <span className="text-xs leading-5 text-slate-700">{task}</span>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="What is observed" detail="Derived observations only — not raw recordings in your reports." />
            <ul className="space-y-2">
              {definition.observations.map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle title="Before you begin" />
            <div className="flex flex-wrap gap-1.5">
              {definition.equipment.map((item) => (
                <Pill key={item} tone="slate">{item}</Pill>
              ))}
            </div>
            <ul className="mt-3 space-y-1.5">
              {definition.quality.map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-5 text-slate-500">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" /> {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {definition.exploratoryNote && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4" /> Exploratory modality
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-900/80">{definition.exploratoryNote}</p>
        </div>
      )}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold text-slate-900">This stage is part of one guided session</p>
            <p className="mt-1 text-xs text-slate-500">The full session walks through every activity with pauses between stages.</p>
          </div>
          <Link to="/patient/assessment" className={primaryButton}>
            <Play className="h-4 w-4" /> Begin full session
          </Link>
        </div>
      </Card>
    </div>
  );
};

export const CognitiveAssessmentPage: React.FC = () => <StagePage stage="cognitive" />;
export const OcularAssessmentPage: React.FC = () => <StagePage stage="ocular" />;
export const VocalAssessmentPage: React.FC = () => <StagePage stage="vocal" />;
export const FacialAssessmentPage: React.FC = () => <StagePage stage="facial" />;

// ---------------------------------------------------------------------------
// Screen 26 — Assessment Completion
// ---------------------------------------------------------------------------
export const AssessmentCompletionPage: React.FC = () => {
  const { latestAssessment } = usePatientOverview();
  const tasks = latestAssessment?.taskResponses || {};
  const completedTasks = ['task1', 'task2', 'task3', 'task4', 'task5'].filter((key) => Boolean(tasks[key]));
  const skipped = 5 - completedTasks.length;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 26 · Assessment completion"
        title="Session submitted"
        description="Thank you for completing the screening. Your observations have been securely stored for clinician review."
      />

      {!latestAssessment ? (
        <EmptyState
          scene="emptyAssessment"
          icon={ClipboardList}
          title="No completed session found"
          detail="Once you finish a screening, its completion status will appear here."
          action={<Link to="/patient/assessment/intro" className={primaryButton}>Go to assessment</Link>}
        />
      ) : (
        <>
          <MotionReveal className="mx-auto w-full max-w-2xl">
            <HealthcareScene
              kind="explainResults"
              className="w-full"
              title="Dr. Rahman explaining assessment results to Margaret and Harold"
            />
          </MotionReveal>

          <Card className="border-emerald-200 bg-emerald-50/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-[16px] font-semibold text-emerald-950">Assessment submitted successfully</h2>
                  <p className="mt-1 text-xs leading-5 text-emerald-900/80">
                    {formatDateTime(latestAssessment.date)} · Reference {latestAssessment.id.slice(0, 14)}
                  </p>
                </div>
              </div>
              <AssessmentStatusPill reviewStatus={latestAssessment.reviewStatus} status={latestAssessment.status} />
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <SectionTitle title="Completion status" />
              <div className="space-y-1">
                <InfoRow label="Tasks completed" value={`${completedTasks.length} of 5`} />
                <InfoRow label="Tasks skipped" value={String(skipped)} />
                <InfoRow label="Technical issues" value="None reported" />
                <InfoRow label="Submitted" value={formatDateTime(latestAssessment.date)} />
              </div>
            </Card>
            <Card>
              <SectionTitle title="Observed activities" />
              <ul className="space-y-2">
                {[
                  ['Memory & attention', 'task2'],
                  ['Eye movement', 'task1'],
                  ['Voice & speech', 'task3'],
                  ['Facial movement', 'task4'],
                  ['Functional sequencing', 'task5']
                ].map(([label, key]) => (
                  <li key={key} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600">{label}</span>
                    {tasks[key] ? <Pill tone="green" dot>Captured</Pill> : <Pill tone="slate">Skipped</Pill>}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <SectionTitle title="What happens next" />
              <ol className="space-y-2.5 text-xs leading-5 text-slate-600">
                <li className="flex gap-2"><span className="font-bold text-blue-700">1.</span> A quality check reviews signal completeness.</li>
                <li className="flex gap-2"><span className="font-bold text-blue-700">2.</span> Your clinician reviews observations in context.</li>
                <li className="flex gap-2"><span className="font-bold text-blue-700">3.</span> A plain-language summary is added to your reports.</li>
              </ol>
              <Link to="/patient/assessment/quality" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
                View quality report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/patient/assessment/quality" className={primaryButton}>Quality report</Link>
            <Link to="/patient/assessment/report" className={secondaryButton}>Session summary</Link>
            <Link to="/patient/dashboard" className={secondaryButton}>Return to dashboard</Link>
          </div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 27 — Assessment Quality Report
// ---------------------------------------------------------------------------
export const AssessmentQualityReportPage: React.FC = () => {
  const { latestAssessment, assessments } = usePatientOverview();
  const quality = getQuality(latestAssessment);
  // Three prior comparable sessions are required before a change interpretation is shown.
  const comparable = quality.comparable && assessments.length >= 4;

  const items = [
    { label: 'Audio quality', value: qualityLabel(quality.audio), icon: Mic, good: quality.audio !== 'POOR' },
    { label: 'Video quality', value: qualityLabel(quality.video), icon: Camera, good: quality.video !== 'POOR' },
    { label: 'Task completion', value: qualityLabel(quality.completion), icon: ListChecks, good: quality.completion === 'FULL' },
    { label: 'Instruction comprehension', value: qualityLabel(quality.comprehension), icon: Languages, good: quality.comprehension === 'CLEAR' },
    { label: 'Environmental interruptions', value: String(quality.interruptions), icon: Volume2, good: quality.interruptions === 0 }
  ];

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 27 · Assessment quality report"
        title="How reliable was this session?"
        description="Quality checks help decide whether this session can be compared with your previous sessions. If quality is insufficient, we withhold change interpretation."
      />

      {!latestAssessment ? (
        <EmptyState scene="emptyAssessment" icon={ShieldCheck} title="No session to assess" detail="Complete a screening to see its quality report." />
      ) : (
        <>
          <div className={`rounded-2xl border p-4 ${comparable ? 'border-emerald-200 bg-emerald-50/70' : 'border-amber-200 bg-amber-50/70'}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${comparable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {comparable ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </span>
              <div>
                <h2 className={`text-[14px] font-semibold ${comparable ? 'text-emerald-950' : 'text-amber-950'}`}>
                  {comparable ? 'Valid for comparison with your baseline' : 'Comparison withheld for this session'}
                </h2>
                <p className={`mt-1 text-xs leading-5 ${comparable ? 'text-emerald-900/80' : 'text-amber-900/80'}`}>
                  {comparable
                    ? 'Signal quality and task completion met the minimum conditions for a within-person comparison. This is still exploratory and requires clinician review.'
                    : 'One or more quality conditions were not met. We will not generate a change interpretation from this session alone. Consider repeating the screening in a quieter environment.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <Card>
              <SectionTitle title="Session quality indicators" detail={formatDateTime(latestAssessment.date)} />
              <div className="space-y-2">
                {items.map(({ label, value, icon: Icon, good }) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Icon className="h-4 w-4 text-slate-500" /> {label}
                    </span>
                    <Pill tone={good ? 'green' : 'amber'} dot>{value}</Pill>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <SectionTitle title="Validity of comparison" />
                <dl>
                  <InfoRow label="Previous sessions on record" value={`${Math.max(assessments.length - 1, 0)}`} />
                  <InfoRow label="Minimum needed for comparison" value="3 prior comparable sessions" />
                  <InfoRow label="Comparison status" value={comparable ? 'Available' : 'Not available'} />
                  <InfoRow label="Session included in trends" value={comparable ? 'Yes' : 'No'} />
                </dl>
              </Card>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Info className="h-3.5 w-3.5" /> Why this matters
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  A difficult session should not look like a clinical change. Quality checks separate measurement noise from observations worth reviewing.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/patient/assessment/baseline" className={primaryButton}>Personal baseline</Link>
            <Link to="/patient/assessment/report" className={secondaryButton}>Session summary</Link>
            <Link to="/patient/trends" className={secondaryButton}>Compare with previous sessions</Link>
          </div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 28 — Personal Baseline Report
// ---------------------------------------------------------------------------
export const PersonalBaselineReportPage: React.FC = () => {
  const { baseline } = usePatientOverview();

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 28 · Personal baseline report"
        title="Your personal baseline"
        description="A provisional reference built from your own completed sessions. It is not a population norm, a diagnosis, or a fixed target."
        actions={<Pill tone="amber" dot>Provisional</Pill>}
      />

      {!baseline ? (
        <EmptyState
          scene="emptyAssessment"
          icon={Brain}
          title="Baseline not established"
          detail="Complete your first screening to create a provisional baseline."
          action={<Link to="/patient/assessment/intro" className={primaryButton}>Start assessment</Link>}
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="flex flex-col items-center justify-center text-center">
              <ScoreDial value={baseline.overallScore} label="Baseline" />
              <p className="mt-3 text-[12px] font-semibold text-slate-900">Recorded {formatDate(baseline.establishedAt)}</p>
              <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-500">
                This score is a prototype composite for internal comparison only.
              </p>
            </Card>

            <Card>
              <SectionTitle title="Initial domain observations" detail="From the session used to establish this baseline." />
              <div className="space-y-3">
                {[
                  ['Cognitive performance', baseline.cognitiveScore],
                  ['Functional measures', baseline.functionalScore],
                  ['Ocular observations', baseline.eyeScore],
                  ['Vocal observations', baseline.voiceScore],
                  ['Facial / behavioral observations', baseline.faceScore],
                  ['Health context', baseline.contextScore]
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{label}</span>
                      <span className="font-semibold text-slate-800">{value == null ? 'Not available' : value}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <SectionTitle title="Limitations" />
              <ul className="space-y-2 text-xs leading-5 text-slate-600">
                <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />A baseline from one or two sessions may reflect that day, not a stable personal range.</li>
                <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Task version, language, education, sensory access, and environment must remain comparable.</li>
                <li className="flex gap-2"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />Clinical validity and reliable-change thresholds for this prototype have not been established.</li>
              </ul>
            </Card>
            <Card>
              <SectionTitle title="Confidence information" />
              <dl>
                <InfoRow label="Baseline status" value="Provisional" />
                <InfoRow label="Sessions contributing" value="1 primary session" />
                <InfoRow label="Repeatability established" value="Not yet" />
                <InfoRow label="Clinician reviewed" value="Yes — context review" />
                <InfoRow label="Use in monitoring" value="Exploratory comparison only" />
              </dl>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/patient/trends" className={primaryButton}>View longitudinal trends</Link>
            <Link to="/patient/assessment/report" className={secondaryButton}>Latest session summary</Link>
          </div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 29 — Assessment Report
// ---------------------------------------------------------------------------
export const AssessmentReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { assessments, baseline, latestAssessment } = usePatientOverview();
  const id = searchParams.get('id');
  const assessment = assessments.find((item) => item.id === id) || latestAssessment;
  const quality = getQuality(assessment);
  const change = assessment && baseline ? Number((assessment.overallScore - baseline.overallScore).toFixed(1)) : null;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 29 · Assessment report"
        title="Session summary"
        description="A plain-language summary of one screening session, including what was observed and how it relates to your baseline."
        actions={
          assessment ? (
            <button type="button" onClick={() => window.print()} className={secondaryButton}>
              <Printer className="h-4 w-4" /> Print
            </button>
          ) : undefined
        }
      />

      {!assessment ? (
        <EmptyState scene="emptyAssessment" icon={FileText} title="No report available" detail="Complete a screening to generate a session summary." />
      ) : (
        <>
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <AssessmentStatusPill reviewStatus={assessment.reviewStatus} status={assessment.status} />
                  <Pill tone={quality.comparable ? 'green' : 'amber'} dot>
                    {quality.comparable ? 'Quality checked' : 'Limited quality'}
                  </Pill>
                </div>
                <h2 className="mt-2 text-[18px] font-semibold text-slate-950">{formatDate(assessment.date)} · Five-part screening</h2>
                <p className="mt-1 text-xs text-slate-500">Session reference {assessment.id}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Exploratory score</p>
                <p className="mt-0.5 text-[20px] font-semibold text-slate-900">{Math.round(assessment.overallScore)}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <SectionTitle title="Domain-level observations" detail="Descriptive session information — not severity labels." />
              <div className="space-y-2.5">
                {domainObservations(assessment).map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <SectionTitle title="Comparison with baseline" />
                {baseline && change != null ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">This session</span>
                      <span className="text-xs font-semibold text-slate-800">{Math.round(assessment.overallScore)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">Personal baseline</span>
                      <span className="text-xs font-semibold text-slate-800">{Math.round(baseline.overallScore)}</span>
                    </div>
                    <p className={`mt-3 rounded-xl border p-3 text-xs leading-5 ${
                      Math.abs(change) <= 5
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : 'border-amber-200 bg-amber-50 text-amber-900'
                    }`}>
                      {Math.abs(change) <= 5
                        ? `This session is ${Math.abs(change)} points ${change >= 0 ? 'above' : 'below'} your recorded baseline. That is within the range we would expect from ordinary session-to-session variation.`
                        : `This session is ${Math.abs(change)} points ${change >= 0 ? 'above' : 'below'} your recorded baseline. Your clinician will consider this alongside sleep, context, and previous sessions.`}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Changes are only interpreted when quality and comparison conditions are met. No clinical threshold is applied.
                    </p>
                  </>
                ) : (
                  <p className="text-xs leading-5 text-slate-500">
                    A baseline comparison is not available yet. Complete more comparable sessions to enable it.
                  </p>
                )}
              </Card>

              <Card>
                <SectionTitle title="Clinician review" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">Status</span>
                  <AssessmentStatusPill reviewStatus={assessment.reviewStatus} status={assessment.status} />
                </div>
                {assessment.clinicianNotes ? (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.06em] text-blue-800">Shared clinician note</p>
                    <p className="mt-1 text-xs leading-5 text-blue-900/80">{assessment.clinicianNotes}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {assessment.reviewStatus === 'PENDING_REVIEW'
                      ? 'Your care team has not reviewed this session yet. Clinician notes will appear here when shared.'
                      : 'No clinician note was added for this session.'}
                  </p>
                )}
              </Card>
            </div>
          </div>

          <Card>
            <SectionTitle title="Data quality for this session" />
            <div className="flex flex-wrap gap-2">
              <Pill tone={quality.audio === 'POOR' ? 'amber' : 'green'}>Audio · {qualityLabel(quality.audio)}</Pill>
              <Pill tone={quality.video === 'POOR' ? 'amber' : 'green'}>Video · {qualityLabel(quality.video)}</Pill>
              <Pill tone={quality.completion === 'FULL' ? 'green' : 'amber'}>{qualityLabel(quality.completion)}</Pill>
              <Pill tone={quality.interruptions ? 'amber' : 'green'}>{quality.interruptions} interruption{quality.interruptions === 1 ? '' : 's'}</Pill>
              <Pill tone={quality.comparable ? 'blue' : 'amber'}>{quality.comparable ? 'Comparison conditions met' : 'Comparison withheld'}</Pill>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              This report is screening support, not a diagnosis. Only a qualified professional can interpret these observations and recommend next steps.
            </p>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Link to="/patient/documents" className={primaryButton}>Save to reports & documents</Link>
            <Link to="/patient/history" className={secondaryButton}>Back to history</Link>
          </div>
        </>
      )}
    </div>
  );
};

export { getQuality };
