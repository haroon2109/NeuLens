import type { FC, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { HealthcareScene, type SceneKind } from '../../../components/illustrations/HealthcareScene';

export const formatDate = (value?: string | Date | null, options?: Intl.DateTimeFormatOptions) => {
  if (!value) return 'Not available';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-GB', options || { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value?: string | Date | null) => {
  if (!value) return 'Not available';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return 'Not available';
  return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
};

export type Tone = 'blue' | 'green' | 'amber' | 'rose' | 'slate' | 'violet';

const toneClasses: Record<Tone, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  rose: 'border-rose-200 bg-rose-50 text-rose-800',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-800'
};

export const Pill: FC<{ children: ReactNode; tone?: Tone; dot?: boolean }> = ({
  children,
  tone = 'slate',
  dot = false
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export const PortalPageHeader: FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
}> = ({ eyebrow, title, description, actions, icon: Icon }) => (
  <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && (
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-blue-700">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {eyebrow}
        </div>
      )}
      <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[30px]">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-600">{description}</p>
      )}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

export const Card: FC<{ children: ReactNode; className?: string; padded?: boolean }> = ({ children, className = '', padded = true }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-28px_rgba(15,23,42,0.35)] ${padded ? 'p-5' : ''} ${className}`}>
    {children}
  </section>
);

export const SectionTitle: FC<{ title: string; detail?: string; action?: ReactNode }> = ({
  title,
  detail,
  action
}) => (
  <div className="mb-4 flex items-start justify-between gap-4">
    <div>
      <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
      {detail && <p className="mt-1 text-[12px] leading-5 text-slate-500">{detail}</p>}
    </div>
    {action}
  </div>
);

export const StatCard: FC<{
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: Tone;
}> = ({ label, value, detail, icon: Icon, tone = 'blue' }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</span>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${toneClasses[tone]}`}>
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
    </div>
    <p className="mt-3 text-[21px] font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
    {detail && <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>}
  </div>
);

export const InfoRow: FC<{ label: string; value: ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
    <dt className="text-[12px] text-slate-500">{label}</dt>
    <dd className="max-w-[60%] text-right text-[12px] font-semibold text-slate-800">{value}</dd>
  </div>
);

export const EmptyState: FC<{
  icon: LucideIcon;
  title: string;
  detail: string;
  action?: ReactNode;
  /** Optional scene from the NeuLens cast; shown instead of the icon. */
  scene?: SceneKind;
}> = ({ icon: Icon, title, detail, action, scene }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center">
    {scene ? (
      <HealthcareScene kind={scene} className="mx-auto mb-1 w-full max-w-[240px]" />
    ) : (
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
    )}
    <p className="mt-3 text-[14px] font-semibold text-slate-800">{title}</p>
    <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-slate-500">{detail}</p>
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);

export const Toggle: FC<{
  label: string;
  detail?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}> = ({ label, detail, checked, onChange, disabled }) => (
  <label className={`flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-3.5 ${disabled ? 'opacity-70' : 'cursor-pointer hover:border-slate-300'}`}>
    <span>
      <span className="block text-[12px] font-semibold text-slate-800">{label}</span>
      {detail && <span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span>}
    </span>
    <span
      className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </span>
  </label>
);

export const TrendLine: FC<{
  points: Array<{ label: string; value: number }>;
  min?: number;
  max?: number;
  tone?: string;
  height?: number;
  valueSuffix?: string;
}> = ({ points, min, max, tone = '#2563EB', height = 150, valueSuffix = '' }) => {
  if (points.length < 2) {
    return (
      <div className="flex h-[150px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">
        More valid sessions are needed to show a trend.
      </div>
    );
  }

  const values = points.map((point) => point.value);
  const low = min ?? Math.min(...values) - 2;
  const high = max ?? Math.max(...values) + 2;
  const range = Math.max(high - low, 1);
  const width = 340;
  const padding = { left: 12, right: 12, top: 16, bottom: 26 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const coords = points.map((point, index) => {
    const x = padding.left + (index / (points.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((point.value - low) / range) * chartHeight;
    return { ...point, x, y };
  });

  const path = coords.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[150px] w-full" role="img" aria-label="Trend chart">
      {[0, 1, 2].map((line) => {
        const y = padding.top + (line / 2) * chartHeight;
        return (
          <line
            key={line}
            x1={padding.left}
            x2={width - padding.right}
            y1={y}
            y2={y}
            stroke="#E2E8F0"
            strokeDasharray="3 5"
          />
        );
      })}
      <polyline
        points={path}
        fill="none"
        stroke={tone}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle cx={point.x} cy={point.y} r="4" fill="white" stroke={tone} strokeWidth="2.5" />
          <title>{`${point.label}: ${point.value}${valueSuffix}`}</title>
        </g>
      ))}
      {points.map((point, index) => (
        <text
          key={`${point.label}-label-${index}`}
          x={coords[index].x}
          y={height - 6}
          textAnchor="middle"
          fontSize="8.5"
          fill="#94A3B8"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
};

export const ScoreDial: FC<{ value: number; label: string; tone?: string }> = ({
  value,
  label,
  tone = '#2563EB'
}) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex h-[116px] w-[116px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <span className="block text-[22px] font-semibold leading-none text-slate-900">{Math.round(clamped)}</span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</span>
      </div>
    </div>
  );
};

export const AssessmentStatusPill: FC<{ reviewStatus: string; status?: string }> = ({
  reviewStatus,
  status = 'COMPLETED'
}) => {
  if (status !== 'COMPLETED') return <Pill tone="amber" dot>In progress</Pill>;
  if (reviewStatus === 'REVIEWED') return <Pill tone="green" dot>Reviewed</Pill>;
  if (reviewStatus === 'FOLLOWUP_REQUIRED') return <Pill tone="amber" dot>Follow-up suggested</Pill>;
  return <Pill tone="blue" dot>Awaiting review</Pill>;
};
