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
import { NeuLensLogo } from '../../../components/NeuLensLogo';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import { useAuthStore } from '../../../store/authStore';
import { usePatientPortalStore, type ConsentKey } from '../../../store/patientPortalStore';
import { patientPortalApi } from '../../../services/patientPortalApi';
import { useLanguageStore } from '../../../services/language/LanguageManager';
import { getPortalTranslation } from '../../../services/language/portalTranslations';
import { getLanguageInfo } from '../../../services/language/translations';
import type { SupportedLanguage } from '../../../services/language/types';
import { useVoiceAssistantStore } from '../../../services/voice/VoiceInstructionEngine';
import { Card, Pill, Toggle, formatDate, primaryButton, secondaryButton } from './ui';

const steps = [
  { label: 'Welcome', path: '/patient/welcome' },
  { label: 'About you', path: '/patient/onboarding/personal-info' },
  { label: 'Health', path: '/patient/onboarding/health-background' },
  { label: 'Consent', path: '/patient/onboarding/consent' },
  { label: 'Accessibility', path: '/patient/onboarding/accessibility' }
];

const fieldClass =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-forest focus:ring-4 focus:ring-forest/12';
const labelClass = 'mb-1.5 block text-[14px] font-semibold text-ink';
/**
 * Onboarding shell — one NeuLens card, sage eyebrow, warm page background,
 * mint/forest progress steps. Preserves all existing step labels and routes.
 */
const OnboardingShell: React.FC<{
  step: number;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}> = ({ step, eyebrow, title, description, children, backTo, backLabel = 'Back' }) => (
  <div className="min-h-screen bg-warm text-ink">
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/patient/welcome" className="flex items-center gap-2.5 text-decoration-none" aria-label="NeuLens patient portal">
          <NeuLensLogo height="h-9" />
        </Link>
        {backTo && (
          <Link
            to={backTo}
            className="pp-btn pp-btn-ghost pp-btn-sm inline-flex items-center gap-1.5 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        )}
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
      {/* Progress steps — sage/forest/mint */}
      <ol className="mb-7 grid grid-cols-5 gap-1.5" aria-label="Onboarding progress">
        {steps.map((item, index) => {
          const state = index < step ? 'done' : index === step ? 'current' : 'upcoming';
          return (
            <li key={item.label}>
              <div
                className={`h-1.5 rounded-full ${
                  state === 'done' ? 'bg-forest' : state === 'current' ? 'bg-forest' : 'bg-line'
                }`}
              />
              <span
                className={`mt-2 block truncate text-[13px] font-semibold ${
                  state === 'current' ? 'text-forest' : state === 'done' ? 'text-forest' : 'text-muted'
                }`}
              >
                {index + 1}. {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Card — NeuLens pp-card with mint header strip */}
      <div className="pp-card-deep p-5 shadow-[0_18px_50px_-42px_rgba(27,51,43,0.4)] sm:p-8">
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-sage-deep">
          <Sparkles className="h-3.5 w-3.5 text-sage-deep" aria-hidden="true" />
          {eyebrow}
        </div>
        <h1 className="mt-2 max-w-2xl text-[26px] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-body">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  </div>
);

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
        <div className="rounded-2xl border border-line bg-warm/70 p-4 sm:p-5">
          <MotionReveal className="mb-4">
            <HealthcareScene
              kind="registration"
              className="w-full"
              title="A caregiver helping Haroon begin NeuLens onboarding"
              animated={false}
            />
          </MotionReveal>
          <h2 className="text-[14px] font-semibold text-ink">What to expect</h2>
          <ul className="mt-3 space-y-3">
            {[
              { icon: ClipboardCheck, title: 'A short five-part screening', detail: 'Memory, attention, eye movement, voice, and facial movement activities.' },
              { icon: Timer, title: 'About 10–15 minutes', detail: 'Take breaks, pause, or stop at any point. There is no time pressure.' },
              { icon: Languages, title: 'In your preferred language', detail: 'Written and spoken guidance in Arabic and English, with accessible multi-sensory support.' },
              { icon: Stethoscope, title: 'Reviewed by a clinician', detail: 'Observations are shared with your care team for professional review.' }
            ].map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint text-forest shadow-xs">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-ink">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-muted">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-mint bg-mint/50 p-4 sm:p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-forest shadow-xs">
            <Brain className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className="mt-3 text-[14px] font-semibold text-ink">Before you begin</p>
          <p className="mt-1 text-[13px] leading-5 text-muted">
            We will ask a few questions about you, your health background, and your consent. Then you can set up the experience to suit your needs.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Pill tone="mint">Optional breaks</Pill>
            <Pill tone="forestSoft">Accessible</Pill>
            <Pill tone="sage">Private</Pill>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="max-w-xl text-[13px] leading-5 text-muted">
          NeuLens identifies changes that may warrant further assessment. It does not diagnose disease or replace professional judgement.
        </p>
        <div className="flex flex-wrap gap-2">
          {onboardingComplete ? (
            <Link to="/patient/dashboard" className={primaryButton}>
              Go to dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              className={primaryButton}
              onClick={() => navigate('/patient/onboarding/personal-info')}
            >
              Start onboarding
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
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
  const { setLanguage } = useLanguageStore();
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
        <p className="mb-4 rounded-xl border border-rose/60 bg-rose/10 px-3.5 py-2.5 text-[14px] font-semibold text-rose-900" role="alert">
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
            onChange={(event) => {
              const language = event.target.value as SupportedLanguage;
              // Keep the profile field and the spoken-guidance language in step:
              // this choice must actually reach the voice engine, not just be stored.
              setPersonal({ language });
              setLanguage(language);
            }}
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
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

        <div className="rounded-xl border border-line bg-warm/70 p-3.5 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-sage-deep">
            <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />
            Emergency contact <span className="font-medium normal-case tracking-normal text-muted">(optional)</span>
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

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
        <Link to="/patient/welcome" className={secondaryButton}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <button type="button" className={primaryButton} onClick={handleContinue}>
          Continue to health background
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            active
              ? 'border-forest/40 bg-mint text-forest'
              : 'border-line bg-white text-body hover:border-sage-dark/60'
          }`}
        >
          {active && <Check className="h-3 w-3" aria-hidden="true" />}
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
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="health-lifestyle">Relevant lifestyle information</label>
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

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
        <Link to="/patient/onboarding/personal-info" className={secondaryButton}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <button type="button" className={primaryButton} onClick={() => navigate('/patient/onboarding/consent')}>
          Continue to consent
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Screen 18 — Consent & Privacy
// ---------------------------------------------------------------------------
// Item wording is translated in portalTranslations so the consent text can be
// read in the language the patient chose; only the required/optional status
// (a clinical and legal decision) stays here.
const consentRows: Array<{ key: ConsentKey; required: boolean }> = [
  { key: 'dataCollection', required: true },
  { key: 'cameraMic', required: true },
  { key: 'processing', required: true },
  { key: 'clinicianAccess', required: true },
  { key: 'optionalSharing', required: false },
  { key: 'withdrawalAcknowledged', required: true }
];

export const ConsentPrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { consent, setConsent, signConsent } = usePatientPortalStore();
  const { currentLanguage } = useLanguageStore();
  const pt = getPortalTranslation(currentLanguage);
  const [error, setError] = useState('');

  const requiredComplete = consentRows
    .filter((row) => row.required)
    .every((row) => consent[row.key]);

  const handleContinue = async () => {
    if (!requiredComplete) {
      setError(pt.consent.errors.required);
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
      // Server messages are English-only, so an Arabic reader is shown the
      // translated message rather than text they cannot read.
      setError(
        currentLanguage === 'ar'
          ? pt.consent.errors.saveFailed
          : err.message || pt.consent.errors.saveFailed
      );
      return;
    }

    signConsent();
    navigate('/patient/onboarding/accessibility');
  };

  return (
    <OnboardingShell
      step={3}
      eyebrow={pt.consent.eyebrow}
      title={pt.consent.title}
      description={pt.consent.description}
      backTo="/patient/onboarding/health-background"
      backLabel={pt.consent.back}
    >
      {error && (
        <p className="mb-4 rounded-xl border border-rose/60 bg-rose/10 px-3.5 py-2.5 text-[14px] font-semibold text-rose-900" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-2.5">
          {consentRows.map((row) => {
            const copy = pt.consent.items[row.key];
            return (
              <Toggle
                key={row.key}
                label={`${copy.label}${row.required ? pt.consent.requiredSuffix : pt.consent.optionalSuffix}`}
                detail={copy.detail}
                checked={consent[row.key]}
                onChange={(value) => setConsent(row.key, value)}
              />
            );
          })}
        </div>

        <div className="space-y-3">
          <MotionReveal>
            <HealthcareScene
              kind="consent"
              className="w-full"
              title="Dr. Mohamed explaining consent and privacy to Haroon and care partner"
              animated={false}
            />
          </MotionReveal>
          <Card className="bg-warm/70">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-sage-deep">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              {pt.consent.dataHandlingTitle}
            </p>
            <ul className="mt-3 space-y-2.5 text-[13px] leading-5 text-muted">
              {pt.consent.dataHandling.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <div className="rounded-xl border border-mint bg-mint/50 p-3.5">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-forest">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              {pt.consent.clinicalNoteTitle}
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-forest/80">
              {pt.consent.clinicalNoteBody}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:flex-wrap sm:items-center">
        <Link to="/patient/onboarding/health-background" className={secondaryButton}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {pt.consent.back}
        </Link>
        <div className="flex w-full flex-col items-end gap-2 sm:w-auto">
          {!requiredComplete && <span className="text-[13px] font-medium text-muted">{pt.consent.requiredItemsMarked}</span>}
          <button type="button" className={primaryButton} onClick={() => void handleContinue()} disabled={!requiredComplete}>
            {pt.consent.acceptAndContinue}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
  const { currentLanguage, setLanguage } = useLanguageStore();
  const { speak, stopSpeaking } = useVoiceAssistantStore();
  const [testing, setTesting] = useState<'camera' | 'mic' | null>(null);

  const changeLanguage = (value: string) => {
    const language = value as SupportedLanguage;
    setAccessibility({ language });
    setLanguage(language);
  };

  const previewVoice = () => {
    speak(getLanguageInfo(currentLanguage).sampleGreeting);
  };

  const runTest = (kind: 'camera' | 'mic') => {
    setTesting(kind);
    window.setTimeout(() => {
      setAccessibility(kind === 'camera' ? { cameraTested: true } : { micTested: true });
      setTesting(null);
    }, 1100);
  };

  const finish = () => {
    stopSpeaking();
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
            <label className={labelClass} htmlFor="access-language">
              <Languages className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              Language
            </label>
            <select
              id="access-language"
              className={fieldClass}
              value={currentLanguage}
              onChange={(event) => changeLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
            </select>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-[13px] leading-5 text-muted">Spoken guidance uses this language.</p>
              <button
                type="button"
                onClick={previewVoice}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-forest hover:underline"
              >
                <AudioLines className="h-3.5 w-3.5" aria-hidden="true" />
                Hear a sample
              </button>
            </div>
          </div>

          <div>
            <span className={labelClass}>
              <Type className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              Text size
            </span>
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
                  className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                    accessibility.textSize === option.value
                      ? 'border-forest/40 bg-mint text-forest font-semibold'
                      : 'border-line bg-white text-body hover:border-sage-dark/60'
                  }`}
                >
                  <span className="block text-[17px] font-bold" style={{ fontFamily: 'var(--nl-font-sans)' }}>{option.label}</span>
                  <span className="mt-0.5 block text-[13px]">{option.detail}</span>
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
          <Card className="bg-warm/70">
            <p className="text-[14px] font-semibold text-ink">Camera and microphone check</p>
            <p className="mt-1 text-[13px] leading-5 text-muted">
              A quick check helps avoid technical interruptions. You can skip this and test later.
            </p>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
                <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <Camera className="h-4 w-4 text-sage-deep" aria-hidden="true" />
                  Camera
                </span>
                {accessibility.cameraTested ? (
                  <Pill tone="forestSoft" dot>Ready</Pill>
                ) : (
                  <button type="button" className="text-[13px] font-bold text-forest" onClick={() => runTest('camera')}>
                    {testing === 'camera' ? 'Checking…' : 'Test camera'}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3">
                <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <Mic className="h-4 w-4 text-sage-deep" aria-hidden="true" />
                  Microphone
                </span>
                {accessibility.micTested ? (
                  <Pill tone="forestSoft" dot>Ready</Pill>
                ) : (
                  <button type="button" className="text-[13px] font-bold text-forest" onClick={() => runTest('mic')}>
                    {testing === 'mic' ? 'Checking…' : 'Test microphone'}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[13px] leading-5 text-muted">
              <AudioLines className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Device tests are illustrative in this demonstration environment.
            </p>
          </Card>

          <div className="rounded-xl border border-forest/40 bg-mint/50 p-3.5">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-forest">
              <Accessibility className="h-3.5 w-3.5" aria-hidden="true" />
              Built for different needs
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-forest/80">
              Large controls, spoken guidance, and pause options are available throughout the assessment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
        <Link to="/patient/onboarding/consent" className={secondaryButton}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <button type="button" className={primaryButton} onClick={finish}>
          Finish setup and open portal
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </OnboardingShell>
  );
};

export const onboardingStepPaths = steps.map((step) => step.path);
