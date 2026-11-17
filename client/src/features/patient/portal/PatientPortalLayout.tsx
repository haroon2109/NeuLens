import React, { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RouteAnnouncer } from '../../../components/a11y/RouteAnnouncer';
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
import { useLanguageStore } from '../../../services/language/LanguageManager';
import { getPortalTranslation } from '../../../services/language/portalTranslations';
import { deploymentConfig } from '../../../config/deployment';

type NavItem = { path: string; label: string; icon: LucideIcon; end?: boolean };
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
      { path: '/patient/cognitive', label: 'Cognitive assessment', icon: Brain, end: true },
      { path: '/patient/cognitive/library', label: 'Task library', icon: ClipboardList },
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
      { path: '/patient/context', label: 'Context overview', icon: HeartPulse, end: true },
      { path: '/patient/context/assessment-conditions', label: 'Assessment conditions', icon: Activity },
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

const textSizeClass: Record<string, string> = {
  normal: '',
  large: 'pp-text-lg',
  xlarge: 'pp-text-xl'
};

const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { notifications } = usePatientPortalStore();
  const { currentLanguage } = useLanguageStore();
  const pt = getPortalTranslation(currentLanguage);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => setIsLogoutOpen(true);

  const confirmLogout = () => {
    logout();
    navigate('/patient/login', { replace: true });
  };

  const nameParts = (user?.name || 'Patient').split(' ').filter(Boolean);
  const initials = nameParts.map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand */}
      <Link
        to="/patient/dashboard"
        className="flex items-center gap-2.5 px-5 py-5 text-decoration-none"
        onClick={onNavigate}
      >
        <NeulensLogoMark className="h-9 w-9" aria-hidden="true" />
        <span className="flex flex-col">
          <NeulensWordmark size="small" />
          <span className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-sage-deep">
            {pt.patientPortal}
          </span>
        </span>
      </Link>

      {/* User card — mint surface, matching NeuLens identity */}
      <div className="mx-4 mb-4 rounded-xl border border-line p-3 bg-mint">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[14px] font-bold text-forest shadow-xs">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold text-ink">
              {user?.name || 'Patient'}
            </span>
            <span className="mt-0.5 block font-mono text-[13px] text-muted">
              {user?.patientId || 'CV-2026-ACTIVE'}
            </span>
          </span>
        </div>
      </div>

      {/* Navigation — sage-tinted section labels, forest active state */}
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4" aria-label="Patient portal navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 pb-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-sage-deep">
              {pt.nav.groups[group.label] || group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon, end }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors ${
                        isActive
                          ? 'bg-mint text-forest font-semibold'
                          : 'text-body hover:bg-white/60 hover:text-ink'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 stroke-[1.8]" aria-hidden="true" />
                    <span className="flex-1">{pt.nav.items[path] || label}</span>
                    {path === '/patient/notifications' && notifications.some((item) => !item.read) && (
                      <span className="h-2 w-2 rounded-full bg-forest shadow-[0_0_6px_rgba(47,94,78,0.5)]" aria-label="Unread notification" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] font-semibold text-body transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {pt.signOut}
        </button>
      </div>

      <ConfirmDialog
        open={isLogoutOpen}
        title={pt.signOut}
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
  const { currentLanguage } = useLanguageStore();
  const pt = getPortalTranslation(currentLanguage);
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
    navGroups
      .flatMap((group) => group.items)
      .filter((item) =>
        item.end
          ? location.pathname === item.path
          : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
      )
      .sort((a, b) => b.path.length - a.path.length)[0]?.label || pt.patientPortal;

  // A suspended account keeps its record but loses portal access.
  if (user?.status === 'SUSPENDED' || user?.status === 'WITHDRAWN') {
    return <Navigate to="/account-suspended" replace />;
  }

  const contentClass = [
    'patient-portal',
    accessibility.highContrast ? 'patient-contrast' : '',
    textSizeClass[accessibility.textSize]
  ].filter(Boolean).join(' ');

  const initials = (user?.name || 'P')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`${contentClass} min-h-screen bg-warm text-ink`}>
      {/* Skip link */}
      <a
        href="#patient-main"
        className="sr-only z-50 rounded-lg bg-forest px-4 py-2 text-white text-sm font-semibold focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50"
      >
        {pt.skipToContent}
      </a>
      <RouteAnnouncer />

      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-[258px] border-e border-line bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 flex w-[min(280px,85vw)] flex-col overflow-hidden border-e border-line bg-white shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Top layer: header + main + footer */}
      <div className="lg:ps-[258px]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-white/95 backdrop-blur">
          <div className="flex h-[64px] items-center gap-3 px-4 sm:px-6">
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {/* Breadcrumb-ish label */}
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-sage-deep">
                {pt.patientPortal}
              </p>
              <p className="truncate text-[14px] font-semibold text-ink">{activeLabel}</p>
            </div>

            {/* Notifications */}
            <Link
              to="/patient/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body transition-colors hover:bg-mint"
              aria-label={`${pt.notifications}${unread ? `, ${unread} ${pt.notificationsUnread}` : ''}`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-forest px-1 text-[12px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>

            {/* Profile menu */}
            <Link
              to="/patient/profile"
              className="flex items-center gap-2 rounded-lg border border-line py-1.5 ps-1.5 pe-2.5 transition-colors hover:bg-mint"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-forest shadow-xs">
                {initials}
              </span>
              <span className="hidden max-w-[120px] truncate text-[14px] font-semibold text-ink sm:block">
                {user?.name || 'Patient'}
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-sage-deep sm:block" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <main
          id="patient-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1180px] px-4 py-6 focus:outline-none sm:px-6 sm:py-8"
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-line bg-white">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-1.5 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>{deploymentConfig.isConfigured ? `${deploymentConfig.clinicName} · ` : ''}{pt.footerLine1}</span>
            <span>{pt.footerLine2}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PatientPortalLayout;
