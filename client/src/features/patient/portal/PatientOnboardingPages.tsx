import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Brain,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  Info,
  Languages,
  Lock,
  Mic,
  Sparkles,
  Stethoscope,
  Timer,
  Type
} from 'lucide-react';
import { NeulensLogoMark } from '../../../components/NeulensLogoMark';
import { NeulensWordmark } from '../../../components/NeulensWordmark';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import { useAuthStore } from '../../../store/authStore';
import { usePatientPortalStore, type ConsentKey } from '../../../store/patientPortalStore';
import { patientPortalApi } from '../../../services/patientPortalApi';
import { Card, Pill, Toggle } from './ui';

const steps = [
  { label: 'Welcome', path: '/patient/welcome' },
  { label: 'About you', path: '/patient/onboarding/personal-info' },
  { label: 'Health', path: '/patient/onboarding/health-background' },
  { label: 'Consent', path: '/patient/onboarding/consent' },
  { label: 'Accessibility', path: '/patient/onboarding/accessibility' }
];

const OnboardingShell: React.FC<{
  step: number;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  backTo?: string;
}> = ({ step, eyebrow, title, description, children, backTo }) => (
  <div className="min-h-screen bg-[#FBF7EF] text-slate-800">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/patient/welcome" className="flex items-center gap-2.5" aria-label="NeuLens patient portal">
          <NeulensLogoMark className="h-9 w-9" />
          <NeulensWordmark size="small" />
        </Link>
        {backTo && (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        )}
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
      <ol className="mb-7 grid grid-cols-5 gap-1.5" aria-label="Onboarding progress">
        {steps.map((item, index) => {
          const state = index < step ? 'done' : index === step ? 'current' : 'upcoming';
          return (
            <li key={item.label}>
              <div
                className={`h-1.5 rounded-full ${
                  state === 'done' ? 'bg-emerald-500' : state === 'current' ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
              <span
                className={`mt-2 block truncate text-xs font-semibold ${
                  state === 'current' ? 'text-blue-700' : state === 'done' ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {index + 1}. {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.4)] sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
          <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
        </div>
        <h1 className="mt-2 max-w-2xl text-[26px] font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-600">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  </div>
);

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';
const labelClass = 'mb-1.5 block text-[12px] font-semibold text-slate-700';
const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-[13px] font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50';

// ---------------------------------------------------------------------------
// Screen 15 — Patient Welcome
// ---------------------------------------------------------------------------
export const PatientWelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { onboardingComplete } = usePatientPortalStore();
  const firstName = (user?.name || 'there').split(' ')[0];

  return (
    <OnboardingShell
      step={0}
      eyebrow="Screen 15 · Patient welcome"
      title={`Welcome, ${firstName}.`}
      description="NeuLens brings short, guided activities together so you and your care team can build a clearer picture of your brain health over time."
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
          <MotionReveal className="mb-4">
            <HealthcareScene
              kind="registration"
              className="w-full"
              title="A caregiver helping Margaret begin her NeuLens onboarding"
            />
          </MotionReveal>
          <h2 className="text-[13px] font-bold text-slate-900">What to expect</h2>
          <ul className="mt-3 space-y-3">
            {[
              { icon: ClipboardCheck, title: 'A short five-part screening', detail: 'Memory, attention, eye movement, voice, and facial movement activities.' },
              { icon: Timer, title: 'About 10–15 minutes', detail: 'Take breaks, pause, or stop at any point. There is no time pressure.' },
              { icon: Languages, title: 'In your preferred language', detail: 'Written and spoken guidance in six Indian languages.' },
              { icon: Stethoscope, title: 'Reviewed by a clinician', detail: 'Observations are shared with your care team for professional review.' }
            ].map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[12px] font-semibold text-slate-800">{title}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
            <Brain className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <p className="mt-3 text-[12px] font-semibold text-slate-900">Before you begin</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            We will ask a few questions about you, your health background, and your consent. Then you can set up the experience to suit your needs.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Pill tone="green">Optional breaks</Pill>
            <Pill tone="blue">Accessible</Pill>
            <Pill tone="slate">Private</Pill>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-5 text-slate-500">
          NeuLens identifies changes that may warrant further assessment. It does not diagnose disease or replace professional judgement.
        </p>
        <div className="flex flex-wrap gap-2">
          {onboardingComplete && (
            <Link to="/patient/dashboard" className={secondaryButton}>
              Go to dashboard
            </Link>
          )}
          <button
            type="button"
            className={primaryButton}
            onClick={() => navigate(onboardingComplete ? '/patient/dashboard' : '/patient/onboarding/personal-info')}
          >
            {onboardingComplete ? 'Open my portal' : 'Start onboarding'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Screen 16 — Personal Information
// ---------------------------------------------------------------------------
export const PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { personal, setPersonal } = usePatientPortalStore();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!personal.fullName && user?.name) {
      setPersonal({
        fullName: user.name,
        email: user.email || '',
        phone: user.phone || '',
        language: user.language || 'en',
        dateOfBirth: personal.dateOfBirth
      });
    }
  }, [personal.fullName, personal.dateOfBirth, setPersonal, user]);

  const handleContinue = () => {
    if (!personal.fullName.trim()) return setError('Enter your full name.');
    if (!personal.dateOfBirth) return setError('Enter your date of birth.');
    setError('');
    navigate('/patient/onboarding/health-background');
  };

  return (
    <OnboardingShell
      step={1}
      eyebrow="Screen 16 · Personal information"
      title="Tell us about you"
      description="These details help personalise your screening and support accurate comparisons between sessions. You can update them later in My Profile."
      backTo="/patient/welcome"
    >
      {error && (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[12px] font-semibold text-rose-800" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="onboarding-name">Full name</label>
          <input
            id="onboarding-name"
            className={fieldClass}
            value={personal.fullName}
            onChange={(event) => setPersonal({ fullName: event.target.value })}
            placeholder="e.g. Eleanor Vance"
            autoComplete="name"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="onboarding-dob">Date of birth</label>
          <input
            id="onboarding-dob"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            className={fieldClass}
            value={personal.dateOfBirth}
            onChange={(event) => setPersonal({ dateOfBirth: event.target.value })}
            autoComplete="bday"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="onboarding-language">Preferred language</label>
          <select
            id="onboarding-language"
            className={fieldClass}
            value={personal.language}
            onChange={(event) => setPersonal({ language: event.target.value })}
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="onboarding-education">Education level</label>
          <select
            id="onboarding-education"
            className={fieldClass}
            value={personal.education}
            onChange={(event) => setPersonal({ education: event.target.value })}
          >
            <option value="">Select education level</option>
            <option>No formal schooling</option>
            <option>Primary school</option>
            <option>Secondary school</option>
            <option>Undergraduate</option>
            <option>Postgraduate or professional</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="onboarding-email">Email address</label>
          <input
            id="onboarding-email"
            type="email"
            className={fieldClass}
            value={personal.email}
            onChange={(event) => setPersonal({ email: event.target.value })}
            autoComplete="email"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="onboarding-phone">Phone number</label>
          <input
            id="onboarding-phone"
            type="tel"
            className={fieldClass}
            value={personal.phone}
            onChange={(event) => setPersonal({ phone: event.target.value })}
            autoComplete="tel"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            <HeartPulse className="h-3.5 w-3.5" /> Emergency contact <span className="font-medium normal-case tracking-normal text-slate-400">(optional)</span>
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              aria-label="Emergency contact name"
              className={fieldClass}
              value={personal.emergencyName}
              onChange={(event) => setPersonal({ emergencyName: event.target.value })}
              placeholder="Contact name"
            />
            <input
              aria-label="Emergency contact phone"
              type="tel"
              className={fieldClass}
              value={personal.emergencyPhone}
              onChange={(event) => setPersonal({ emergencyPhone: event.target.value })}
              placeholder="Contact phone"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <Link to="/patient/welcome" className={secondaryButton}><ArrowLeft className="h-4 w-4" /> Back</Link>
        <button type="button" className={primaryButton} onClick={handleContinue}>
          Continue to health background <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Screen 17 — Health Background
// ---------------------------------------------------------------------------
const conditions = ['Hypertension', 'Diabetes', 'Heart disease', 'Thyroid condition', 'Stroke', 'Head injury', 'None of these'];
const sensoryOptions = ['Vision difficulty', 'Hearing difficulty', 'Mobility difficulty', 'Speech difficulty', 'None of these'];

const ChipSelect: React.FC<{
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}> = ({ options, selected, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const active = selected.includes(option);
      return (
        <button
          key={option}
          type="button"
          aria-pressed={active}
          onClick={() => {
            if (option === 'None of these') {
              onChange(active ? [] : [option]);
              return;
            }
            const withoutNone = selected.filter((value) => value !== 'None of these');
            onChange(active ? withoutNone.filter((value) => value !== option) : [...withoutNone, option]);
          }}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            active ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          {active && <Check className="h-3 w-3" />}
          {option}
        </button>
      );
    })}
  </div>
);

export const HealthBackgroundPage: React.FC = () => {
  const navigate = useNavigate();
  const { health, setHealth } = usePatientPortalStore();

  return (
    <OnboardingShell
      step={2}
      eyebrow="Screen 17 · Health background"
      title="A little health context"
      description="This helps your clinician interpret screening observations alongside your history. Share only what you are comfortable with."
      backTo="/patient/onboarding/personal-info"
    >
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Relevant medical history</label>
          <ChipSelect
            options={conditions}
            selected={health.conditions}
            onChange={(next) => setHealth({ conditions: next })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="health-medications">Current medications</label>
            <textarea
              id="health-medications"
              rows={3}
              className={fieldClass}
              value={health.medications}
              onChange={(event) => setHealth({ medications: event.target.value })}
              placeholder="Name, dose, and how often — or write 'None'"
            />
          </div>
          <div>
            <label className={labelClass}>Existing sensory difficulties</label>
            <ChipSelect
              options={sensoryOptions}
              selected={health.sensory}
              onChange={(next) => setHealth({ sensory: next })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="health-family">Relevant family history</label>
            <textarea
              id="health-family"
              rows={3}
              className={fieldClass}
              value={health.familyHistory}
              onChange={(event) => setHealth({ familyHistory: event.target.value })}
              placeholder="For example, a close relative with memory or neurological concerns"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="health-previous">Previous cognitive assessments</label>
            <select
              id="health-previous"
              className={fieldClass}
              value={health.previousAssessments}
              onChange={(event) => setHealth({ previousAssessments: event.target.value })}
            >
              <option>No previous assessments</option>
              <option>Yes — within the last year</option>
              <option>Yes — more than a year ago</option>
              <option>Not sure</option>
            </select>
            <label className={`${labelClass} mt-4`} htmlFor="health-lifestyle">Relevant lifestyle information</label>
            <textarea
              id="health-lifestyle"
              rows={3}
              className={fieldClass}
              value={health.lifestyleNotes}
              onChange={(event) => setHealth({ lifestyleNotes: event.target.value })}
              placeholder="Sleep, activity, work, or anything that may affect today's session"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <Link to="/patient/onboarding/personal-info" className={secondaryButton}><ArrowLeft className="h-4 w-4" /> Back</Link>
        <button type="button" className={primaryButton} onClick={() => navigate('/patient/onboarding/consent')}>
          Continue to consent <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Screen 18 — Consent & Privacy
// ---------------------------------------------------------------------------
const consentRows: Array<{ key: ConsentKey; label: string; detail: string; required: boolean }> = [
  {
    key: 'dataCollection',
    label: 'Assessment responses and observations',
    detail: 'Task responses, timing, and derived observations from each screening session.',
    required: true
  },
  {
    key: 'cameraMic',
    label: 'Camera and microphone use',
    detail: 'Camera supports eye and facial movement activities; microphone supports voice activities. Processing happens during the session.',
    required: true
  },
  {
    key: 'processing',
    label: 'Secure processing and storage',
    detail: 'Derived observations are stored with your patient record for longitudinal comparison and clinician review.',
    required: true
  },
  {
    key: 'clinicianAccess',
    label: 'Access by my care team',
    detail: 'Verified clinicians involved in your care can review screening observations and add notes.',
    required: true
  },
  {
    key: 'optionalSharing',
    label: 'Optional research and data sharing',
    detail: 'Allow de-identified data to support service improvement and research. You can change this at any time.',
    required: false
  },
  {
    key: 'withdrawalAcknowledged',
    label: 'I understand I can withdraw consent',
    detail: 'You can update permissions or request deletion in Privacy & Data Settings. Withdrawal does not affect care already provided.',
    required: true
  }
];

export const ConsentPrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { consent, setConsent, signConsent } = usePatientPortalStore();
  const [error, setError] = useState('');

  const requiredComplete = consentRows
    .filter((row) => row.required)
    .every((row) => consent[row.key]);

  const handleContinue = async () => {
    if (!requiredComplete) {
      setError('Please review and accept each required consent item.');
      return;
    }
    setError('');

    // Consent is a server-side record (version, timestamp, actor, request context).
    // Do not advance if it could not be saved.
    try {
      await patientPortalApi.recordConsent({
        dataCollection: consent.dataCollection,
        cameraMic: consent.cameraMic,
        processing: consent.processing,
        clinicianAccess: consent.clinicianAccess,
        optionalSharing: consent.optionalSharing,
        withdrawalAcknowledged: consent.withdrawalAcknowledged
      });
    } catch (err: any) {
      setError(
        err.message ||
          'Your consent could not be saved. Please try again, or ask clinic staff for help.'
      );
      return;
    }

    signConsent();
    navigate('/patient/onboarding/accessibility');
  };

  return (
    <OnboardingShell
      step={3}
      eyebrow="Screen 18 · Consent & privacy"
      title="Your data, your choices"
      description="We explain exactly what is collected and how it is used. Required items keep the screening safe and clinically meaningful; optional sharing is your choice."
      backTo="/patient/onboarding/health-background"
    >
      {error && (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[12px] font-semibold text-rose-800" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2.5">
          {consentRows.map((row) => (
            <Toggle
              key={row.key}
              label={`${row.label}${row.required ? ' *' : ' (optional)'}`}
              detail={row.detail}
              checked={consent[row.key]}
              onChange={(value) => setConsent(row.key, value)}
            />
          ))}
        </div>

        <div className="space-y-3">
          <MotionReveal>
            <HealthcareScene
              kind="consent"
              className="w-full"
              title="Dr. Rahman explaining consent and privacy to Margaret and Harold"
            />
          </MotionReveal>
          <Card className="bg-slate-50/60">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
              <Lock className="h-3.5 w-3.5" /> How data is handled
            </p>
            <ul className="mt-3 space-y-2.5 text-xs leading-5 text-slate-600">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />Raw video and audio are not included in your portal reports.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />Only derived observations and task responses are stored.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />Access is limited to verified clinicians in your care team.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />You can withdraw optional permissions from Privacy &amp; Data Settings.</li>
            </ul>
          </Card>
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Info className="h-3.5 w-3.5" /> A note on clinical use
            </p>
            <p className="mt-1.5 text-xs leading-5 text-blue-900/80">
              NeuLens is a screening support tool. Observations are exploratory and require professional interpretation.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
        <Link to="/patient/onboarding/health-background" className={secondaryButton}><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="flex w-full flex-col items-end gap-2 sm:w-auto">
          {!requiredComplete && <span className="text-xs font-medium text-slate-500">Required items are marked *</span>}
          <button type="button" className={primaryButton} onClick={() => void handleContinue()} disabled={!requiredComplete}>
            Accept and continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Screen 19 — Accessibility Setup
// ---------------------------------------------------------------------------
export const AccessibilitySetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessibility, setAccessibility, completeOnboarding } = usePatientPortalStore();
  const [testing, setTesting] = useState<'camera' | 'mic' | null>(null);

  const runTest = (kind: 'camera' | 'mic') => {
    setTesting(kind);
    window.setTimeout(() => {
      setAccessibility(kind === 'camera' ? { cameraTested: true } : { micTested: true });
      setTesting(null);
    }, 1100);
  };

  const finish = () => {
    completeOnboarding();
    navigate('/patient/dashboard', { replace: true });
  };

  return (
    <OnboardingShell
      step={4}
      eyebrow="Screen 19 · Accessibility setup"
      title="Set up your experience"
      description="Choose how you would like to read, hear, and interact with NeuLens. These choices can be changed at any time."
      backTo="/patient/onboarding/consent"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="access-language"><Languages className="mr-1 inline h-3.5 w-3.5" /> Language</label>
            <select
              id="access-language"
              className={fieldClass}
              value={accessibility.language}
              onChange={(event) => setAccessibility({ language: event.target.value })}
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
            </select>
          </div>

          <div>
            <span className={labelClass}><Type className="mr-1 inline h-3.5 w-3.5" /> Text size</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'normal' as const, label: 'A', detail: 'Standard' },
                { value: 'large' as const, label: 'A+', detail: 'Larger' },
                { value: 'xlarge' as const, label: 'A++', detail: 'Largest' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAccessibility({ textSize: option.value })}
                  aria-pressed={accessibility.textSize === option.value}
                  className={`rounded-xl border px-3 py-3 text-center transition ${
                    accessibility.textSize === option.value
                      ? 'border-blue-300 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-[17px] font-bold">{option.label}</span>
                  <span className="mt-0.5 block text-xs">{option.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <Toggle
            label="High contrast"
            detail="Stronger borders and darker text for easier reading."
            checked={accessibility.highContrast}
            onChange={(value) => setAccessibility({ highContrast: value })}
          />
          <Toggle
            label="Audio instructions"
            detail="Read activity instructions aloud during the screening."
            checked={accessibility.audioInstructions}
            onChange={(value) => setAccessibility({ audioInstructions: value })}
          />
          <div>
            <label className={labelClass} htmlFor="access-touch">Touch interaction preference</label>
            <select
              id="access-touch"
              className={fieldClass}
              value={accessibility.touchPreference}
              onChange={(event) => setAccessibility({ touchPreference: event.target.value })}
            >
              <option>Large tap targets</option>
              <option>Standard tap targets</option>
              <option>Keyboard or switch access</option>
              <option>Ask a caregiver to assist</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <Card className="bg-slate-50/60">
            <p className="text-[12px] font-semibold text-slate-900">Camera and microphone check</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              A quick check helps avoid technical interruptions. You can skip this and test later.
            </p>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Camera className="h-4 w-4 text-slate-500" /> Camera
                </span>
                {accessibility.cameraTested ? (
                  <Pill tone="green" dot>Ready</Pill>
                ) : (
                  <button type="button" className="text-xs font-bold text-blue-700" onClick={() => runTest('camera')}>
                    {testing === 'camera' ? 'Checking…' : 'Test camera'}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Mic className="h-4 w-4 text-slate-500" /> Microphone
                </span>
                {accessibility.micTested ? (
                  <Pill tone="green" dot>Ready</Pill>
                ) : (
                  <button type="button" className="text-xs font-bold text-blue-700" onClick={() => runTest('mic')}>
                    {testing === 'mic' ? 'Checking…' : 'Test microphone'}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
              <AudioLines className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Device tests are illustrative in this demonstration environment.
            </p>
          </Card>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Accessibility className="h-3.5 w-3.5" /> Built for different needs
            </p>
            <p className="mt-1.5 text-xs leading-5 text-emerald-900/80">
              Large controls, spoken guidance, and pause options are available throughout the assessment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
        <Link to="/patient/onboarding/consent" className={secondaryButton}><ArrowLeft className="h-4 w-4" /> Back</Link>
        <button type="button" className={primaryButton} onClick={finish}>
          Finish setup and open portal <CheckCircle2 className="h-4 w-4" />
        </button>
      </div>
    </OnboardingShell>
  );
};

export const onboardingStepPaths = steps.map((step) => step.path);
