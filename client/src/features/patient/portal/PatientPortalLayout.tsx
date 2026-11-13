import React, { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/systemStates';
import {
  Activity,
  Bell,
  Brain,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserRound,
  Users,
  X,
  type LucideIcon
} from 'lucide-react';
import { NeulensLogoMark } from '../../../components/NeulensLogoMark';
import { NeulensWordmark } from '../../../components/NeulensWordmark';
import { useAuthStore } from '../../../store/authStore';
import { usePatientPortalStore } from '../../../store/patientPortalStore';
import { patientPortalApi } from '../../../services/patientPortalApi';

type NavItem = { path: string; label: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: 'Home',
    items: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/patient/brain-health', label: 'Brain health', icon: Brain },
      { path: '/patient/timeline', label: 'Brain Health Timeline', icon: TrendingUp }
    ]
  },
  {
    label: 'Assessment',
    items: [
      { path: '/patient/assessment/intro', label: 'Start assessment', icon: Sparkles },
      { path: '/patient/history', label: 'History', icon: ClipboardList },
      { path: '/patient/daily-function', label: 'Daily Function Questionnaire', icon: ClipboardList },
      { path: '/patient/documents', label: 'Reports & documents', icon: FileText }
    ]
  },
  {
    label: 'Monitoring',
    items: [
      { path: '/patient/trends', label: 'Longitudinal trends', icon: TrendingUp },
      { path: '/patient/change-detection', label: 'Change detection', icon: Activity }
    ]
  },
  {
    label: 'Health context',
    items: [
      { path: '/patient/health-profile', label: 'Health Profile & Context', icon: HeartPulse },
      { path: '/patient/context', label: 'Context overview', icon: HeartPulse },
      { path: '/patient/context/sleep', label: 'Sleep & lifestyle', icon: Moon },
      { path: '/patient/context/wellbeing', label: 'Mental wellbeing', icon: Users },
      { path: '/patient/context/clinical', label: 'Clinical & family', icon: Stethoscope }
    ]
  },
  {
    label: 'Care',
    items: [
      { path: '/patient/prevention-plan', label: 'Personalized Prevention Plan', icon: ShieldCheck },
      { path: '/patient/appointments', label: 'Follow-up & Appointments', icon: CalendarDays },
      { path: '/patient/care-plan', label: 'My care plan', icon: ShieldCheck },
      { path: '/patient/notifications', label: 'Notifications', icon: Bell }
    ]
  },
  {
    label: 'Account',
    items: [
      { path: '/patient/profile', label: 'My profile', icon: UserRound },
      { path: '/patient/settings', label: 'Account settings', icon: SlidersHorizontal },
      { path: '/patient/privacy', label: 'Privacy & data', icon: ShieldCheck },
      { path: '/patient/help', label: 'Help & support', icon: HelpCircle }
    ]
  }
];

const textSizeClass = {
  normal: 'text-[14px]',
  large: 'text-[16px] [&_h1]:text-[32px] [&_h2]:text-[17px] [&_p]:text-[14px]',
  xlarge: 'text-[18px] [&_h1]:text-[36px] [&_h2]:text-[19px] [&_p]:text-[16px]'
};

const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { notifications } = usePatientPortalStore();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => setIsLogoutOpen(true);

  const confirmLogout = () => {
    logout();
    navigate('/patient/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <Link to="/patient/dashboard" className="flex items-center gap-2.5 px-5 py-5" onClick={onNavigate}>
        <NeulensLogoMark className="h-9 w-9" />
        <span>
          <NeulensWordmark size="small" />
          <span className="mt-0.5 block text-xs font-medium text-slate-500">Patient portal</span>
        </span>
      </Link>

      <div className="mx-4 mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-[12px] font-bold text-blue-800">
            {(user?.name || 'Patient')
              .split(' ')
              .filter(Boolean)
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-semibold text-slate-900">
              {user?.name || 'Patient'}
            </span>
            <span className="mt-0.5 block font-mono text-xs text-slate-500">
              {user?.patientId || 'CV-2026-ACTIVE'}
            </span>
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Patient portal navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 pb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    <span className="flex-1">{label}</span>
                    {path === '/patient/notifications' && notifications.some((item) => !item.read) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <ConfirmDialog
        open={isLogoutOpen}
        title="Sign out of the patient portal?"
        description="You will need your patient ID and the verification answer to sign in again. Any information you already saved stays in your record."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        destructive
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </div>
  );
};

export const PatientPortalLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  const { accessibility, notifications, setAppointments } = usePatientPortalStore();
  const unread = notifications.filter((item) => !item.read).length;

  // Appointments live on the server; the store copy is a display cache.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    patientPortalApi
      .getAppointments()
      .then((rows) => {
        if (cancelled) return;
        setAppointments(
          rows.map((row) => ({
            id: row.id,
            title: row.title,
            clinician: row.clinician || 'Care team',
            location: row.location || 'To be confirmed',
            date: row.date,
            time: row.time,
            status: row.status,
            notes: row.communication || undefined
          }))
        );
      })
      .catch(() => {
        // Keep any cached records; the appointments page reports server errors.
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, setAppointments]);

  const activeLabel =
    navGroups.flatMap((group) => group.items).find((item) => location.pathname.startsWith(item.path))?.label ||
    'Patient portal';

  // A suspended account keeps its record but loses portal access.
  if (user?.status === 'SUSPENDED' || user?.status === 'WITHDRAWN') {
    return <Navigate to="/account-suspended" replace />;
  }

  return (
    <div
      className={`patient-portal min-h-screen bg-[#FBF7EF] text-slate-800 ${
        accessibility.highContrast ? 'patient-contrast' : ''
      } ${textSizeClass[accessibility.textSize]}`}
    >
      <a
        href="#patient-main"
        className="sr-only z-50 rounded-lg bg-blue-800 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[258px] border-r border-slate-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-slate-200 bg-white shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[258px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="flex h-[64px] items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Patient portal
              </p>
              <p className="truncate text-[13px] font-semibold text-slate-800">{activeLabel}</p>
            </div>

            <Link
              to="/patient/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>

            <Link
              to="/patient/profile"
              className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-2.5 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                {(user?.name || 'P')
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className="hidden max-w-[120px] truncate text-[12px] font-semibold text-slate-800 sm:block">
                {user?.name || 'Patient'}
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </Link>
          </div>
        </header>

        <main id="patient-main" className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-1.5 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Neulens General Hospital · Neurology &amp; Cognitive Health</span>
            <span>Screening support, not a diagnosis. Your clinician guides next steps.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PatientPortalLayout;
