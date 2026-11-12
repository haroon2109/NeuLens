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
import { Card, InfoRow, Pill, PortalPageHeader, SectionTitle, formatDate } from './ui';

const primaryButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-[12px] font-bold text-white transition hover:bg-blue-800';
const secondaryButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50';
const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';
const labelClass = 'mb-1.5 block text-[12px] font-semibold text-slate-700';

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
      <span className="text-xs font-bold text-blue-800">{value}{suffix || (max === 5 ? '/5' : '')}</span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
    />
    <div className="mt-1 flex justify-between text-xs text-slate-400">
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
  const clinical = context.find((item) => item.source === 'clinical_metabolic');

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 34 · Health context"
        title="What may be shaping your results"
        description="Sleep, activity, wellbeing, and clinical information help your care team interpret screening observations in context. These do not change your score."
        actions={<Link to="/patient/context/sleep" className={primaryButton}>Update context</Link>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Moon, label: 'Sleep', value: `${sleep.durationHours} hrs`, detail: `Quality ${sleep.quality}/5 · ${sleep.awakenings} awakenings`, tone: 'text-violet-700 bg-violet-50', href: '/patient/context/sleep' },
          { icon: Activity, label: 'Physical activity', value: `${sleep.steps.toLocaleString()} steps`, detail: `${sleep.activeMinutes} active minutes`, tone: 'text-emerald-700 bg-emerald-50', href: '/patient/context/sleep' },
          { icon: Users, label: 'Mental wellbeing', value: `Mood ${wellbeing.mood}/5`, detail: `Stress ${wellbeing.stress}/5`, tone: 'text-amber-700 bg-amber-50', href: '/patient/context/wellbeing' },
          { icon: Stethoscope, label: 'Clinical measures', value: clinical ? `${clinical.values.systolic}/${clinical.values.diastolic}` : 'Not available', detail: clinical ? 'Blood pressure · last import' : 'No clinical import linked', tone: 'text-blue-700 bg-blue-50', href: '/patient/context/clinical' }
        ].map(({ icon: Icon, label, value, detail, tone, href }) => (
          <Link key={label} to={href} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-2.5 text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">{label}</p>
            <p className="mt-1 text-[17px] font-semibold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700">
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
                    : 'Activity record',
                source: 'Patient-recorded / imported',
                date: formatDate(item.recordedAt),
                state: item.consentGranted ? 'Consent recorded' : 'Consent missing'
              }))
            ].map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <Database className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.source} · {item.date}</p>
                  </div>
                </div>
                <Pill tone={item.state === 'Consent missing' ? 'amber' : 'green'} dot>{item.state}</Pill>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Family & medical history" detail="Shared during onboarding." />
            <div className="flex flex-wrap gap-1.5">
              {health.conditions.length ? health.conditions.map((item) => <Pill key={item} tone="slate">{item}</Pill>) : <Pill tone="slate">No conditions shared</Pill>}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600">
              {health.familyHistory || 'No family history was shared during onboarding.'}
            </p>
            <Link to="/patient/context/clinical" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
              Review clinical & family history <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Info className="h-3.5 w-3.5" /> Context is not causation
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-900/80">
              A poor night's sleep may affect a session, but context alone does not explain or diagnose a change. Clinicians consider all information together.
            </p>
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
  const [saved, setSaved] = useState(false);

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
        eyebrow="Screen 35 · Sleep & lifestyle"
        title="Sleep, movement, and daily life"
        description="Small context updates help your clinician interpret a session. Share as much or as little as you like."
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
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12px] font-semibold text-emerald-900" role="status">
          <CheckCircle2 className="h-4 w-4" /> Context saved for your care team.
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
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                />
                <span className="w-16 text-[12px] font-bold text-blue-800">{sleep.durationHours} hrs</span>
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
          <p className="text-xs leading-5 text-slate-500">Shared with your care team. Optional research sharing follows your privacy settings.</p>
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
        eyebrow="Screen 36 · Mental wellbeing"
        title="How have you been feeling?"
        description="A short self-report helps put a screening session in context. It is not a mood diagnosis or a validated screening instrument."
        actions={<Pill tone="slate">Optional</Pill>}
      />

      <MotionReveal className="mx-auto w-full max-w-2xl">
        <HealthcareScene
          kind="social"
          className="w-full"
          title="Margaret and Harold sharing time with their caregiver"
        />
      </MotionReveal>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12px] font-semibold text-emerald-900" role="status">
          <CheckCircle2 className="h-4 w-4" /> Wellbeing check-in saved.
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              <Brain className="h-3.5 w-3.5" /> A gentle reminder
            </p>
            <p className="mt-2 text-[12px] leading-6 text-slate-600">
              Memory complaints and mood can influence each other. Your clinician will consider this alongside your screening observations and history.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {rangeLabels.slice(0, 4).map((label) => <Pill key={label} tone="slate">{label}</Pill>)}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Info className="h-3.5 w-3.5" /> About validated instruments
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-900/80">
              Formal mood and anxiety questionnaires are administered and interpreted by qualified clinicians. This portal does not replace them.
            </p>
          </div>

          <Card>
            <SectionTitle title="If you need support now" />
            <p className="text-xs leading-5 text-slate-600">
              If you feel unsafe or in crisis, contact local emergency services or your hospital support line immediately.
            </p>
            <a href="tel:+914440001200" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
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
  const clinical = context.find((item) => item.source === 'clinical_metabolic');
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 37 · Clinical & family history"
        title="Clinical information and family history"
        description="You control what is shared here. Imported clinical information is labelled with its source and last update date."
        actions={<Pill tone="blue" dot>Patient-maintained</Pill>}
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12px] font-semibold text-emerald-900" role="status">
          <CheckCircle2 className="h-4 w-4" /> History updated.
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
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 2600);
            }}
          >
            <Save className="h-4 w-4" /> Save history
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
                <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                  <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Imported information is read-only and used for context only. It does not alter your screening observations.
                </p>
              </>
            ) : (
              <p className="text-xs leading-5 text-slate-500">
                No clinical measurements are linked. Ask your care team about sharing recent measurements if relevant.
              </p>
            )}
          </Card>

          <Card>
            <SectionTitle title="Previous cognitive assessments" />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600">{health.previousAssessments}</span>
              <Pill tone="slate">Self-reported</Pill>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Previous assessment details should be confirmed with the clinician or service that performed them.
            </p>
          </Card>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <ClipboardList className="h-3.5 w-3.5" /> Data-source labels
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Patient-reported, patient-recorded, and imported clinical values are shown separately so clinicians know where each value came from.
            </p>
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


