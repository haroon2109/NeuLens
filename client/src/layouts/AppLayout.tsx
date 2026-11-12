import React, { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SessionExpiredDialog } from '../components/systemStates';

const RouteLoading: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center"
  >
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" aria-hidden="true" />
    <p className="text-sm text-slate-600">Loading this screen…</p>
  </div>
);

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignInAgain = (nextPath: string) => {
    const role = useAuthStore.getState().role;
    logout();
    const roleParam = role === 'PATIENT' ? 'patient' : role ? 'doctor' : '';
    const query = new URLSearchParams();
    if (roleParam) query.set('role', roleParam);
    if (nextPath && nextPath !== '/' && !nextPath.startsWith('/auth/')) query.set('next', nextPath);
    navigate(`/auth/login${query.toString() ? `?${query.toString()}` : ''}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 text-slate-800">
      {/* Decorative subtle medical ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <main className="flex-grow z-10 relative">
        {/* Route-level code splitting: one boundary for every nested outlet. */}
        <Suspense fallback={<RouteLoading />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Global session-expiry prompt: any API that returns 401 opens this once. */}
      <SessionExpiredDialog onSignIn={handleSignInAgain} />
    </div>
  );
};
