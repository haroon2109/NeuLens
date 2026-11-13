import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ConfirmDialog } from '../components/systemStates';
import { useAuthStore } from '../store/authStore';
import { useDoctorPortalStore } from '../store/doctorPortalStore';
import { doctorApi } from '../services/portalApi';
import { NeulensLogoMark } from '../components/NeulensLogoMark';
import { NeulensWordmark } from '../components/NeulensWordmark';
import { ClinicalIllustration } from '../components/ClinicalIllustration';
import { 
  BarChart3,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard, 
  Users, 
  Settings, 
  Activity,
  CalendarDays,
  FileText,
  Send,
  LogOut, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Stethoscope,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const DoctorLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const setAppointments = useDoctorPortalStore((state) => state.setAppointments);
  const setReferrals = useDoctorPortalStore((state) => state.setReferrals);

  // Appointments are persisted server-side; the store copy is a display cache.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    doctorApi
      .getAppointments()
      .then((rows: any[]) => {
        if (cancelled) return;
        setAppointments(
          rows.map((row) => ({
            id: row.id,
            patientId: row.patientPublicId || row.patientId,
            title: row.title,
            type: row.type,
            date: row.date,
            time: row.time,
            location: row.location || 'To be confirmed',
            status: row.status,
            communication: row.communication || '',
            createdAt: row.createdAt
          }))
        );
      })
      .catch(() => {
        // Keep cached records when the API is unavailable; pages surface errors on write.
      });

    doctorApi
      .getReferrals()
      .then((rows: any[]) => {
        if (cancelled) return;
        setReferrals(
          rows.map((row) => ({
            id: row.id,
            patientId: row.patientPublicId || row.patientId,
            type: row.type,
            reason: row.reason,
            destination: row.destination,
            urgency: row.urgency,
            status: row.status,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
          }))
        );
      })
      .catch(() => {
        // Keep cached records when the API is unavailable; pages surface errors on write.
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, setAppointments, setReferrals]);

  const confirmLogout = () => {
    logout();
    navigate('/doctor/login', { replace: true });
  };

  // Sign-out is confirmed first so an accidental click does not end the session.
  const handleLogout = () => setIsLogoutOpen(true);

  // Suspended or withdrawn professionals never reach patient records.
  if (user?.status === 'SUSPENDED' || user?.status === 'WITHDRAWN') {
    return <Navigate to="/account-suspended" replace />;
  }

  // Care workflow: overview → review queue → patients → change review → approvals → referrals → appointments → quality/evidence
  const navItems = [
    { path: '/doctor/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/doctor/review-queue', label: 'Clinical Review Queue', icon: ClipboardList },
    { path: '/doctor/patients', label: 'Patients', icon: Users },
    { path: '/doctor/reports', label: 'Reports', icon: FileText },
    { path: '/doctor/change-detection', label: 'Longitudinal / Change Review', icon: Activity },
    { path: '/doctor/clinical-approval', label: 'Clinical Approval', icon: CheckCircle2 },
    { path: '/doctor/referrals', label: 'Referral & Care Coordination', icon: Send },
    { path: '/doctor/appointments', label: 'Appointments', icon: CalendarDays },
    { path: '/doctor/evidence-quality', label: 'Evidence & Data Quality', icon: Search },
    { path: '/doctor/quality-equity', label: 'Quality & Equity', icon: BarChart3 },
    { path: '/doctor/settings', label: 'Settings', icon: Settings },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctor/patients?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Clinician profile details from authenticated user session
  const clinicianName = user?.name 
    ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`)
    : user?.firstName || user?.lastName
    ? `Dr. ${`${user.firstName || ''} ${user.lastName || ''}`.trim()}`
    : user?.email
    ? `Dr. ${user.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
    : 'Clinician';

  const clinicianRole = user?.role === 'ADMIN' 
    ? 'Chief Neurologist' 
    : 'Attending Clinician';

  const clinicianInitials = clinicianName
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map(n => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DR';

  // Check if viewing a patient record to bind screening directly
  const patientPathMatch = location.pathname.match(/\/doctor\/patients\/([^\/]+)/);
  const currentPatientId = patientPathMatch && patientPathMatch[1] !== 'screen' ? patientPathMatch[1] : null;

  return (
    <div className="min-h-screen bg-[#FBF7EF] flex text-slate-800">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR (Doctor Navigation Shell)                        */}
      {/* ------------------------------------------------------------- */}
      <aside 
        className={`hidden lg:flex ${
          isCollapsed ? 'w-20 p-4' : 'w-68 p-6'
        } bg-white border-r border-slate-200/80 flex-col justify-between z-30 sticky top-0 h-screen transition-all duration-200 select-none`}
      >
        
        <div className="space-y-6">
          
          {/* Logo / Brand Header & Collapse Toggle */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <Link to="/doctor/dashboard" className="flex items-center gap-3 group">
              <NeulensLogoMark className="group-hover:scale-105 transition-transform" />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <NeulensWordmark size="small" className="block" />
                  <span className="text-xs font-bold text-medical-600 uppercase tracking-widest block font-display">
                    Doctor Portal
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand toggle when collapsed */}
          {isCollapsed && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                title="Expand sidebar"
                aria-label="Expand sidebar"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer mx-auto"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Items (Overview, Patients, Settings) */}
          <nav className="space-y-1.5">
            {!isCollapsed && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
                Workspace
              </span>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/doctor/dashboard' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
                  } rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-medical-700 font-bold shadow-xs ring-1 ring-medical-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-medical-600 stroke-[2.4]' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM SECTION: PATIENT PORTAL LINK & CLINICIAN PROFILE      */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          
          {/* Separate Patient Portal Shortcut */}
          {!isCollapsed ? (
            <Link
              to="/patient"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 flex items-center justify-between transition-all shadow-2xs group"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-medical-600 group-hover:scale-110 transition-transform" />
                <span>Patient Portal</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            </Link>
          ) : (
            <Link
              to="/patient"
              title="Open Patient Portal"
              aria-label="Open Patient Portal"
              className="w-10 h-10 mx-auto rounded-xl bg-slate-50 hover:bg-slate-100 text-medical-600 border border-slate-200 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          {/* Clinician Profile Panel */}
          {!isCollapsed ? (
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-medical-600 text-white flex items-center justify-center font-display font-black text-xs shrink-0 shadow-sm shadow-medical-600/20">
                  {clinicianInitials}
                </div>
                <div className="overflow-hidden min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate leading-tight" title={clinicianName}>
                    {clinicianName}
                  </span>
                  <span className="text-xs text-slate-500 font-medium block truncate mt-0.5">
                    {clinicianRole}
                  </span>
                </div>
              </div>

              {/* Dedicated, visually distinct Sign Out button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                title="Sign Out of Doctor Portal"
                aria-label="Sign Out"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>

            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pt-1">
              <div 
                className="w-10 h-10 rounded-xl bg-medical-600 text-white flex items-center justify-center font-display font-black text-xs shadow-sm cursor-default"
                title={`${clinicianName} (${clinicianRole})`}
              >
                {clinicianInitials}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                title="Sign Out"
                aria-label="Sign Out"
                className="w-10 h-10 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 min-h-[72px] py-3 flex items-center justify-between px-6 lg:px-10">
          
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Hospital Medical Center &bull; Neurology Dept
              </span>
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 leading-tight">
                Clinical Screening & Patient Telemetry
              </span>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            {!currentPatientId && (
              <ClinicalIllustration variant="clinical" size="micro" className="hidden xl:block" />
            )}
            
            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-150 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition-all w-56"
              />
            </form>

            {/* AI Engine Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gnani Speech Engine Active</span>
            </div>

            {/* Launch Screening Button */}
            <Link
              to={currentPatientId ? `/doctor/patients/${currentPatientId}/screen` : '/doctor/patients?select=true'}
              title={currentPatientId ? 'Start Screening for current patient' : 'Select a patient to screen'}
              className="btn-primary text-xs font-bold px-4 py-2 rounded-2xl shadow-pill flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch Screening Battery</span>
              <span className="sm:hidden">Screen</span>
            </Link>

          </div>

        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 z-30">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <item.icon className="w-4 h-4 text-medical-600" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/patient"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-medical-600 py-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Patient Portal</span>
              </Link>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">{clinicianName}</span>
                <button 
                  type="button" 
                  onClick={handleLogout} 
                  className="text-xs text-rose-600 font-bold px-3 py-1 rounded-lg bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Render Outlet */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

      </div>

      <ConfirmDialog
        open={isLogoutOpen}
        title="Sign out of the clinical workspace?"
        description="Unsaved notes in an open form are not kept. Any care plan or referral already saved stays in the record."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        destructive
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </div>
  );
};
export default DoctorLayout;
