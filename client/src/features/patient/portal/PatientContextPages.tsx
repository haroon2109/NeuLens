import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BedDouble,
  Brain,
  CheckCircle2,
  ClipboardList,
  Database,
  HeartPulse,
  Info,
  Moon,
  Save,
  Stethoscope,
  Sun,
  Users
} from 'lucide-react';
import { patientPortalApi } from '../../../services/patientPortalApi';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import { usePatientPortalStore } from '../../../store/patientPortalStore';
import { usePatientOverview } from './usePatientOverview';
import { useLanguageStore } from '../../../services/language/LanguageManager';
import { getPortalTranslation } from '../../../services/language/portalTranslations';
import { Card, InfoRow, Pill, PortalPageHeader, SectionTitle, formatDate, primaryButton, secondaryButton } from './ui';

const fieldClass =
  'w-full rounded-xl border border-line-strong bg-warm/70 px-3.5 py-2.5 text-[14px] text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/12';
const labelClass = 'mb-1.5 block text-[14px] font-semibold text-ink';

const rangeLabels = ['Very low', 'Low', 'Moderate', 'Good', 'Very good'];

const RangeField: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  low?: string;
  high?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}> = ({ id, label, value, onChange, low = 'Low', high = 'High', min = 1, max = 5, step = 1, suffix }) => (
  <div>
    <div className="flex items-center justify-between gap-3">
      <label className={labelClass} htmlFor={id}>{label}</label>
      <span className="text-xs font-bold text-forest">{value}{suffix || (max === 5 ? '/5' : '')}</span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-forest"
    />
    <div className="mt-1 flex justify-between text-xs text-muted">
      <span>{low}</span><span>{high}</span>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Screen 34 — Health Context Overview
// ---------------------------------------------------------------------------
export const HealthContextOverviewPage: React.FC = () => {
  const { sleep, wellbeing, health } = usePatientPortalStore();
  const { context } = usePatientOverview();
  const pt = getPortalTranslation(useLanguageStore().currentLanguage);
  const clinical = context.find((item) => item.source === 'clinical_metabolic');

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow={pt.context.overview.eyebrow}
        title={pt.context.overview.title}
        description={pt.context.overview.description}
        actions={<Link to="/patient/context/sleep" className={primaryButton}>Update context</Link>}
      />          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Moon, label: 'Sleep', value: `${sleep.durationHours} hrs`, detail: `Quality ${sleep.quality}/5 · ${sleep.awakenings} awakenings`, chip: 'mint', href: '/patient/context/sleep' },
          { icon: Activity, label: 'Physical activity', value: `${sleep.steps.toLocaleString()} steps`, detail: `${sleep.activeMinutes} active minutes`, chip: 'mint', href: '/patient/context/sleep' },
          { icon: Users, label: 'Mental wellbeing', value: `Mood ${wellbeing.mood}/5`, detail: `Stress ${wellbeing.stress}/5`, chip: 'amber', href: '/patient/context/wellbeing' },
          { icon: Stethoscope, label: 'Clinical measures', value: clinical ? `${clinical.values.systolic}/${clinical.values.diastolic}` : 'Not available', detail: clinical ? 'Blood pressure · last import' : 'No clinical import linked', chip: 'sage', href: '/patient/context/clinical' }
        ].map(({ icon: Icon, label, value, detail, chip, href }) => (
          <Link key={label} to={href} className="pp-card p-4">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg pp-icon-chip ${chip}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-sage-deep">{label}</p>
            <p className="mt-1 text-[17px] font-semibold text-ink">{value}</p>
            <p className="mt-0.5 text-xs text-muted">{detail}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-forest">
              Review <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionTitle title="Context sources" detail="What is connected and when it last updated." />
          <ul className="space-y-2.5">
            {[
              { label: 'Self-reported sleep & lifestyle', source: 'Patient check-in', date: formatDate(new Date()), state: 'Current' },
              { label: 'Mental wellbeing check-in', source: 'Patient check-in', date: formatDate(new Date()), state: 'Current' },
              ...context.map((item) => ({
                label:
                  item.source === 'clinical_metabolic'
                    ? 'Clinical measurements'
                    : item.source === 'sleep'
                    ? 'Sleep record'
                    : item.source === 'wearable'
                    ? 'Wearable summary'
                    : 'Activity record',
                source: 'Patient-recorded / imported',
                date: formatDate(item.recordedAt),
                state: item.consentGranted ? 'Consent recorded' : 'Consent missing'
              }))
            ].map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex flex-col gap-2 rounded-xl border border-line p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg pp-icon-chip white">
                    <Database className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{item.label}</p>
                    <p className="text-xs text-muted">{item.source} · {item.date}</p>
                  </div>
                </div>
                <Pill tone={item.state === 'Consent missing' ? 'amber' : 'green'} dot>{item.state}</Pill>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Wearables & devices" detail="Optional connected data." />
            <p className="text-xs leading-5 text-muted">
              Wearable summaries (activity, sleep, heart rate) can be linked as context with your consent. They are used for discussion only and never change your screening score.
            </p>
            <Link to="/patient/privacy" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline">
              Manage connected devices <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
          <Card>
          <SectionTitle title="Family & medical history" detail="Shared during onboarding." />
            <div className="flex flex-wrap gap-1.5">
              {health.conditions.length ? health.conditions.map((item) => <Pill key={item} tone="sage">{item}</Pill>) : <Pill tone="sage">No conditions shared</Pill>}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              {health.familyHistory || 'No family history was shared during onboarding.'}
            </p>
            <Link to="/patient/context/clinical" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline">
              Review clinical & family history <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
          <div className="pp-notice">
            <Info className="h-3.5 w-3.5" />
            <span>Context is not causation. A poor night's sleep may affect a session, but context alone does not explain or diagnose a change. Clinicians consider all information together.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 35 — Sleep & Lifestyle
// ---------------------------------------------------------------------------
export const SleepLifestylePage: React.FC = () => {
  const { sleep, setSleep } = usePatientPortalStore();
  const pt = getPortalTranslation(useLanguageStore().currentLanguage);
  const [saved, setSaved] = useState(false);
  const [wearableConsent, setWearableConsent] = useState(false);
  const [wearable, setWearable] = useState({ restingHr: '', steps: 0, sleepHours: 0 });
  const [wearableSaved, setWearableSaved] = useState(false);

  const saveWearable = async () => {
    if (!wearableConsent) return;
    await patientPortalApi.saveContextInput('wearable', {
      restingHeartRate: wearable.restingHr ? Number(wearable.restingHr) : null,
      steps: wearable.steps,
      sleepHours: wearable.sleepHours,
      reportedBy: 'PATIENT',
      source: 'wearable-summary'
    });
    setWearableSaved(true);
    window.setTimeout(() => setWearableSaved(false), 2600);
  };

  const save = async () => {
    await patientPortalApi.saveContextInput('sleep', {
      durationHours: sleep.durationHours,
      quality: sleep.quality,
      awakenings: sleep.awakenings
    });
    await patientPortalApi.saveContextInput('lifestyle_activity', {
      steps: sleep.steps,
      activeMinutes: sleep.activeMinutes,
      socialEngagement: sleep.socialEngagement
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow={pt.context.sleep.eyebrow}
        title={pt.context.sleep.title}
        description={pt.context.sleep.description}
        actions={<Pill tone="blue" dot>Last updated today</Pill>}
      />

      <MotionReveal className="mx-auto w-full max-w-2xl">
        <HealthcareScene
          kind="sleeping"
          className="w-full"
          title="Margaret resting comfortably at home"
        />
      </MotionReveal>

      {saved && (
        <div className="pp-success">
          <CheckCircle2 className="h-4 w-4" />
          <span>Context saved for your care team.</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Sleep" detail="Think about the past seven days." />
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="sleep-duration">Average sleep duration</label>
              <div className="flex items-center gap-3">
                <input
                  id="sleep-duration"
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={sleep.durationHours}
                  onChange={(event) => setSleep({ durationHours: Number(event.target.value) })}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-forest"
                />
                <span className="w-16 text-[14px] font-bold text-forest">{sleep.durationHours} hrs</span>
              </div>
            </div>
            <RangeField id="sleep-quality" label="Sleep quality" value={sleep.quality} onChange={(value) => setSleep({ quality: value })} low="Poor" high="Excellent" />
            <RangeField id="sleep-awakenings" label="Night-time awakenings" value={sleep.awakenings} onChange={(value) => setSleep({ awakenings: value })} min={0} max={6} low="None" high="Frequent" suffix="" />
          </div>
        </Card>

        <Card>
          <SectionTitle title="Lifestyle & activity" detail="A typical day rather than a best day." />
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="sleep-steps">Average daily steps</label>
              <input
                id="sleep-steps"
                type="number"
                min="0"
                max="30000"
                step="100"
                value={sleep.steps}
                onChange={(event) => setSleep({ steps: Number(event.target.value) })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="sleep-active">Active minutes per day</label>
              <input
                id="sleep-active"
                type="number"
                min="0"
                max="240"
                value={sleep.activeMinutes}
                onChange={(event) => setSleep({ activeMinutes: Number(event.target.value) })}
                className={fieldClass}
              />
            </div>
            <RangeField id="sleep-social" label="Social engagement" value={sleep.socialEngagement} onChange={(value) => setSleep({ socialEngagement: value })} low="Limited" high="Frequent" />
          </div>
        </Card>
      </div>

      {wearableSaved && (
        <div className="pp-success">
          <CheckCircle2 className="h-4 w-4" />
          <span>Wearable summary saved for your care team.</span>
        </div>
      )}

      <Card>
        <SectionTitle title="Wearable summary (optional)" detail="Shared only with your consent." />
        <label className="flex items-start gap-2 text-xs leading-5 text-body" htmlFor="wearable-consent">
          <input
            id="wearable-consent"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
            checked={wearableConsent}
            onChange={(event) => setWearableConsent(event.target.checked)}
          />
          <span>I consent to share a summary from my wearable device. NeuLens does not diagnose from wearable data.</span>
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="wearable-hr">Resting heart rate (bpm)</label>
            <input
              id="wearable-hr"
              type="number"
              min="40"
              max="120"
              disabled={!wearableConsent}
              value={wearable.restingHr}
              onChange={(event) => setWearable({ ...wearable, restingHr: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="wearable-steps">Avg daily steps</label>
            <input
              id="wearable-steps"
              type="number"
              min="0"
              max="50000"
              step="100"
              disabled={!wearableConsent}
              value={wearable.steps}
              onChange={(event) => setWearable({ ...wearable, steps: Number(event.target.value) })}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="wearable-sleep">Avg sleep (hrs)</label>
            <input
              id="wearable-sleep"
              type="number"
              min="0"
              max="14"
              step="0.5"
              disabled={!wearableConsent}
              value={wearable.sleepHours}
              onChange={(event) => setWearable({ ...wearable, sleepHours: Number(event.target.value) })}
              className={fieldClass}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button type="button" className={primaryButton} onClick={() => void saveWearable()} disabled={!wearableConsent}>
            <Save className="h-4 w-4" /> Save wearable summary
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">Wearable data is context only and does not change your screening observations.</p>
      </Card>

      <Card>
        <SectionTitle title="Anything else you would like to note?" detail="Optional. For example, a disrupted routine or a busy week." />
        <textarea
          rows={3}
          value={sleep.notes}
          onChange={(event) => setSleep({ notes: event.target.value })}
          className={fieldClass}
          placeholder="A short note for your clinician"
        />
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted">Shared with your care team. Optional research sharing follows your privacy settings.</p>
          <button type="button" className={primaryButton} onClick={save}>
            <Save className="h-4 w-4" /> Save context
          </button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link to="/patient/context/wellbeing" className={secondaryButton}>Mental wellbeing <ArrowRight className="h-3.5 w-3.5" /></Link>
        <Link to="/patient/context/clinical" className={secondaryButton}>Clinical & family history</Link>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 36 — Mental Wellbeing
// ---------------------------------------------------------------------------
export const MentalWellbeingPage: React.FC = () => {
  const { wellbeing, setWellbeing } = usePatientPortalStore();
  const pt = getPortalTranslation(useLanguageStore().currentLanguage);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await patientPortalApi.saveContextInput('mental_wellbeing', {
      mood: wellbeing.mood,
      stress: wellbeing.stress,
      motivation: wellbeing.motivation
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow={pt.context.wellbeing.eyebrow}
        title={pt.context.wellbeing.title}
        description={pt.context.wellbeing.description}
        actions={<Pill tone="sage">Optional</Pill>}
      />

      <MotionReveal className="mx-auto w-full max-w-2xl">
        <HealthcareScene
          kind="social"
          className="w-full"
          title="Margaret and Harold sharing time with their caregiver"
        />
      </MotionReveal>

      {saved && (
        <div className="pp-success">
          <CheckCircle2 className="h-4 w-4" />
          <span>Wellbeing check-in saved.</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle title="This week" detail="There are no right or wrong answers." />
          <div className="space-y-6">
            <RangeField id="wellbeing-mood" label="Overall mood" value={wellbeing.mood} onChange={(value) => setWellbeing({ mood: value })} low="Very low" high="Very good" />
            <RangeField id="wellbeing-stress" label="Stress level" value={wellbeing.stress} onChange={(value) => setWellbeing({ stress: value })} low="Calm" high="Very stressed" />
            <RangeField id="wellbeing-motivation" label="Motivation for daily activities" value={wellbeing.motivation} onChange={(value) => setWellbeing({ motivation: value })} low="Very low" high="Very good" />
          </div>
          <div className="mt-6">
            <label className={labelClass} htmlFor="wellbeing-notes">Anything you would like to add?</label>
            <textarea
              id="wellbeing-notes"
              rows={3}
              value={wellbeing.notes}
              onChange={(event) => setWellbeing({ notes: event.target.value })}
              className={fieldClass}
              placeholder="Optional note for your care team"
            />
          </div>
          <button type="button" className={`${primaryButton} mt-4`} onClick={save}>
            <Save className="h-4 w-4" /> Save check-in
          </button>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="flex items-center gap-1.5 text-xs font-bold text-sage-deep">
              <Brain className="h-3.5 w-3.5" /> A gentle reminder
            </p>
            <p className="mt-2 text-[14px] leading-6 text-body">
              Memory complaints and mood can influence each other. Your clinician will consider this alongside your screening observations and history.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {rangeLabels.slice(0, 4).map((label) => <Pill key={label} tone="sage">{label}</Pill>)}
            </div>
          </Card>

          <div className="rounded-xl border border-amber/60 bg-amber/10 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Info className="h-3.5 w-3.5" /> About validated instruments
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-900/80">
              Formal mood and anxiety questionnaires are administered and interpreted by qualified clinicians. This portal does not replace them.
            </p>
          </div>

          <Card>
            <SectionTitle title="If you need support now" />
            <p className="text-xs leading-5 text-muted">
              If you feel unsafe or in crisis, contact local emergency services or your hospital support line immediately.
            </p>
            <a href="tel:+914440001200" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline">
              <HeartPulse className="h-3.5 w-3.5" /> Hospital support: +91 44 4000 1200
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 37 — Clinical & Family History
// ---------------------------------------------------------------------------
export const ClinicalFamilyHistoryPage: React.FC = () => {
  const { health, setHealth } = usePatientPortalStore();
  const { context } = usePatientOverview();
  const pt = getPortalTranslation(useLanguageStore().currentLanguage);
  const clinical = context.find((item) => item.source === 'clinical_metabolic');
  const genomicRecord = context.find((item) => item.source === 'genomic');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Both records are saved as context inputs with the patient's consent. The
  // genomic record is only written when the patient has explicitly opted in.
  const saveContext = async () => {
    setSaving(true);
    setError(null);
    try {
      await patientPortalApi.saveContextInput('family_history', {
        familyHistory: health.familyHistory,
        conditions: health.conditions,
        medications: health.medications,
        reportedBy: 'PATIENT'
      });
      if (health.genomicConsent) {
        await patientPortalApi.saveContextInput('genomic', {
          genomicSummary: health.genomicSummary,
          reportedBy: 'PATIENT',
          interpretationByNeuLens: 'NONE'
        });
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'History could not be saved to the clinical record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow={pt.context.clinical.eyebrow}
        title={pt.context.clinical.title}
        description={pt.context.clinical.description}
        actions={<Pill tone="blue" dot>Patient-maintained</Pill>}
      />

      {saved && (
        <div className="pp-success">
          <CheckCircle2 className="h-4 w-4" />
          <span>History updated and shared with your care team.</span>
        </div>
      )}
      {error && (
        <div className="pp-notice" role="alert">
          <Info className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Relevant medical conditions" detail="Shared during onboarding and editable here." />
          <div className="flex flex-wrap gap-1.5">
            {health.conditions.length ? health.conditions.map((item) => <Pill key={item} tone="slate">{item}</Pill>) : <Pill tone="slate">None shared</Pill>}
          </div>
          <div className="mt-4">
            <label className={labelClass} htmlFor="clinical-medications">Current medications</label>
            <textarea
              id="clinical-medications"
              rows={3}
              value={health.medications}
              onChange={(event) => setHealth({ medications: event.target.value })}
              className={fieldClass}
              placeholder="Medication name, dose, and frequency"
            />
          </div>
          <div className="mt-4">
            <label className={labelClass} htmlFor="clinical-family">Family history</label>
            <textarea
              id="clinical-family"
              rows={3}
              value={health.familyHistory}
              onChange={(event) => setHealth({ familyHistory: event.target.value })}
              className={fieldClass}
              placeholder="Relevant family neurological or memory history"
            />
          </div>
          <button
            type="button"
            className={`${primaryButton} mt-4`}
            onClick={saveContext}
            disabled={saving}
          >
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save history'}
          </button>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Imported clinical information" detail="Read-only in the portal." />
            {clinical ? (
              <>
                <dl>
                  <InfoRow label="Blood pressure" value={`${clinical.values.systolic ?? '—'}/${clinical.values.diastolic ?? '—'} mmHg`} />
                  <InfoRow label="Glucose" value={clinical.values.glucose ? `${clinical.values.glucose} mg/dL` : 'Not available'} />
                  <InfoRow label="Medication on record" value={clinical.values.medication || 'Not listed'} />
                  <InfoRow label="Source" value="Clinical record import" />
                  <InfoRow label="Last updated" value={formatDate(clinical.recordedAt)} />
                </dl>
                <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-muted">
                  <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Imported information is read-only and used for context only. It does not alter your screening observations.
                </p>
              </>
            ) : (
              <p className="text-xs leading-5 text-muted">
                No clinical measurements are linked. Ask your care team about sharing recent measurements if relevant.
              </p>
            )}
          </Card>

          <Card>
            <SectionTitle title="Genomic context (optional)" detail="Shared only with your consent." />
            {genomicRecord ? (
              <p className="mb-3 text-xs leading-5 text-muted">
                Last shared {formatDate(genomicRecord.recordedAt)}. You can withdraw sharing at any time from Privacy & sharing.
              </p>
            ) : (
              <p className="mb-3 text-xs leading-5 text-muted">
                No genomic information has been shared. This is optional and not needed to use NeuLens.
              </p>
            )}
            <label className="flex items-start gap-2 text-xs leading-5 text-body" htmlFor="genomic-consent">
              <input
                id="genomic-consent"
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
                checked={health.genomicConsent}
                onChange={(event) => setHealth({ genomicConsent: event.target.checked })}
              />
              <span>
                I agree to share a genomic result with my care team as context. NeuLens does not interpret variants, calculate genetic risk, or change my screening observations.
              </span>
            </label>
            <div className="mt-3">
              <label className={labelClass} htmlFor="genomic-summary">What was reported</label>
              <textarea
                id="genomic-summary"
                rows={3}
                disabled={!health.genomicConsent}
                value={health.genomicSummary}
                onChange={(event) => setHealth({ genomicSummary: event.target.value })}
                className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-60`}
                placeholder="For example: gene and result exactly as reported by the testing laboratory"
              />
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Genomic context is shown to a qualified clinician for discussion only. It is never used to score this screening or to infer a diagnosis.
            </p>
          </Card>

          <Card>
            <SectionTitle title="Previous cognitive assessments" />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted">{health.previousAssessments}</span>
              <Pill tone="slate">Self-reported</Pill>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Previous assessment details should be confirmed with the clinician or service that performed them.
            </p>
          </Card>

          <div className="pp-notice">
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Data-source labels: patient-reported, patient-recorded, and imported clinical values are shown separately so clinicians know where each value came from.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/patient/context" className={secondaryButton}><Sun className="h-3.5 w-3.5" /> Context overview</Link>
        <Link to="/patient/privacy" className={secondaryButton}><BedDouble className="h-3.5 w-3.5" /> Privacy & sharing</Link>
      </div>
    </div>
  );
};


