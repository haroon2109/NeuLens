import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Accessibility,
  ArrowRight,
  AudioLines,
  Building2,
  Check,
  ClipboardList,
  Eye,
  ScanFace,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  UserRoundPlus,
} from 'lucide-react';
import { NeulensLogoMark } from '../../components/NeulensLogoMark';
import { NeulensWordmark } from '../../components/NeulensWordmark';
import { ElderCareMascot } from '../../components/ElderCareMascot';
import { MotionReveal } from '../../components/motion/Reveal';

const screeningSignals = [
  { icon: Eye, label: 'Eye movement' },
  { icon: AudioLines, label: 'Voice' },
  { icon: ScanFace, label: 'Facial movement' },
  { icon: ClipboardList, label: 'Cognitive tasks' },
];

export const PatientHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-warm text-ink selection:bg-mint selection:text-forest">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-warm/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/patient" className="flex items-center gap-3" aria-label="Neulens patient portal">
            <NeulensLogoMark className="h-10 w-10" />
            <div className="flex flex-col gap-0.5">
              <NeulensWordmark size="medium" />
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Building2 className="h-3 w-3 text-sage-deep" aria-hidden="true" />
                Patient screening
              </span>
            </div>
          </Link>

          <Link
            to="/doctor/login"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 text-[14px] font-semibold text-ink transition hover:border-sage-dark hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            <Stethoscope className="h-4 w-4 text-sage-deep" aria-hidden="true" />
            <span className="hidden sm:inline">Staff sign in</span>
            <span className="sm:hidden">Staff</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <MotionReveal className="mx-auto w-full max-w-[570px] lg:mx-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[14px] font-semibold text-forest shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
              Cognitive health screening
            </div>
            <div className="mt-5 flex items-start gap-4 sm:gap-6">
              <div className="min-w-0 flex-1">
                <h1 className="max-w-[540px] text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-ink sm:text-[44px]">
                  We’ll guide you through each step
                </h1>
                <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-body sm:text-[16px]">
                  Take your time with a short, guided set of activities exploring memory, attention, and coordination.
                  Your session is shared with your care team for professional review.
                </p>
              </div>
              <div className="hidden w-[150px] shrink-0 sm:block">
                <ElderCareMascot pose="welcome" className="h-auto w-full" />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-ink">What to expect</p>
                <div className="w-[88px] sm:hidden">
                  <ElderCareMascot pose="welcome" className="h-auto w-full" animated={false} />
                </div>
              </div>
              <p className="mt-1 text-sm leading-6 text-body">
                A guided experience covering memory, attention, coordination, and related observations.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {screeningSignals.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-line bg-warm/70 px-3 py-2.5"
                  >
                    <Icon className="h-4 w-4 text-sage-deep" strokeWidth={1.8} aria-hidden="true" />
                    <span className="text-xs font-medium text-body">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={120} className="mx-auto w-full max-w-[510px] lg:ml-auto">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
              <div className="mb-6">
                <p className="pp-eyebrow">Patient portal</p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-ink sm:text-[24px]">
                  Continue to screening
                </h2>
                <p className="mt-2 text-[14px] leading-5 text-body">
                  Choose the option that applies to you.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/patient/register')}
                  className="group w-full rounded-xl border border-sage/70 bg-mint/40 p-4 text-start transition hover:-translate-y-0.5 hover:border-sage-dark hover:bg-mint/60 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:p-5"
                >
                  <span className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest text-white shadow-pill">
                      <UserRoundPlus className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[14px] font-semibold text-ink">New patient</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-forest transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block text-[14px] leading-5 text-body">
                        Create a patient profile to begin.
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-body">
                        <Check className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                        A Patient ID is created during registration
                      </span>
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/patient/login')}
                  className="group w-full rounded-xl border border-line bg-white p-4 text-start transition hover:-translate-y-0.5 hover:border-sage-dark hover:bg-warm/60 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep sm:p-5"
                >
                  <span className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mint text-forest">
                      <UserRoundCheck className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[14px] font-semibold text-ink">Returning patient</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-sage-deep transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block text-[14px] leading-5 text-body">
                        Sign in with your Patient ID to continue.
                      </span>
                    </span>
                  </span>
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/patient/accessible-checkin')}
                  className="group w-full rounded-xl border border-amber-300 bg-amber-50/70 p-4 text-start transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-50 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:p-5"
                >
                  <span className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-pill">
                      <Accessibility className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[14px] font-semibold text-ink" dir="rtl" lang="ar">متابعة مبسطة (عربي) — بدون كاميرا/ميكروفون</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-amber-700 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block text-[14px] leading-5 text-body" dir="rtl" lang="ar">
                        تذكّر كلمات وأسئلة عن الأنشطة اليومية، بأزرار كبيرة ولوحة مفاتيح وقارئ شاشة وقراءة صوتية اختيارية. صياغة مسودّة غير مُحقَّقة.
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-body" dir="ltr" lang="en">
                        Accessible Arabic check-in (word-list recall + daily-function). No camera, no microphone, no vision required. Draft wording — not validated; not a score or diagnosis.
                      </span>
                    </span>
                  </span>
                </button>

                <div className="flex items-start gap-2 rounded-xl border border-line bg-warm/70 px-3.5 py-3 text-xs leading-5 text-body">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" aria-hidden="true" />
                  <p>Screening results support clinical review and do not provide a diagnosis.</p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </main>
    </div>
  );
};

export default PatientHubPage;
