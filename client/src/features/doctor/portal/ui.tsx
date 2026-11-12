import type { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Brain,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  Info,
  Route,
  Send,
  ShieldAlert,
  TrendingUp
} from 'lucide-react';
import { Pill } from '../../patient/portal/ui';

export {
  Card,
  EmptyState,
  InfoRow,
  Pill,
  ScoreDial,
  SectionTitle,
  StatCard,
  Toggle,
  TrendLine,
  formatDate,
  formatDateTime
} from '../../patient/portal/ui';
export type { Tone } from '../../patient/portal/ui';

export const primaryButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
export const secondaryButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
export const dangerButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2';
export const fieldClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[12px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
export const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700';

export const DoctorPageHeader: FC<{
  screen: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}> = ({ screen, title, description, actions }) => (
  <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{screen}</p>
      <h1 className="mt-2 text-[25px] font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-[29px]">
        {title}
      </h1>
      {description && <p className="mt-2 max-w-3xl text-[12px] leading-6 text-slate-600">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

export const RiskPill: FC<{ risk?: string | null }> = ({ risk }) => {
  const value = (risk || 'PENDING').toUpperCase();
  if (value === 'HIGH') return <Pill tone="rose" dot>Higher concern</Pill>;
  if (value === 'MODERATE') return <Pill tone="amber" dot>Monitor</Pill>;
  if (value === 'LOW') return <Pill tone="green" dot>Lower concern</Pill>;
  return <Pill tone="slate">Not screened</Pill>;
};

export const ReviewPill: FC<{ status?: string | null }> = ({ status }) => {
  switch ((status || '').toUpperCase()) {
    case 'REVIEWED':
      return <Pill tone="green" dot>Reviewed</Pill>;
    case 'FOLLOWUP_REQUIRED':
      return <Pill tone="amber" dot>Follow-up suggested</Pill>;
    case 'PENDING_REVIEW':
      return <Pill tone="blue" dot>Awaiting review</Pill>;
    default:
      return <Pill tone="slate">Not reviewed</Pill>;
  }
};

export const ChangePill: FC<{ status?: string | null }> = ({ status }) => {
  switch (status) {
    case 'REVIEW':
      return <Pill tone="amber" dot>Review prompt</Pill>;
    case 'NO_CHANGE':
      return <Pill tone="green" dot>Stable</Pill>;
    default:
      return <Pill tone="slate">More comparisons needed</Pill>;
  }
};

const workflowItems = [
  { suffix: '', label: 'Summary', icon: ClipboardList, end: true },
  { suffix: '/review', label: 'Assessment review', icon: FileText },
  { suffix: '/longitudinal', label: 'Longitudinal', icon: TrendingUp },
  { suffix: '/change-detection', label: 'Change review', icon: Activity },
  { suffix: '/context', label: 'Health context', icon: HeartPulse },
  { suffix: '/notes', label: 'Notes & findings', icon: Brain },
  { suffix: '/care-plan', label: 'Care plan', icon: CalendarCheck },
  { suffix: '/referrals', label: 'Referrals', icon: Send },
  { suffix: '/appointments', label: 'Appointments', icon: CalendarDays }
];

export const PatientWorkflowNav: FC<{ patientId: string }> = ({ patientId }) => (
  <nav className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1" aria-label="Patient record sections">
    {workflowItems.map(({ suffix, label, icon: Icon, end }) => (
      <NavLink
        key={suffix || 'summary'}
        to={`/doctor/patients/${patientId}${suffix}`}
        end={end}
        className={({ isActive }) =>
          `inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
            isActive ? 'bg-blue-50 text-blue-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`
        }
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </NavLink>
    ))}
  </nav>
);

export const Notice: FC<{
  tone?: 'info' | 'warning' | 'success' | 'danger';
  title: string;
  children: ReactNode;
}> = ({ tone = 'info', title, children }) => {
  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-950',
    warning: 'border-amber-200 bg-amber-50 text-amber-950',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    danger: 'border-rose-200 bg-rose-50 text-rose-950'
  }[tone];
  const Icon = tone === 'warning' ? AlertTriangle : tone === 'success' ? CheckCircle2 : tone === 'danger' ? ShieldAlert : Info;
  return (
    <div className={`rounded-xl border p-3.5 ${styles}`}>
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-xs font-bold">{title}</p>
          <div className="mt-1 text-xs leading-5 opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const MetricTile: FC<{ label: string; value: string; detail?: string }> = ({
  label,
  value,
  detail
}) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    <p className="mt-1.5 text-[16px] font-semibold tracking-[-0.02em] text-slate-900">{value}</p>
    {detail && <p className="mt-0.5 text-xs leading-4 text-slate-500">{detail}</p>}
  </div>
);

export const iconForDomain: Record<string, typeof Brain> = {
  cognitive: Brain,
  ocular: Route,
  vocal: Activity,
  facial: HeartPulse,
  functional: ClipboardList
};
