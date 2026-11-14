import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  HeartPulse,
  Info,
  MapPin,
  Printer,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video
} from 'lucide-react';
import { treatmentTeam, usePatientPortalStore, type PortalNotification } from '../../../store/patientPortalStore';
import { patientPortalApi } from '../../../services/patientPortalApi';
import { HealthcareScene } from '../../../components/illustrations/HealthcareScene';
import { MotionReveal } from '../../../components/motion/Reveal';
import {
  Card,
  EmptyState,
  Pill,
  PortalPageHeader,
  SectionTitle,
  formatDate,
  formatDateTime
} from './ui';

const primaryButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl pp-btn-primary';
const secondaryButton =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl pp-btn-secondary';

const appointmentTone = (status: string) => {
  if (status === 'CANCELLED') return 'rose' as const;
  if (status === 'COMPLETED') return 'sage' as const;
  if (status === 'RESCHEDULED') return 'amber' as const;
  return 'forestSoft' as const;
};

// ---------------------------------------------------------------------------
// Screen 38 — Appointments
// ---------------------------------------------------------------------------
export const AppointmentsPage: React.FC = () => {
  const { appointments, cancelAppointment, rescheduleAppointment } = usePatientPortalStore();
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:30');
  const [error, setError] = useState('');

  // Appointment changes are written to the server first, then reflected locally.
  const cancelOnServer = async (id: string) => {
    setError('');
    try {
      await patientPortalApi.updateAppointment(id, { status: 'CANCELLED' });
      cancelAppointment(id);
    } catch (err: any) {
      setError(err.message || 'The appointment could not be cancelled. Please contact the clinic.');
    }
  };

  const rescheduleOnServer = async (id: string) => {
    if (!newDate) return;
    setError('');
    try {
      await patientPortalApi.updateAppointment(id, { status: 'RESCHEDULED', date: newDate, time: newTime });
      rescheduleAppointment(id, newDate, newTime);
      setRescheduling(null);
    } catch (err: any) {
      setError(err.message || 'The new time could not be saved. Please contact the clinic.');
    }
  };

  const upcoming = appointments.filter((item) => item.status === 'UPCOMING' || item.status === 'RESCHEDULED');
  const past = appointments.filter((item) => !['UPCOMING', 'RESCHEDULED'].includes(item.status));

  const beginReschedule = (id: string, date: string, time: string) => {
    setRescheduling(id);
    setNewDate(date);
    setNewTime(time);
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 38 · Appointments"
        title="Appointments and clinic visits"
        description="Upcoming reviews, past visits, and your clinician's contact details in one place."
        actions={<Pill tone="green" dot>{upcoming.length} upcoming</Pill>}
      />

      <MotionReveal className="mx-auto w-full max-w-2xl">
        <HealthcareScene
          kind="followup"
          className="w-full"
          title="Margaret meeting Dr. Rahman for a follow-up consultation"
        />
      </MotionReveal>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[12px] font-semibold text-rose-800" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <SectionTitle title="Upcoming appointments" detail="Arrive a few minutes early for in-person visits." />
            {upcoming.length === 0 ? (
              <EmptyState scene="emptyAppointments" icon={CalendarDays} title="No upcoming appointments" detail="Your care team will add follow-up visits here." />
            ) : (
              <div className="space-y-3">
                {upcoming.map((appointment) => (
                  <div key={appointment.id} className="rounded-xl border border-line p-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-ink">{appointment.title}</p>
                        <p className="mt-0.5 text-xs text-muted">{appointment.clinician}</p>
                      </div>
                      <Pill tone={appointmentTone(appointment.status)} dot>{appointment.status.toLowerCase()}</Pill>
                    </div>
                    <div className="mt-2.5 grid gap-2 text-xs text-body sm:grid-cols-2">
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-muted" /> {formatDate(appointment.date)} · {appointment.time}</span>
                      <span className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" /> {appointment.location}</span>
                    </div>
                    {appointment.notes && <p className="mt-2 rounded-lg bg-warm px-2.5 py-1.5 text-xs leading-5 text-muted">{appointment.notes}</p>}

                    {rescheduling === appointment.id ? (
                      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/60 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.07em] text-blue-800">Choose a new time</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <input
                            type="date"
                            aria-label="New appointment date"
                            value={newDate}
                            min={new Date().toISOString().slice(0, 10)}
                            onChange={(event) => setNewDate(event.target.value)}
                            className="rounded-lg border border-line bg-white px-2.5 py-2 text-xs"
                          />
                          <input
                            type="time"
                            aria-label="New appointment time"
                            value={newTime}
                            onChange={(event) => setNewTime(event.target.value)}
                            className="rounded-lg border border-line bg-white px-2.5 py-2 text-xs"
                          />
                          <button
                            type="button"
                            className={primaryButton}
                            onClick={() => void rescheduleOnServer(appointment.id)}
                          >
                            Confirm
                          </button>
                          <button type="button" className={secondaryButton} onClick={() => setRescheduling(null)}>Cancel</button>
                        </div>
                        <p className="mt-1.5 text-xs text-blue-900/70">Your care team will see the new time. Contact the clinic if you need to change it again.</p>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-2.5">
                        <button type="button" className="text-xs font-bold text-blue-700 hover:underline" onClick={() => beginReschedule(appointment.id, appointment.date, appointment.time)}>
                          Reschedule
                        </button>
                        <span className="text-slate-300">·</span>
                        <button type="button" className="text-xs font-semibold text-rose-700 hover:underline" onClick={() => void cancelOnServer(appointment.id)}>
                          Cancel appointment
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title="Previous appointments" />
            <ul className="divide-y divide-slate-100">
              {past.map((appointment) => (
                <li key={appointment.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{appointment.title}</p>
                    <p className="text-xs text-muted">{formatDate(appointment.date)} · {appointment.clinician}</p>
                  </div>
                  <Pill tone={appointmentTone(appointment.status)}>{appointment.status.toLowerCase()}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Your clinic" />
            <p className="text-[12px] font-semibold text-ink">{treatmentTeam.doctor}</p>
            <p className="mt-0.5 text-xs text-muted">{treatmentTeam.role}</p>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" /><dd className="text-body">{treatmentTeam.institution}<br />{treatmentTeam.department}<br />Block B, Suite 400</dd></div>
              <div className="flex items-center gap-2"><Stethoscope className="h-3.5 w-3.5 text-muted" /><dd className="text-body">{treatmentTeam.phone}</dd></div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`mailto:${treatmentTeam.email}`} className={secondaryButton}>Email clinic</a>
              <Link to="/patient/help" className={secondaryButton}>Get help</Link>
            </div>
          </Card>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Video className="h-3.5 w-3.5" /> Telehealth visits
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-900/80">
              A secure video link appears 15 minutes before a telehealth appointment. No link is shared by email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 39 — My Care Plan
// ---------------------------------------------------------------------------
export const CarePlanPage: React.FC = () => {
  const { carePlan, toggleCareStep } = usePatientPortalStore();

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 39 · My care plan"
        title="Your clinician-approved plan"
        description="Next steps agreed with your care team. Ticking a step is a personal reminder — it does not change your clinical plan."
        actions={<Pill tone="green" dot>Approved by {carePlan.approvedBy}</Pill>}
      />

      <MotionReveal className="mx-auto w-full max-w-2xl">
        <HealthcareScene
          kind="walkingOutdoors"
          className="w-full"
          title="Margaret taking a gentle walk outdoors with her caregiver"
        />
      </MotionReveal>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <SectionTitle title="Plan progress" detail={`Approved ${formatDate(carePlan.approvedAt)} · next review ${formatDate(carePlan.nextReview)}`} />
          <div className="flex items-center gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${carePlan.progress}%` }} />
            </div>
            <span className="text-[12px] font-bold text-emerald-700">{carePlan.progress}%</span>
          </div>

          <ol className="mt-4 space-y-2.5">
            {carePlan.steps.map((step) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => toggleCareStep(step.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                    step.done ? 'border-emerald-200 bg-emerald-50/60' : 'border-line hover:border-slate-300'
                  }`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    step.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent'
                  }`}>
                    <Check className="h-3 w-3" />
                  </span>
                  <span>
                    <span className={`block text-[12px] font-semibold ${step.done ? 'text-emerald-950' : 'text-slate-800'}`}>{step.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted">{step.detail}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Monitoring schedule" />
            <dl className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-3"><dt className="text-muted">Next assessment</dt><dd className="font-semibold text-slate-800">{formatDate(carePlan.nextReview)}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-muted">Recommended follow-up</dt><dd className="font-semibold text-slate-800">{treatmentTeam.nextReview}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-muted">Repeat interval</dt><dd className="font-semibold text-slate-800">About 4 weeks</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-muted">Clinician</dt><dd className="font-semibold text-slate-800">{treatmentTeam.doctor}</dd></div>
            </dl>
            <Link to="/patient/assessment/intro" className={`${primaryButton} mt-3`}>Start scheduled assessment</Link>
          </Card>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Info className="h-3.5 w-3.5" /> Clinician-led
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-900/80">
              Only your qualified clinician confirms next steps. This plan is a summary of that discussion, not a new recommendation.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <SectionTitle title="Brain-health education" detail="Short, practical reading chosen by your care team." />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: HeartPulse, title: 'Sleep and memory', detail: 'A regular sleep routine can support attention and memory. Small changes are worth discussing with your clinician.' },
            { icon: Sparkles, title: 'Staying active', detail: 'Gentle, regular movement supports general brain health. Choose what feels safe and enjoyable.' },
            { icon: BookOpen, title: 'Tracking changes', detail: 'A consistent screening routine helps separate day-to-day variation from patterns worth reviewing.' }
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-xl border border-line p-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon className="h-4 w-4" /></span>
              <p className="mt-2 text-xs font-semibold text-ink">{title}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 40 — Notifications
// ---------------------------------------------------------------------------
const categoryIcon = (category: PortalNotification['category']) => {
  if (category === 'APPOINTMENT') return CalendarDays;
  if (category === 'REVIEW') return Stethoscope;
  if (category === 'CARE_PLAN') return ShieldCheck;
  if (category === 'ACCOUNT') return Bell;
  return FileText;
};

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePatientPortalStore();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const shown = filter === 'UNREAD' ? notifications.filter((item) => !item.read) : notifications;
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 40 · Notifications"
        title="Updates from your care team"
        description="Assessment reminders, appointment changes, clinician review updates, and account notices."
        actions={
          <button type="button" className={secondaryButton} onClick={markAllNotificationsRead} disabled={unread === 0}>
            <CheckCircle2 className="h-4 w-4" /> Mark all as read
          </button>
        }
      />

      <div className="flex gap-1.5">
        {(['ALL', 'UNREAD'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === value ? 'bg-blue-700 text-white' : 'border border-line bg-white text-body hover:bg-warm'
            }`}
          >
            {value === 'ALL' ? 'All' : `Unread (${unread})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState scene="emptyNotifications" icon={Bell} title="No notifications" detail="You are all caught up." />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-slate-100">
            {shown.map((item) => {
              const Icon = categoryIcon(item.category);
              return (
                <li key={item.id} className={`flex gap-3 p-4 ${item.read ? '' : 'bg-blue-50/30'}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.read ? 'bg-slate-100 text-muted' : 'bg-blue-100 text-blue-700'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-[12px] font-semibold text-ink">{item.title}</p>
                      {!item.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />}
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-muted">{item.detail}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.06em] text-muted">{formatDateTime(item.date)}</span>
                      {!item.read && (
                        <button type="button" onClick={() => markNotificationRead(item.id)} className="text-xs font-bold text-blue-700 hover:underline">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 41 — My Reports & Documents
// ---------------------------------------------------------------------------
export const DocumentsPage: React.FC = () => {
  const { documents, logDocumentAccess, documentAccess } = usePatientPortalStore();

  const download = (title: string, summary: string, date: string) => {
    const text = `NEULENS PATIENT PORTAL\n${title}\n${date}\n\n${summary}\n\nThis document is screening support, not a diagnosis. Please discuss with your qualified clinician.\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 41 · My reports & documents"
        title="Reports and documents"
        description="Session summaries, clinician-shared reports, and care-plan documents. Access is logged for your transparency."
        actions={<Pill tone="slate">{documents.length} documents</Pill>}
      />

      <Card className="p-0">
        <ul className="divide-y divide-slate-100">
          {documents.map((document) => (
            <li key={document.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-ink">{document.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{document.type} · {formatDate(document.date)}</p>
                  <p className="mt-1 max-w-lg text-xs leading-5 text-muted">{document.summary}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={document.status === 'Available' ? 'green' : 'amber'} dot>{document.status}</Pill>
                <button
                  type="button"
                  onClick={() => {
                    logDocumentAccess(document.id);
                    window.print();
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-body hover:bg-warm"
                  aria-label={`Print ${document.title}`}
                >
                  <Printer className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logDocumentAccess(document.id);
                    download(document.title, document.summary, document.date);
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-bold text-body hover:bg-warm"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Document access history" detail="Records of when you opened a document." />
          {documentAccess.length ? (
            <ul className="space-y-2">
              {documentAccess.map((entry, index) => (
                <li key={`${entry.id}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                  <span className="truncate text-xs text-body">{entry.title}</span>
                  <span className="shrink-0 text-xs text-muted">{formatDateTime(entry.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs leading-5 text-muted">No document access has been recorded yet.</p>
          )}
        </Card>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Clock3 className="h-3.5 w-3.5" /> Pending review
          </p>
          <p className="mt-1 text-xs leading-5 text-blue-900/80">
            A session summary becomes final after clinician review. You can still view the current observations and quality report.
          </p>
          <Link to="/patient/assessment/report" className={`${primaryButton} mt-3`}>View latest summary</Link>
        </div>
      </div>
    </div>
  );
};
