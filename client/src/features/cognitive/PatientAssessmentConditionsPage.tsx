import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  Brain,
  ClipboardList,
  Info,
  Languages,
  Moon,
  ShieldCheck,
  UserRound
} from 'lucide-react';
import { Card, EmptyState, Pill, PortalPageHeader, formatDate } from '../patient/portal/ui';
import { usePatientPortalStore } from '../../store/patientPortalStore';
import { cognitiveApi, type CognitiveSessionRecord, type SessionContext } from './cognitiveApi';
import { DOMAIN_LABEL } from './types';

const label = (value: string | null | undefined) =>
  value == null || value === '' ? 'Not reported' : value.charAt(0).toUpperCase() + value.slice(1);

const yesNo = (value: number | null, suffix = '') =>
  value == null ? 'Not reported' : `${value}${suffix}`;

export const PatientAssessmentConditionsPage: React.FC = () => {
  const { accessibility, sleep, wellbeing } = usePatientPortalStore();
  const [context, setContext] = useState<SessionContext | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [sessions, setSessions] = useState<CognitiveSessionRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([cognitiveApi.getContext(), cognitiveApi.getHistory()])
      .then(([contextResult, history]) => {
        if (cancelled) return;
        setContext(contextResult.context);
        setMissing(contextResult.missingFields);
        setSessions(history.sessions);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Context information could not be loaded.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const reportedBadge = <Pill tone="sage">Patient-reported</Pill>;
  const recordedBadge = <Pill tone="forestSoft">Recorded at registration</Pill>;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Health context · Assessment conditions"
        title="Your assessment context"
        description="What you have reported about sleep, fatigue, mood and accessibility, kept separate from measured observations. Missing information stays missing."
        actions={<Link to="/patient/cognitive" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white">Start assessment <ArrowRight className="h-4 w-4" /></Link>}
      />

      {error && <p className="rounded-xl border border-amber/60 bg-amber/10 p-3 text-sm text-amber-900">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <UserRound className="h-4 w-4 text-sage-deep" /> Profile
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">{recordedBadge}</div>
          <dl className="mt-3 space-y-1.5 text-sm">
            {[
              ['Age', context?.age == null ? 'Not recorded' : `${context.age} years`],
              ['Education', context?.educationYears == null ? 'Not recorded' : `${context.educationYears} years`],
              ['Preferred language', context?.language === 'en' ? 'English' : context?.language?.toUpperCase() || 'Not recorded']
            ].map(([term, value]) => (
              <div key={term} className="flex justify-between gap-3">
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 flex gap-1.5 text-[13px] leading-5 text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Age and education are used to choose suitable task variants and reference context. They never automatically lower difficulty.
          </p>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Moon className="h-4 w-4 text-sage-deep" /> Sleep, fatigue and mood
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">{reportedBadge}</div>
          <dl className="mt-3 space-y-1.5 text-sm">
            {[
              ['Sleep last night', context?.sleepHours == null ? (sleep.durationHours || 'Not reported') : `${context.sleepHours} hours`],
              ['Sleep quality', context?.sleepQuality == null ? (sleep.quality || 'Not reported') : `${context.sleepQuality} / 5`],
              ['Fatigue', context?.fatigue == null ? 'Not reported' : `${context.fatigue} / 5`],
              ['Mood', context?.mood == null ? (wellbeing.mood || 'Not reported') : `${context.mood} / 5`],
              ['Stress', context?.stress == null ? (wellbeing.stress || 'Not reported') : `${context.stress} / 5`]
            ].map(([term, value]) => (
              <div key={term} className="flex justify-between gap-3">
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-semibold text-ink">{String(value)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 rounded-xl border border-mint bg-mint/50 p-2.5 text-[13px] leading-5 text-forest">
            These factors are recorded as interpretation context. They do not lower the task difficulty or adjust your score.
          </p>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Accessibility className="h-4 w-4 text-sage-deep" /> Sensory and access
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">{reportedBadge}</div>
          <dl className="mt-3 space-y-1.5 text-sm">
            {[
              ['Vision', label(context?.vision)],
              ['Hearing', label(context?.hearing)],
              ['Movement / motor', label(context?.motor)],
              ['Device familiarity', label(context?.digitalFamiliarity)],
              ['Device', label(context?.device)],
              ['Text size preference', label(accessibility.textSize)],
              ['High contrast', accessibility.highContrast ? 'On' : 'Off']
            ].map(([term, value]) => (
              <div key={term} className="flex justify-between gap-3">
                <dt className="text-muted">{term}</dt>
                <dd className="text-right font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      {missing.length > 0 && (
        <div className="rounded-2xl border border-amber/60 bg-amber/10 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4" /> Missing information is kept missing
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-900/85">
            Not yet reported: {missing.join(', ')}. The assessment engine does not infer these values. They can be recorded at the start of an assessment or by your clinician.
          </p>
        </div>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <ClipboardList className="h-4 w-4 text-forest" /> Previous cognitive assessments
          </h2>
          <Pill tone="sage">Recorded sessions</Pill>
        </div>
        {sessions.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="No cognitive sessions yet"
            detail="Completed cognitive assessments will appear here with their mode, completion and data-quality status."
            action={<Link to="/patient/cognitive" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white">Start an assessment</Link>}
          />
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs">
              <thead>
                <tr className="border-b border-line text-[12px] uppercase tracking-wide text-sage-deep">
                  <th className="py-2 pr-3">Date</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2">Completed</th>
                  <th className="px-3 py-2">Domains</th>
                  <th className="px-3 py-2">Comparison</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.sessionId} className="border-b border-line/70 last:border-0">
                    <td className="py-2.5 pr-3 font-semibold text-ink">{formatDate(session.completedAt)}</td>
                    <td className="px-3 py-2.5">
                      <Pill tone={session.mode === 'STANDARDIZED' ? 'forestSoft' : 'amber'}>
                        {session.mode === 'STANDARDIZED' ? 'Standardized' : 'Exploratory'}
                      </Pill>
                    </td>
                    <td className="px-3 py-2.5 text-muted">
                      {session.tasks.filter((task) => task.completed).length} of {session.tasks.length}
                    </td>
                    <td className="px-3 py-2.5 text-muted">
                      {session.domains.map((domain) => DOMAIN_LABEL[domain.domain]).join(', ')}
                    </td>
                    <td className="px-3 py-2.5">
                      <Pill tone={session.quality.comparable ? 'forestSoft' : 'amber'}>
                        {session.quality.comparable ? 'Comparable' : 'Not comparable'}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 flex items-start gap-1.5 text-[13px] leading-5 text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Exploratory and standardized sessions are stored separately. Only standardized sessions within the same protocol can be compared over time.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Languages className="h-4 w-4 text-sage-deep" /> Language
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Your portal language preference is {context?.language?.toUpperCase() || 'not recorded'}.
          </p>
          <p className="mt-2 rounded-xl border border-line bg-warm/60 p-3 text-[13px] leading-5 text-muted">
            This research build administers task instructions and stimuli in English. Arabic, Tamil, Hindi, Telugu, Malayalam and Kannada are offered for portal navigation, consent and results, but their task instructions are marked pending independent back-translation, cognitive pretesting and local clinical review. They are never presented as validated translations.
          </p>
        </Card>
        <Card>
          <h2 className="text-base font-semibold text-ink">Measured observations</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            No measured observations are inferred on this page. Task-level accuracy, response times, errors and missing responses are recorded during a session and shown in the session summary and clinician workspace.
          </p>
          <Link to="/patient/history" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-warm">
            Open assessment history <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
};
