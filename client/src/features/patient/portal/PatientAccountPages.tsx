import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Database,
  Download,
  Globe2,
  Info,
  Laptop,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Monitor,
  Phone,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  Type,
  UserRound
} from 'lucide-react';
import { treatmentTeam } from '../../../store/patientPortalStore';
import { useAuthStore } from '../../../store/authStore';
import { usePatientPortalStore } from '../../../store/patientPortalStore';
import { Card, InfoRow, Pill, PortalPageHeader, SectionTitle, Toggle, formatDate, formatDateTime } from './ui';
import { ConsentWithdrawnState } from '../../../components/systemStates';

const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-[14px] font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-[14px] font-semibold text-body transition hover:bg-warm';
const dangerButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-[14px] font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40';
const fieldClass =
  'w-full rounded-xl border border-line bg-warm px-3.5 py-2.5 text-[14px] text-slate-800 outline-none transition placeholder:text-muted focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';
const labelClass = 'mb-1.5 block text-[14px] font-semibold text-body';

// ---------------------------------------------------------------------------
// Screen 42 — My Profile
// ---------------------------------------------------------------------------
export const MyProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { personal, setPersonal, health } = usePatientPortalStore();
  const [saved, setSaved] = useState(false);

  const displayName = personal.fullName || user?.name || 'Patient';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const save = () => {
    if (personal.fullName.trim()) updateUser({ name: personal.fullName.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 42 · My profile"
        title="Your details"
        description="Keep your contact and accessibility information up to date. Your patient ID is managed by the hospital and cannot be edited here."
        actions={
          <button type="button" className={secondaryButton} onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
            <SlidersHorizontal className="h-4 w-4" /> Accessibility
          </button>
        }
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[14px] font-semibold text-emerald-900" role="status">
          <CheckCircle2 className="h-4 w-4" /> Profile details saved.
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[17px] font-bold text-blue-800">{initials}</span>
            <div>
              <p className="text-[16px] font-semibold text-ink">{displayName}</p>
              <p className="mt-0.5 text-xs text-muted">{user?.email || personal.email || 'No email on record'}</p>
              <p className="mt-1 font-mono text-xs text-muted">{user?.patientId || '—'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="green" dot>Patient</Pill>
            <Pill tone="slate">Verified account</Pill>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <SectionTitle title="Personal information" detail="Used to personalise screening guidance." />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="profile-name">Full name</label>
              <input id="profile-name" className={fieldClass} value={personal.fullName} onChange={(event) => setPersonal({ fullName: event.target.value })} autoComplete="name" />
            </div>
            <div>
              <label className={labelClass} htmlFor="profile-dob">Date of birth</label>
              <input id="profile-dob" type="date" className={fieldClass} value={personal.dateOfBirth} onChange={(event) => setPersonal({ dateOfBirth: event.target.value })} autoComplete="bday" />
            </div>
            <div>
              <label className={labelClass} htmlFor="profile-language">Preferred language</label>
              <select id="profile-language" className={fieldClass} value={personal.language} onChange={(event) => setPersonal({ language: event.target.value })}>
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
              <label className={labelClass} htmlFor="profile-education">Education level</label>
              <select id="profile-education" className={fieldClass} value={personal.education} onChange={(event) => setPersonal({ education: event.target.value })}>
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
              <label className={labelClass} htmlFor="profile-phone">Phone number</label>
              <input id="profile-phone" type="tel" className={fieldClass} value={personal.phone} onChange={(event) => setPersonal({ phone: event.target.value })} autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="profile-email">Email address</label>
              <input id="profile-email" type="email" className={fieldClass} value={personal.email} onChange={(event) => setPersonal({ email: event.target.value })} autoComplete="email" />
              <p className="mt-1.5 text-xs leading-5 text-muted">Changing your sign-in email requires identity verification. Contact the clinic from Help &amp; Support.</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-warm/70 p-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Emergency contact</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="profile-emergency-name">Contact name</label>
                <input id="profile-emergency-name" className={fieldClass} value={personal.emergencyName} onChange={(event) => setPersonal({ emergencyName: event.target.value })} />
              </div>
              <div>
                <label className={labelClass} htmlFor="profile-emergency-phone">Contact phone</label>
                <input id="profile-emergency-phone" type="tel" className={fieldClass} value={personal.emergencyPhone} onChange={(event) => setPersonal({ emergencyPhone: event.target.value })} />
              </div>
            </div>
          </div>

          <button type="button" className={`${primaryButton} mt-4`} onClick={save}>
            <Save className="h-4 w-4" /> Save profile
          </button>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Care team" />
            <p className="text-[14px] font-semibold text-ink">{treatmentTeam.doctor || (user as any)?.assignedDoctor || 'Assigned care team'}</p>
            <p className="text-xs text-muted">{treatmentTeam.role || 'Neurology & Cognitive Health'}</p>
            <dl className="mt-3">
              <InfoRow label="Hospital" value={treatmentTeam.institution || 'Clinic'} />
              <InfoRow label="Department" value={treatmentTeam.department || 'Cognitive Health OPD'} />
              <InfoRow label="Patient ID" value={user?.patientId || '—'} />
              <InfoRow label="Onboarded" value={health.conditions.length ? 'Health background shared' : 'Health background pending'} />
            </dl>
            <Link to="/patient/appointments" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
              Contact clinic <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <div id="profile-accessibility" className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[14px] font-semibold text-ink">Accessibility at a glance</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="slate">{personal.language === 'en' ? 'English' : 'Preferred language set'}</Pill>
              <Pill tone="blue">{health.sensory.length ? health.sensory.join(', ') : 'No sensory needs noted'}</Pill>
            </div>
            <Link to="/patient/settings" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">
              Adjust accessibility settings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 43 — Account Settings
// ---------------------------------------------------------------------------
export const AccountSettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { account, setAccount, accessibility, setAccessibility, privacy, removeDevice } = usePatientPortalStore();
  const [saved, setSaved] = useState(false);

  const otherDevices = privacy.connectedDevices.filter((device) => device.id !== 'dev-1');

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 43 · Account settings"
        title="Account preferences"
        description="Manage security, notifications, language, and display settings. Clinical records are not changed from this page."
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[14px] font-semibold text-emerald-900" role="status">
          <CheckCircle2 className="h-4 w-4" /> Preferences saved.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Sign-in & security" />
          <div className="space-y-3">
            <div className="rounded-xl border border-line p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Email address</p>
                  <p className="mt-0.5 text-xs text-muted">{user?.email || 'No email on record'}</p>
                </div>
                <Pill tone="green" dot>Verified</Pill>
              </div>
            </div>
            <div className="rounded-xl border border-line p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Password</p>
                  <p className="mt-0.5 text-xs text-muted">Last changed when your account was created.</p>
                </div>
                <Link to="/auth/forgot-password" className={secondaryButton}><Lock className="h-3.5 w-3.5" /> Change password</Link>
              </div>
            </div>
            <Toggle
              label="Two-step verification"
              detail="Ask for a one-time code in addition to your password at sign-in."
              checked={account.twoFactor}
              onChange={(value) => {
                setAccount({ twoFactor: value });
                setSaved(true);
                window.setTimeout(() => setSaved(false), 2000);
              }}
            />
            <div className="rounded-xl border border-line p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Laptop className="h-4 w-4 text-muted" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">This browser</p>
                    <p className="text-xs text-muted">Chrome on desktop · Active now</p>
                  </div>
                </div>
                <Pill tone="green" dot>Current</Pill>
              </div>
              {otherDevices.length > 0 && (
                <button
                  type="button"
                  className={`${dangerButton} mt-3 w-full`}
                  onClick={() => otherDevices.forEach((device) => removeDevice(device.id))}
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out other devices ({otherDevices.length})
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Notifications" detail="Clinical safety notices are always sent." />
          <div className="space-y-2.5">
            <Toggle
              label="Email updates"
              detail="Session summaries, clinician notes, and appointment reminders by email."
              checked={account.emailUpdates}
              onChange={(value) => setAccount({ emailUpdates: value })}
            />
            <Toggle
              label="SMS reminders"
              detail="Short reminders before appointments and scheduled assessments."
              checked={account.smsReminders}
              onChange={(value) => setAccount({ smsReminders: value })}
            />
            <div className="rounded-lg bg-warm px-3 py-2 text-xs leading-5 text-muted">
              <Info className="me-1 inline h-3 w-3" />
              Urgent account or safety notices cannot be switched off.
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Language & region" />
          <label className={labelClass} htmlFor="settings-language"><Globe2 className="me-1 inline h-3.5 w-3.5" /> Portal and assessment language</label>
          <select
            id="settings-language"
            className={fieldClass}
            value={accessibility.language}
            onChange={(event) => {
              setAccessibility({ language: event.target.value });
              setSaved(true);
              window.setTimeout(() => setSaved(false), 2000);
            }}
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
          </select>
          <p className="mt-2 text-xs leading-5 text-muted">
            Changing language affects new sessions. Previously completed sessions stay in their original language for comparability.
          </p>
        </Card>

        <Card>
          <SectionTitle title="Display & accessibility" action={<Accessibility className="h-4 w-4 text-muted" />} />
          <p className="mb-2 text-xs font-semibold text-body"><Type className="me-1 inline h-3.5 w-3.5" /> Text size</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'normal' as const, label: 'Standard' },
              { value: 'large' as const, label: 'Large' },
              { value: 'xlarge' as const, label: 'Largest' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={accessibility.textSize === option.value}
                onClick={() => setAccessibility({ textSize: option.value })}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                  accessibility.textSize === option.value
                    ? 'border-blue-300 bg-blue-50 text-blue-800'
                    : 'border-line bg-white text-body hover:border-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2.5">
            <Toggle label="High contrast" detail="Darker text and stronger borders." checked={accessibility.highContrast} onChange={(value) => setAccessibility({ highContrast: value })} />
            <Toggle label="Audio instructions" detail="Read activity guidance aloud during assessments." checked={accessibility.audioInstructions} onChange={(value) => setAccessibility({ audioInstructions: value })} />
            <Toggle label="Larger tap targets" detail="More spacing between controls on touchscreens." checked={accessibility.touchPreference === 'Large tap targets'} onChange={(value) => setAccessibility({ touchPreference: value ? 'Large tap targets' : 'Standard tap targets' })} />
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Account support" detail="Some account changes require the clinic to verify your identity." />
        <div className="flex flex-wrap gap-2">
          <Link to="/patient/help" className={secondaryButton}><LifeBuoy className="h-3.5 w-3.5" /> Help &amp; support</Link>
          <Link to="/patient/privacy" className={secondaryButton}><ShieldCheck className="h-3.5 w-3.5" /> Privacy &amp; data settings</Link>
          <Link to="/patient/profile" className={secondaryButton}><UserRound className="h-3.5 w-3.5" /> My profile</Link>
        </div>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 44 — Privacy & Data Settings
// ---------------------------------------------------------------------------
export const PrivacyDataPage: React.FC = () => {
  const { consent, privacy, setSharing, requestDeletion, removeDevice } = usePatientPortalStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const deviceIcon = (id: string) => {
    if (id.includes('shared')) return Monitor;
    if (id.includes('phone')) return Smartphone;
    return Laptop;
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 44 · Privacy & data settings"
        title="Your data, your choices"
        description="Review what you agreed to, control optional sharing, manage connected devices, and make data requests."
        actions={<Pill tone={consent.signedAt ? 'green' : 'amber'} dot>{consent.signedAt ? `Consent recorded ${formatDate(consent.signedAt)}` : 'Consent not recorded'}</Pill>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <SectionTitle title="Consent summary" detail="Required items keep screening safe and clinically meaningful." />
            <div className="space-y-2">
              {[
                ['Assessment responses and observations', consent.dataCollection, true],
                ['Camera and microphone use', consent.cameraMic, true],
                ['Secure processing and storage', consent.processing, true],
                ['Access by my care team', consent.clinicianAccess, true],
                ['Optional research and data sharing', consent.optionalSharing, false]
              ].map(([label, granted, required]) => (
                <div key={String(label)} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                  <span className="text-xs text-body">{label}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {!required && <span className="text-xs text-muted">optional</span>}
                    <Pill tone={granted ? 'green' : 'slate'}>{granted ? 'Granted' : 'Not granted'}</Pill>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-muted">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Required consent cannot be withdrawn while using the screening service. You may request account closure below.
            </p>
          </Card>

          <Card>
            <SectionTitle title="Optional data sharing" />
            <Toggle
              label="De-identified research sharing"
              detail="Allow de-identified assessment observations to support service improvement and research. This never includes your name, contact details, or raw video/audio."
              checked={privacy.optionalSharing}
              onChange={setSharing}
            />
            <p className="mt-2 text-xs leading-5 text-muted">
              Turning this off stops future research use. It does not remove data already included in a completed, de-identified dataset.
            </p>
            {!privacy.optionalSharing && (
              <div className="mt-3">
                <ConsentWithdrawnState
                  withdrawn={['De-identified research sharing']}
                  effectiveNote="Research sharing is switched off. Your screening and clinical care continue exactly as before, and no new observations are shared for research."
                  onRestore={() => setSharing(true)}
                />
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title="Consent activity" detail="A record of changes you make." />
            {consent.history.length ? (
              <ul className="space-y-2">
                {[...consent.history].reverse().map((entry, index) => (
                  <li key={`${entry.at}-${index}`} className="rounded-lg border border-line px-3 py-2">
                    <p className="text-xs font-semibold text-slate-800">{entry.action}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted">{entry.detail}</p>
                    <p className="mt-0.5 text-xs text-muted">{formatDateTime(entry.at)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs leading-5 text-muted">No consent activity recorded yet.</p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Connected devices & sessions" />
            <ul className="space-y-2">
              {privacy.connectedDevices.map((device) => {
                const Icon = deviceIcon(device.id);
                return (
                  <li key={device.id} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-muted" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">{device.label}</p>
                        <p className="text-xs text-muted">{device.lastActive}</p>
                      </div>
                    </div>
                    {device.id === 'dev-1' ? (
                      <Pill tone="green">Current</Pill>
                    ) : (
                      <button type="button" onClick={() => removeDevice(device.id)} className="text-xs font-bold text-rose-700 hover:underline">
                        Remove
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <SectionTitle title="Data requests" />
            {privacy.requests.length ? (
              <ul className="space-y-2">
                {privacy.requests.map((request) => (
                  <li key={request.id} className="rounded-lg border border-line px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800">{request.type}</p>
                      <Pill tone={request.status.startsWith('Submitted') ? 'amber' : 'green'}>{request.status.startsWith('Submitted') ? 'Submitted' : 'Completed'}</Pill>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{formatDate(request.date)} · {request.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">No requests on record.</p>
            )}
            <div className="mt-3 rounded-lg bg-warm px-3 py-2 text-xs leading-5 text-muted">
              <Download className="me-1 inline h-3 w-3" />
              To request a portable copy of your records, use the request option below or contact the clinic. Identity verification is required.
            </div>
          </Card>

          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
              <AlertTriangle className="h-3.5 w-3.5" /> Account deletion
            </p>
            <p className="mt-1 text-xs leading-5 text-rose-900/80">
              A deletion request is reviewed by the hospital. Some records may be retained where required by law or clinical safety obligations.
            </p>
            {privacy.deletionRequested ? (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-xs font-semibold text-rose-800">
                <CheckCircle2 className="h-3.5 w-3.5" /> Request submitted · awaiting verification
              </div>
            ) : confirmDelete ? (
              <div className="mt-3 space-y-2">
                <label className="flex items-start gap-2 text-xs leading-5 text-rose-900">
                  <input type="checkbox" checked={understood} onChange={(event) => setUnderstood(event.target.checked)} className="mt-0.5" />
                  I understand that I will be contacted to verify this request and that some records may be retained.
                </label>
                <div className="flex gap-2">
                  <button type="button" className={dangerButton} disabled={!understood} onClick={() => { requestDeletion(); setConfirmDelete(false); }}>
                    <Trash2 className="h-3.5 w-3.5" /> Submit request
                  </button>
                  <button type="button" className={secondaryButton} onClick={() => setConfirmDelete(false)}>Keep my account</button>
                </div>
              </div>
            ) : (
              <button type="button" className={`${dangerButton} mt-2`} onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Request account deletion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Screen 45 — Help & Support / Logout
// ---------------------------------------------------------------------------
const faqs = [
  {
    question: 'What does a review prompt mean?',
    answer:
      'A review prompt means one or more observations fell outside your recorded personal range, or a functional response changed. It is a prompt for a clinician to look more closely — not a diagnosis. Context such as sleep, stress, or device setup is considered.'
  },
  {
    question: 'Why can I not see a trend yet?',
    answer:
      'Trends need at least three comparable, quality-checked sessions with matching task version, language, and accessibility conditions. This prevents unstable or misleading trend lines.'
  },
  {
    question: 'Are my video and audio recordings stored?',
    answer:
      'The portal reports use derived observations and task responses. The app processes your camera and microphone on your device during screening. Raw video and audio are not recorded or stored; only the derived observations and task responses are saved and visible in your reports. Camera and microphone processing is explained in your consent record.'
  },
  {
    question: 'Can I stop or take a break during an assessment?',
    answer:
      'Yes. You can pause, take a break, or stop at any point. If a session is incomplete, it is marked accordingly and may not be used for comparison.'
  },
  {
    question: 'Who can see my information?',
    answer:
      'Verified clinicians involved in your care can review screening observations. Optional de-identified research sharing is controlled in Privacy & Data Settings.'
  },
  {
    question: 'How do I change my language or text size?',
    answer:
      'Open Account Settings to change language, text size, high contrast, audio instructions, and tap-target preferences. Changes apply to new sessions.'
  }
];

export const HelpSupportPage: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('Technical problem');
  const [submitted, setSubmitted] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/patient/login', { replace: true });
  };

  return (
    <div className="space-y-5">
      <PortalPageHeader
        eyebrow="Screen 45 · Help & support"
        title="How can we help?"
        description="Answers to common questions, a way to report a problem, and clinic contact details. You are in control of signing out."
        actions={<Pill tone="blue" dot>Support available</Pill>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card>
            <SectionTitle title="Frequently asked questions" />
            <ul className="divide-y divide-slate-100">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <li key={faq.question}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex w-full items-center justify-between gap-3 py-3 text-start"
                    >
                      <span className="text-[14px] font-semibold text-slate-800">{faq.question}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && <p className="pb-3 text-xs leading-5 text-body">{faq.answer}</p>}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <SectionTitle title="Report a problem" detail="Technical issues, unclear content, or an accessibility barrier." />
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs leading-5 text-emerald-900">
                <p className="flex items-center gap-1.5 font-bold"><CheckCircle2 className="h-4 w-4" /> Report received</p>
                <p className="mt-1">Support will follow up using your registered contact details. This demonstration does not submit to a live service.</p>
                <button type="button" className="mt-2 text-xs font-bold text-emerald-800 underline" onClick={() => { setSubmitted(false); setIssue(''); }}>
                  Report something else
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-[0.6fr_1.4fr]">
                  <div>
                    <label className={labelClass} htmlFor="help-category">Topic</label>
                    <select id="help-category" className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                      <option>Technical problem</option>
                      <option>Accessibility barrier</option>
                      <option>Assessment question</option>
                      <option>Privacy request</option>
                      <option>Something else</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="help-issue">What happened?</label>
                    <textarea id="help-issue" rows={3} className={fieldClass} value={issue} onChange={(event) => setIssue(event.target.value)} placeholder="Please do not include sensitive medical details here." />
                  </div>
                </div>
                <button type="button" className={`${primaryButton} mt-3`} disabled={!issue.trim()} onClick={() => setSubmitted(true)}>
                  <MessageSquare className="h-4 w-4" /> Send report
                </button>
              </>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionTitle title="Contact the clinic" />
            <p className="text-[14px] font-semibold text-ink">{treatmentTeam.doctor}</p>
            <p className="text-xs text-muted">{treatmentTeam.department}</p>
            <div className="mt-3 space-y-2.5 text-xs">
              <a href={`tel:${treatmentTeam.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-body hover:text-blue-700">
                <Phone className="h-3.5 w-3.5 text-muted" /> {treatmentTeam.phone}
              </a>
              <a href={`mailto:${treatmentTeam.email}`} className="flex items-center gap-2 text-body hover:text-blue-700">
                <Mail className="h-3.5 w-3.5 text-muted" /> {treatmentTeam.email}
              </a>
              <p className="flex items-start gap-2 text-body">
                <CircleHelp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" /> Mon–Fri, 9:00–17:00 IST
              </p>
            </div>
            <a href={`mailto:${treatmentTeam.email}`} className={`${secondaryButton} mt-3 w-full`}>Email clinic support</a>
          </Card>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5" /> If this is an emergency
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-900/80">
              Do not use this form for urgent medical help. Contact local emergency services or the hospital support line immediately.
            </p>
            <a href={`tel:${treatmentTeam.phone.replace(/\s/g, '')}`} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline">
              <Phone className="h-3 w-3" /> Call {treatmentTeam.phone}
            </a>
          </div>

          <Card>
            <SectionTitle title="Accessibility support" action={<Accessibility className="h-4 w-4 text-muted" />} />
            <p className="text-xs leading-5 text-body">
              Need a different format, language, or assistance during a screening? The clinic can arrange support.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="slate">Large text</Pill>
              <Pill tone="slate">Spoken guidance</Pill>
              <Pill tone="slate">Six languages</Pill>
            </div>
          </Card>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[14px] font-semibold text-ink">Sign out</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Signing out ends this session on this device. Your saved portal preferences remain for next time.
            </p>
            {confirmLogout ? (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-body">Are you sure you want to sign out?</p>
                <div className="flex gap-2">
                  <button type="button" className={primaryButton} onClick={handleLogout}><LogOut className="h-4 w-4" /> Sign out</button>
                  <button type="button" className={secondaryButton} onClick={() => setConfirmLogout(false)}>Stay signed in</button>
                </div>
              </div>
            ) : (
              <button type="button" className={`${secondaryButton} mt-3 w-full`} onClick={() => setConfirmLogout(true)}>
                <LogOut className="h-4 w-4" /> Sign out of my account
              </button>
            )}
          </div>

          <div className="rounded-xl border border-line bg-warm p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-body">
              <Database className="h-3.5 w-3.5" /> About this portal
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              NeuLens screening support · demonstration environment. Not for diagnostic use. If you notice an inconsistency in a report, contact the clinic.
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-muted"><Bell className="h-3 w-3" /> Clinical safety notices cannot be disabled.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
