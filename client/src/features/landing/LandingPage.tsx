import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  AudioLines,
  Brain,
  Check,
  ChevronRight,
  ClipboardList,
  Eye,
  Fingerprint,
  HeartPulse,
  Instagram,
  Languages,
  Linkedin,
  Mail,
  Menu,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { NeulensLogoMark } from '../../components/NeulensLogoMark';
import { NeulensWordmark } from '../../components/NeulensWordmark';
import { CognitiveHealthIllustration } from './CognitiveHealthIllustration';
import { HealthcareScene } from '../../components/illustrations/HealthcareScene';

const navigation = [
  { label: 'How it works', href: '#screening-flow' },
  { label: 'What we observe', href: '#signals' },
  { label: 'For clinicians', href: '#clinician-experience' },
  { label: 'About', href: '#about-neulens' },
  { label: 'Contact', href: '#contact' },
];

const signals: { icon: LucideIcon; title: string; detail: string; tone: string }[] = [
  {
    icon: Eye,
    title: 'Eye movement',
    detail:
      'Gaze direction, fixation patterns, and responses to visual stimuli during selected tasks.',
    tone: 'bg-[#E7ECF3] text-[#34507A]',
  },
  {
    icon: AudioLines,
    title: 'Voice patterns',
    detail:
      'Speech timing, pause characteristics, and selected acoustic features during guided interactions.',
    tone: 'bg-[#EEF0FA] text-[#5D6EB0]',
  },
  {
    icon: ScanFace,
    title: 'Facial movement',
    detail:
      'Selected facial movement patterns and responses during guided activities.',
    tone: 'bg-[#F8EFE5] text-[#A06C42]',
  },
  {
    icon: Fingerprint,
    title: 'Cognitive tasks',
    detail:
      'Response accuracy, response time, and task completion across selected memory, attention, and coordination activities.',
    tone: 'bg-[#EAF1F6] text-[#4C7488]',
  },
];

const steps: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Users, title: 'Get started', detail: 'A patient or participant checks in and chooses a language.' },
  { icon: AudioLines, title: 'Follow along', detail: 'Friendly, spoken prompts guide each short activity.' },
  { icon: Activity, title: 'Bring signals together', detail: 'Activity observations are organized into one session summary.' },
  { icon: Stethoscope, title: 'Review with a clinician', detail: 'A healthcare professional considers the results in context.' },
];

const principles: { icon: LucideIcon; title: string; detail: string }[] = [
  {
    icon: HeartPulse,
    title: 'Designed for people',
    detail: 'A guided experience built to feel clear, calm, and approachable.',
  },
  {
    icon: Languages,
    title: 'Language-aware',
    detail: 'English and Tamil are available, with more languages planned.',
  },
  {
    icon: ShieldCheck,
    title: 'Clinician-led',
    detail: 'Screening information supports professional review, never replaces it.',
  },
];

const summarySections = [
  'Session status (in progress or complete)',
  'Cognitive task responses (for example, 2/3 tasks completed)',
  'Eye movement observations',
  'Voice characteristics (including speech rate and pause score)',
  'Facial movement observations',
  'Combined screening indicators',
  'Areas requiring attention',
  'Comparison with previous screening (planned)',
];

const intendedUses = [
  {
    title: 'Hospitals & clinics',
    category: 'Clinical workflows',
    detail:
      'Support screening workflows with structured patient sessions and clinician-facing summaries.',
    tone: 'bg-[#EAEEF3] text-[#2563EB]',
  },
  {
    title: 'Public health programs',
    category: 'Population screening',
    detail:
      'Explore scalable screening workflows for community and population-level programs.',
    tone: 'bg-[#EEF1FA] text-[#586CB2]',
  },
  {
    title: 'Research institutions',
    category: 'Clinical research',
    detail:
      'Evaluate multimodal behavioral signals and screening workflows in controlled studies.',
    tone: 'bg-[#F8EFE5] text-[#A06C42]',
  },
];

export const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="landing-page min-h-screen overflow-hidden bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-950">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-blue-800 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-[#E5E8EC] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="NeuLens home">
            <NeulensLogoMark className="h-9 w-9" />
            <NeulensWordmark size="small" />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-slate-600 transition-colors hover:text-[#1D4ED8]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/doctor/login"
              className="hidden rounded-full px-4 py-2.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Clinical portal
            </Link>
            <Link
              to="/patient"
              className="hidden min-h-11 items-center gap-2 rounded-full bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] sm:inline-flex"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className={`${mobileOpen ? 'block' : 'hidden'} absolute inset-x-0 top-full border-b border-slate-200 bg-white shadow-lg lg:hidden`}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <Link
                  to="/doctor/login"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Clinician portal
                </Link>
                <Link
                  to="/patient"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="relative isolate bg-[#F6F9FF]">
          <div className="pointer-events-none absolute -right-36 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[#E5EAF1] blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 xl:min-h-[650px] xl:grid-cols-12 xl:gap-8 xl:py-16">
            <div className="relative z-10 xl:col-span-6">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE1E9] bg-white/80 px-3.5 py-2 text-[12px] font-semibold text-[#425167] shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
                A new perspective on cognitive health
              </div>
              <h1 className="max-w-[620px] text-[40px] font-semibold leading-[1.06] tracking-[-0.055em] text-[#17202D] max-[359px]:text-[38px] sm:text-[58px] lg:text-[66px]">
                A clearer view of
                <span className="block text-[#2563EB]">cognitive health.</span>
              </h1>
              <p className="mt-6 max-w-[510px] text-[16px] leading-7 text-[#525A65] sm:text-[18px] sm:leading-8">
                NeuLens brings guided cognitive activities and behavioral observations together
                in a structured screening summary for clinician review.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/patient"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(33,107,89,.75)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                >
                  Start a screening
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/doctor/login"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#CBD1D9] bg-white/75 px-6 text-sm font-semibold text-[#293546] transition hover:border-[#94A1B4] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                >
                  <Stethoscope className="h-4 w-4" />
                  For clinicians
                </Link>
              </div>

              <div className="mt-7 flex max-w-[510px] items-start gap-2.5 text-[12px] leading-5 text-[#686F7A]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4B6080]" />
                <p>
                  Screening support, not a diagnosis. Clinical decisions remain with healthcare
                  professionals.
                </p>
              </div>
            </div>

            <div className="relative xl:col-span-6 xl:col-start-7">
              <CognitiveHealthIllustration />
              <p className="mt-1 text-center text-xs text-[#717882]">
                An illustrative view of the NeuLens experience
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl gap-3 px-5 pb-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {[
              {
                icon: Eye,
                label: 'Multimodal',
                detail: 'Behavioral and cognitive signals within one session.',
                color: 'bg-[#E5E9F0] text-[#34507A]',
              },
              {
                icon: Activity,
                label: 'Guided',
                detail: 'Short, structured activities with minimal instruction.',
                color: 'bg-[#EAF1F6] text-[#4C7488]',
              },
              {
                icon: ClipboardList,
                label: 'Structured',
                detail: 'A consistent format designed for professional review.',
                color: 'bg-[#EEF0FA] text-[#5D6EB0]',
              },
              {
                icon: Stethoscope,
                label: 'Clinician-led',
                detail: 'Supports clinical assessment; does not replace it.',
                color: 'bg-[#F8EFE5] text-[#A06C42]',
              },
            ].map(({ icon: Icon, label, detail, color }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-[#E6E8EC] bg-white/80 p-4"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-[12px] font-semibold text-[#293546]">{label}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#6A707A]">{detail}</span>
                </span>
              </div>
            ))}
          </div>
          <a
            href="#screening-flow"
            className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium text-[#717882] transition hover:text-[#2563EB] xl:flex"
          >
            Explore NeuLens
            <ArrowDownRight className="h-3.5 w-3.5" />
          </a>
        </section>

        <section id="signals" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2563EB]">
                A broader picture
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#1C2533] sm:text-[42px]">
                More than one way to understand a moment.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:text-base">
                Brief, guided activities bring different observations into view for a healthcare
                professional to consider alongside the person’s broader clinical picture.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {signals.map(({ icon: Icon, title, detail, tone }, index) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-[24px] border border-[#E7E9ED] bg-[#FBFCFB] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C5CEDB] hover:shadow-[0_18px_40px_-28px_rgba(37,99,235,.4)]"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="mt-7 block text-xs font-semibold uppercase tracking-[0.12em] text-[#9399A2]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 text-[17px] font-semibold text-[#202937]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">{detail}</p>
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full border border-[#E3E7EE] transition-transform duration-500 group-hover:scale-125" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="screening-flow" className="scroll-mt-24 bg-[#F5F8FF] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2563EB]">
                  A guided experience
                </p>
                <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#1C2533] sm:text-[42px]">
                  Simple for participants. Structured for care teams.
                </h2>
              </div>
              <p className="max-w-xl text-[15px] leading-7 text-slate-600 lg:col-span-5 lg:col-start-8">
                Each step is designed to feel approachable for the person taking part, while
                helping clinicians review the session in a consistent format.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[26px] border border-[#E1E4E9] bg-white p-3 sm:p-5">
              <HealthcareScene
                kind="howItWorks"
                className="w-full"
                title="The NeuLens pathway: registration, assessment, signal collection, clinician review and follow-up"
              />
            </div>

            <ol className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, detail }, index) => (
                <li key={title} className="relative rounded-[24px] border border-[#E1E4E9] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAEEF3] text-[#2563EB]">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="text-[12px] font-semibold tracking-[0.1em] text-[#9BA1AA]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 text-[16px] font-semibold text-[#202937]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">{detail}</p>
                  {index < steps.length - 1 && (
                    <ChevronRight
                      className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E4E9] bg-white p-1 text-[#677892] lg:block"
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-[26px] border border-[#E1E4E9] bg-white p-6 sm:p-8">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#2563EB]">
                  The screening pathway
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1C2533] sm:text-2xl">
                  One session. A broader view.
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-600">
                  Multiple guided signals are organized into a structured summary for clinician review.
                </p>
              </div>
              <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr_auto_1fr] lg:items-center">
                {[
                  {
                    title: 'Activities',
                    items: [
                      { icon: Eye, label: 'Eyes' },
                      { icon: AudioLines, label: 'Voice' },
                      { icon: ScanFace, label: 'Face' },
                      { icon: Fingerprint, label: 'Cognitive tasks' },
                    ],
                  },
                  { title: 'Processing', items: [{ icon: Activity, label: 'Signal processing' }] },
                  { title: 'Output', items: [{ icon: ClipboardList, label: 'Structured summary' }] },
                  { title: 'Review', items: [{ icon: Stethoscope, label: 'Clinician review' }] },
                ].map(({ title, items }, index, stages) => (
                  <div key={title} className="contents">
                    <div className="rounded-2xl border border-[#E7E9ED] bg-[#FBFCFB] p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#828993]">
                        {title}
                      </p>
                      <div className="flex flex-wrap gap-2 lg:flex-col">
                        {items.map(({ icon: Icon, label }) => (
                          <span
                            key={label}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#424A56] ring-1 ring-[#E9EBEF]"
                          >
                            <Icon className="h-3.5 w-3.5 text-[#2563EB]" />
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    {index < stages.length - 1 && (
                      <ArrowRight
                        className="mx-auto hidden h-4 w-4 text-[#9BA5B3] lg:block"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                Illustrative overview. Signal availability and handling can vary by activity and device.
              </p>
            </div>
          </div>
        </section>

        <section
          id="clinician-experience"
          className="scroll-mt-24 bg-[#0C1F40] py-20 text-white sm:py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_30px_90px_-40px_rgba(0,0,0,.7)] sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDE4EF] text-[#28436C]">
                      <Activity className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-white">Session overview</span>
                      <span className="mt-0.5 block text-xs text-white/55">Illustrative clinician workspace</span>
                    </span>
                  </div>
                  <span className="rounded-full border border-[#8EA4C5]/20 bg-[#8EA4C5]/10 px-2.5 py-1 text-xs font-medium text-[#B9CAE3]">
                    Ready for review
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1.15fr_.85fr]">
                  <div className="rounded-2xl border border-white/10 bg-[#102342] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/60">Screening session</span>
                      <span className="rounded-full bg-[#8EA4C5]/10 px-2 py-1 text-xs text-[#B9CAE3]">Complete</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 border-b border-white/10 pb-4 text-xs">
                      <span className="text-white/50">Patient ID <strong className="ml-1 font-medium text-white/85">NL-0241</strong></span>
                      <span className="text-white/50">Duration <strong className="ml-1 font-medium text-white/85">03:42</strong></span>
                    </div>
                    <p className="mb-3 mt-4 text-xs font-medium text-white/60">Signals captured</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: Eye, label: 'Eye movement' },
                        { icon: AudioLines, label: 'Voice patterns' },
                        { icon: ScanFace, label: 'Facial movement' },
                        { icon: Fingerprint, label: 'Cognitive tasks' },
                      ].map(({ icon: Icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] text-[#B2C1D8]">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-medium text-white/85">{label}</span>
                          <span className="ml-auto inline-flex items-center gap-1 text-xs text-[#9EB2D1]">
                            <Check className="h-3 w-3" />
                            Complete
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#102342] p-4">
                    <span className="text-xs font-medium text-white/60">Screening summary</span>
                    <div className="mt-5 space-y-4">
                      {[
                        { label: 'Attention', value: 'Within expected range*', tone: 'text-[#9EB2D1]' },
                        { label: 'Memory', value: 'Review suggested*', tone: 'text-[#E7CC8D]' },
                        { label: 'Speech', value: 'Observed variation*', tone: 'text-[#E7CC8D]' },
                      ].map(({ label, value, tone }, index) => (
                        <div key={label}>
                          <div className="flex items-start justify-between gap-2 text-xs">
                            <span className="text-white/65">{label}</span>
                            <span className={`text-right ${tone}`}>{value}</span>
                          </div>
                          <div className="ml-3.5 mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full ${index === 1 ? 'w-2/3 bg-[#D8B979]/75' : 'w-4/5 bg-[#8EA4C5]/75'}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs leading-4 text-white/50">
                      *Illustrative screening indicators for professional review.
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-white/40">
                  Illustrative interface · Not patient data
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#A9BBD7]">
                For clinicians
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-[42px]">
                From individual activities to one thoughtful summary.
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-white/70">
                NeuLens organizes screening-session observations in a consistent format—so
                healthcare professionals can consider them alongside history, context, and
                clinical judgement.
              </p>
              <ul className="mt-7 space-y-4">
                {summarySections.map((item) => {
                  const planned = item.includes('(planned)');
                  return (
                  <li key={item} className="flex items-start gap-3 text-[13px] leading-6 text-white/80">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A9BBD7]/15 text-[#BDCDE5]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="flex-1">{item.replace(' (planned)', '')}</span>
                    {planned && (
                      <span className="rounded-full bg-[#D8B979]/10 px-2 py-0.5 text-xs font-medium text-[#E7CC8D]">
                        Planned
                      </span>
                    )}
                  </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-[12px] leading-6 text-white/65">
                Professional interpretation and decisions remain with the clinician.
              </p>
              <p className="mt-5 text-xs leading-5 text-white/45">
                Illustrative interface · Not patient data. Signal availability and handling can vary
                by activity and device.
              </p>
              <Link
                to="/doctor/login"
                className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Open clinical portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="about-neulens" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2563EB]">
                  Thoughtful by design
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#1C2533] sm:text-[42px]">
                  Technology that supports care, not replaces it.
                </h2>
                <p className="mt-5 text-[15px] leading-7 text-slate-600">
                  NeuLens is a non-invasive neurocognitive screening platform for clinical triage,
                  built around guided sensory and cognitive activities. It brings ocular, vocal,
                  facial, and cognitive observations together for a healthcare professional to review.
                </p>
                <ul className="mt-6 space-y-3.5 text-[13px] leading-6 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAEEF3] text-[#2563EB]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>
                      <strong className="font-semibold text-[#293546]">Activity-specific processing.</strong>{' '}
                      Signal handling can vary by screening activity and device.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAEEF3] text-[#2563EB]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>
                      <strong className="font-semibold text-[#293546]">Clinician-facing summaries.</strong>{' '}
                      Multimodal observations are organized to support professional review.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAEEF3] text-[#2563EB]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>Available in English and Tamil, with more languages planned.</span>
                  </li>
                </ul>
                <a
                  href="#limitations"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  How we think about screening
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
                {principles.map(({ icon: Icon, title, detail }) => (
                  <article key={title} className="rounded-[22px] border border-[#E7E9ED] bg-[#FBFCFB] p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAEEF3] text-[#2563EB]">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-5 text-[14px] font-semibold text-[#202937]">{title}</h3>
                    <p className="mt-2 text-[12px] leading-5 text-slate-600">{detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-14 border-t border-[#E7E9ED] pt-10">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2563EB]">
                  Our approach
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#1C2533] sm:text-3xl">
                  Built to support care, not replace it.
                </h3>
              </div>
              <div className="mt-7 grid gap-3 md:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Activity-specific processing',
                    detail:
                      'Signal handling can vary by screening activity and device. Check the applicable screening information for details.',
                    tone: 'bg-[#EAEEF3] text-[#2563EB]',
                  },
                  {
                    icon: Users,
                    title: 'Professional review',
                    detail:
                      'Summaries support professional review; clinicians determine interpretation and next steps.',
                    tone: 'bg-[#EEF1FA] text-[#586CB2]',
                  },
                  {
                    icon: Stethoscope,
                    title: 'Not a diagnosis',
                    detail:
                      'NeuLens supports professional review; it does not replace clinical evaluation or provide a standalone diagnosis.',
                    tone: 'bg-[#F8EFE5] text-[#A06C42]',
                  },
                ].map(({ icon: Icon, title, detail, tone }) => (
                  <article
                    key={title}
                    className="rounded-2xl border border-[#E7E9ED] bg-[#FBFCFB] p-5"
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h4 className="mt-4 text-[14px] font-semibold text-[#202937]">{title}</h4>
                    <p className="mt-2 text-[12px] leading-5 text-slate-600">{detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="limitations" className="scroll-mt-24 border-y border-[#E5E7EB] bg-[#F6F8F6] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#4B6080] shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-[#1C2533] sm:text-3xl">
                What NeuLens does not do.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-[14px] leading-7 text-slate-600">
                Responsible healthcare technology is defined as much by its boundaries as by its
                capabilities. NeuLens provides structured screening information to support
                professional assessment—nothing more, nothing less.
              </p>
            </div>
          </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Diagnose a neurological condition',
                  detail: 'Outputs are screening indicators, not diagnostic conclusions.',
                },
                {
                  title: 'Replace a clinician',
                  detail: 'Results support professional review; clinicians determine interpretation and next steps.',
                },
                {
                  title: 'Make treatment decisions',
                  detail: 'Clinical judgement, context, and history remain with the clinician.',
                },
                {
                  title: 'Predict disease progression without evidence',
                  detail: 'NeuLens does not extrapolate beyond what the current session data supports.',
                },
              ].map(({ title, detail }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[#E1E4E9] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-24px_rgba(31,83,66,.5)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6F0EB] text-[#A06C42]">
                    <X className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 text-[13px] font-semibold leading-5 text-[#293546]">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{detail}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-[#E1E4E9] bg-white px-5 py-4">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#2563EB]">
                Screening summary flow
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[12px] font-medium text-[#424A56]">
                <span>Guided activities</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#9BA5B3]" />
                <span>Signal observations</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#9BA5B3]" />
                <span>Structured summary</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#9BA5B3]" />
                <span>Clinician review</span>
              </div>
              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                NeuLens is not a diagnosis or substitute for clinical evaluation. Signal availability
                and handling can vary by activity and device.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-[30px] bg-[#EAEEF3] px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
              <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[34px] border-white/35" />
              <div className="pointer-events-none absolute -bottom-36 right-36 h-72 w-72 rounded-full border border-[#C7CFDC]" />
              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="max-w-2xl lg:col-span-7">
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#2563EB]">
                    Start a conversation
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#1C2533] sm:text-[40px]">
                    Building a more accessible view of cognitive health.
                  </h2>
                  <p className="mt-4 max-w-xl text-[14px] leading-7 text-[#525A65]">
                    We welcome conversations with clinicians, care teams, researchers, and
                    community health programs.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:col-start-9 lg:flex-col">
                  <a
                    href="mailto:neulens.ai@gmail.com"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                  >
                    Talk to our team
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:neulens.ai@gmail.com"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#C9D0DB] bg-white/70 px-6 text-sm font-semibold text-[#293546] transition hover:bg-white"
                  >
                    <Mail className="h-4 w-4" />
                    neulens.ai@gmail.com
                  </a>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:col-span-12">
                  {intendedUses.map(({ title, category, detail, tone }) => (
                    <article
                      key={title}
                      className="rounded-2xl border border-white/80 bg-white/70 p-5 transition hover:bg-white"
                    >
                      <p className={`text-xs font-bold uppercase tracking-[0.12em] ${tone.split(' ')[1]}`}>
                        {title}
                      </p>
                      <h3 className="mt-2 text-[14px] font-semibold text-[#293546]">{category}</h3>
                      <p className="mt-2 text-[12px] leading-5 text-[#656C77]">{detail}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-[#E7E9ED] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5" aria-label="NeuLens home">
                <NeulensLogoMark className="h-8 w-8" />
                <NeulensWordmark size="small" />
              </Link>
              <p className="mt-3 text-[12px] text-slate-500">
                Clinical screening support for cognitive health.
              </p>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium text-slate-600">
              {navigation.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-[#2563EB]">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-8 grid gap-8 border-t border-[#E7E9ED] pt-7 sm:grid-cols-2 lg:grid-cols-12">
            <nav aria-label="Product" className="lg:col-span-3">
              <h2 className="text-[12px] font-semibold text-[#293546]">Product</h2>
              <ul className="mt-3 space-y-2.5 text-[12px] text-slate-600">
                <li><a href="#screening-flow" className="hover:text-[#2563EB]">How it works</a></li>
                <li><a href="#signals" className="hover:text-[#2563EB]">Signals</a></li>
                <li><a href="#clinician-experience" className="hover:text-[#2563EB]">Clinician experience</a></li>
                <li><a href="#contact" className="hover:text-[#2563EB]">Research</a></li>
              </ul>
            </nav>
            <nav aria-label="Company" className="lg:col-span-3">
              <h2 className="text-[12px] font-semibold text-[#293546]">Company</h2>
              <ul className="mt-3 space-y-2.5 text-[12px] text-slate-600">
                <li><Link to="/about" className="hover:text-[#2563EB]">About NeuLens</Link></li>
                <li><a href="#contact" className="hover:text-[#2563EB]">Contact</a></li>
                <li><span>Privacy <span className="text-slate-400">(coming soon)</span></span></li>
                <li><span>Terms <span className="text-slate-400">(coming soon)</span></span></li>
              </ul>
            </nav>
            <div className="lg:col-span-3">
              <h2 className="text-[12px] font-semibold text-[#293546]">Connect</h2>
              <ul className="mt-3 space-y-2.5 text-[12px] text-slate-600">
                <li>
                  <a
                    href="https://www.linkedin.com/in/neulens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#2563EB]"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/neulens.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#2563EB]"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="mailto:neulens.ai@gmail.com" className="inline-flex items-center gap-2 hover:text-[#2563EB]">
                    <Mail className="h-3.5 w-3.5" />
                    neulens.ai@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-[#E7E9ED] pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 NeuLens</p>
            <p>Screening support only · Not a diagnosis</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
