import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Buildings,
  CaretDown,
  ChartLineUp,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  Cpu,
  Database,
  EnvelopeSimple,
  Eye,
  Flask,
  Heartbeat,
  List,
  LockKey,
  Microphone,
  ShieldCheck,
  Smiley,
  Stethoscope,
  UsersThree,
  X,
} from '@phosphor-icons/react';
import { NeuLensLogo } from '../../components/NeuLensLogo';
import { HealthcareScene, type SceneKind } from '../../components/illustrations/HealthcareScene';
import { DemoRequestForm } from './DemoRequestForm';

/* -------------------------------------------------------------------------- */
/*  Shared building blocks                                                    */
/* -------------------------------------------------------------------------- */

const navigation = [
  { label: 'The challenge', href: '#challenge' },
  { label: 'Our approach', href: '#approach' },
  { label: 'Measurement', href: '#measurement' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For clinicians', href: '#for-clinicians' },
  { label: 'Research', href: '#research' },
];

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lp-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TaglineReveal: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={ref} id="tagline-heading" className={`lp-tagline ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span
            aria-hidden="true"
            className={`lp-tagline-word ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${index * 55}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </h2>
  );
};

const SectionIntro: React.FC<{
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  className?: string;
}> = ({ eyebrow, title, lead, center = false, className = '' }) => (
  <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
    <p className={`lp-eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</p>
    <h2 className="lp-h2 mt-4">{title}</h2>
    {lead ? <p className="lp-lead mt-5">{lead}</p> : null}
  </div>
);

const Brand: React.FC<{ tone?: 'dark' | 'light'; className?: string }> = ({ className = '' }) => (
  <Link to="/" className={`inline-flex items-center shrink-0 ${className}`} aria-label="NeuLens home">
    <NeuLensLogo height="h-9" />
  </Link>
);

const IconBox: React.FC<{
  icon: React.ElementType;
  tone?: 'mint' | 'sage' | 'light';
  className?: string;
}> = ({ icon: Icon, tone = 'mint', className = '' }) => {
  const tones = {
    mint: 'bg-nl-mint text-nl-forest',
    sage: 'bg-nl-sage/25 text-nl-forest',
    light: 'bg-white/10 text-white',
  };

  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]} ${className}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  const benefits = [
    {
      icon: Brain,
      title: 'Multimodal by design',
      detail: 'Cognition, gaze, voice and facial behaviour observed in one structured session.',
    },
    {
      icon: ClockCounterClockwise,
      title: 'Personal over population',
      detail: 'Comparisons begin with the person’s own baseline, not only a group average.',
    },
    {
      icon: Stethoscope,
      title: 'Clinician in the loop',
      detail: 'Outputs are review prompts for a qualified professional — never automated diagnoses.',
    },
    {
      icon: UsersThree,
      title: 'Accessible by default',
      detail: 'Clear language, spoken guidance and a calm interface designed for older adults.',
    },
  ];

  const pillars: {
    index: string;
    title: string;
    description: string;
    tags: string[];
    icon: React.ElementType;
    scene: SceneKind;
    sceneTitle: string;
  }[] = [
    {
      index: '01',
      title: 'Cognitive assessment',
      description:
        'Memory, attention, executive function and language, observed through short guided activities.',
      tags: ['Memory', 'Attention', 'Executive function', 'Language'],
      icon: Brain,
      scene: 'cognitive',
      sceneTitle: 'An older adult completing a guided cognitive activity',
    },
    {
      index: '02',
      title: 'Ocular observations',
      description:
        'Gaze and eye-movement behaviour captured through the browser camera during structured visual tasks.',
      tags: ['Gaze', 'Fixation stability', 'Saccadic behaviour'],
      icon: Eye,
      scene: 'eyeTracking',
      sceneTitle: 'Eye-movement observations being captured during a guided task',
    },
    {
      index: '03',
      title: 'Vocal & speech',
      description:
        'Speech timing, acoustic characteristics and task word accuracy from short spoken activities.',
      tags: ['Speech rate', 'Prosody', 'Articulation'],
      icon: Microphone,
      scene: 'voice',
      sceneTitle: 'An older adult completing a guided spoken activity',
    },
    {
      index: '04',
      title: 'Facial & behavioural',
      description:
        'Facial movement, bilateral symmetry and task-related behaviour observed during guided activities.',
      tags: ['Facial movement', 'Symmetry', 'Task behaviour'],
      icon: Smiley,
      scene: 'facial',
      sceneTitle: 'Facial and behavioural observations during a guided activity',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Set up & consent',
      detail:
        'A clinician or researcher starts a session, records relevant context with permission, and confirms the person is comfortable to continue.',
    },
    {
      number: '02',
      title: 'Complete guided activities',
      detail:
        'Short cognitive, ocular, vocal and facial activities are delivered with clear spoken instructions and accessibility options.',
    },
    {
      number: '03',
      title: 'Review a structured summary',
      detail:
        'Observations are organised into one session view, with quality and comparability indicators alongside the measurements.',
    },
    {
      number: '04',
      title: 'Interpret in context',
      detail:
        'The clinician considers the summary with history, medications, sensory access and the wider clinical picture.',
    },
  ];

  const contextItems = [
    {
      icon: Heartbeat,
      title: 'Clinical history & medications',
      detail: 'Comorbidities, prescriptions and sensory access can all shape what a screening observation means.',
    },
    {
      icon: ChartLineUp,
      title: 'Everyday function & lifestyle',
      detail: 'Sleep, activity, mood and daily-function check-ins add context to measured change.',
    },
    {
      icon: Database,
      title: 'Authorised health records',
      detail:
        'Optional FHIR R4 import of supported observations, only with explicit patient permission and a configured endpoint.',
    },
    {
      icon: Stethoscope,
      title: 'Clinician judgement',
      detail: 'Context can inform a conversation. It does not establish causation or replace clinical assessment.',
    },
  ];

  const faqs = [
    {
      question: 'Is NeuLens clinically validated?',
      answer:
        'No. NeuLens is a developing prototype and is not clinically validated. It does not diagnose dementia or any neurological disorder, and no clinical accuracy figures are claimed.',
    },
    {
      question: 'Is NeuLens a diagnostic tool?',
      answer:
        'No. NeuLens is a screening and clinical decision-support platform. It produces exploratory observations and review prompts for a qualified healthcare professional, not a diagnosis or treatment recommendation.',
    },
    {
      question: 'What does a session measure?',
      answer:
        'A guided session captures four kinds of observation: cognitive task performance, ocular (gaze and eye-movement) behaviour, vocal and speech characteristics, and facial and task-related behaviour. These are exploratory signals, not validated diagnostic instruments.',
    },
    {
      question: 'Who is NeuLens designed for?',
      answer:
        'NeuLens is designed for neurologists, geriatric specialists, hospitals, clinics and clinical research institutions. Sessions are intended to take place within a clinical or research setting under professional supervision.',
    },
    {
      question: 'Can patients use NeuLens on their own?',
      answer:
        'No. NeuLens does not offer public self-screening or self-diagnosis. The patient portal supports supervised participation in a screening journey, but interpretation and next steps remain with the clinician.',
    },
    {
      question: 'How does longitudinal monitoring work?',
      answer:
        'NeuLens compares results within the same person when task version, language, education and recorded access conditions match. In the current prototype, a change prompt requires three prior comparable screens. A prompt is a cue to review, not a validated change threshold, and the absence of a prompt is not evidence of stability.',
    },
    {
      question: 'How is data handled?',
      answer:
        'Selected video and audio signals are processed locally in the browser and only derived measurements are sent to the backend by default. Raw media is not recorded or uploaded. Optional health-record context is imported read-only, only with explicit permission and server-side configuration for that deployment.',
    },
    {
      question: 'How can my institution get involved?',
      answer:
        'We welcome clinical demonstration and research collaboration enquiries from care teams and research institutions. Request a demo or write to us to discuss your setting, workflow and evaluation questions.',
    },
  ];

  const researchStatus = [
    {
      label: 'Available in the prototype',
      tone: 'bg-nl-mint text-nl-forest border-nl-sage/60',
      items: [
        'Guided multimodal screening session',
        'Structured session summary for clinician review',
        'Personal baseline and within-person change prompts',
        'Optional authorised FHIR context import',
        'On-device processing of selected signals',
      ],
    },
    {
      label: 'In development',
      tone: 'bg-nl-sage/20 text-nl-forest-deep border-nl-sage/60',
      items: [
        'Broader language and accessibility coverage',
        'Tighter clinician workflow integration',
        'Quality and fairness reporting',
        'Deployment hardening and site configuration',
      ],
    },
    {
      label: 'Research direction',
      tone: 'bg-nl-warm text-nl-body border-nl-line',
      items: [
        'Clinical validation studies',
        'Meaningful-change thresholds',
        'Performance across languages, education and sensory access',
        'Regulatory and evaluation pathway',
      ],
    },
  ];

  return (
    <div className="landing-page min-h-screen overflow-hidden bg-nl-warm text-nl-body">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-xl bg-nl-forest px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* 1. Navigation ------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-nl-line/80 bg-nl-warm/90 backdrop-blur-xl">
        <div className="lp-container flex h-[72px] items-center justify-between gap-4">
          <Brand />

          <nav aria-label="Main navigation" className="hidden items-center gap-5 xl:gap-7 xl:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-nl-body transition-colors hover:text-nl-forest"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/doctor/login"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-nl-body transition-colors hover:text-nl-forest whitespace-nowrap lg:inline-flex"
            >
              <span>Clinician portal</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
            <span className="hidden sm:inline-block">
              <Link to="/patient" className="lp-btn lp-btn-primary lp-btn-sm whitespace-nowrap">
                <span>Patient portal</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </Link>
            </span>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-nl-line bg-white text-nl-ink transition-colors hover:border-nl-sage-dark xl:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`${
            mobileOpen ? 'block' : 'hidden'
          } absolute inset-x-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-b border-nl-line bg-nl-warm shadow-[0_24px_48px_-32px_rgba(27,51,43,0.45)] xl:hidden`}
        >
          <nav aria-label="Mobile navigation" className="lp-container py-5">
            <div className="grid gap-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-[2.9rem] items-center justify-between rounded-xl px-3 text-[0.97rem] font-medium text-nl-ink transition-colors hover:bg-white"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-nl-sage-dark" aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-3 border-t border-nl-line pt-5">
              <Link to="/patient" onClick={closeMenu} className="lp-btn lp-btn-primary w-full">
                <span>Patient portal</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" onClick={closeMenu} className="lp-btn lp-btn-secondary w-full">
                Explore How It Works
              </a>
              <div className="mt-1 flex items-center justify-between gap-3 text-sm">
                <Link to="/doctor/login" className="font-medium text-nl-body hover:text-nl-forest">
                  Clinician portal
                </Link>
                <Link to="/patient" className="font-medium text-nl-body hover:text-nl-forest">
                  Patient portal
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* 2. Hero --------------------------------------------------------- */}
        <section className="relative isolate overflow-hidden bg-nl-warm">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-28 top-4 h-[30rem] w-[30rem] rounded-full bg-nl-mint/80 sm:-right-20 sm:h-[34rem] sm:w-[34rem]" />
            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-nl-sage/20" />
            <div className="absolute right-[41%] top-[18%] hidden h-36 w-36 rounded-full border border-nl-sage/40 lg:block" />
            <div className="absolute left-[46%] top-10 hidden h-3 w-3 rounded-full bg-nl-sage-dark/50 lg:block" />
          </div>

          <div className="lp-container relative pb-20 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
              <div className="min-w-0">
                <p className="lp-eyebrow">Brain health | Early screening</p>
                <h1 className="lp-display mt-6">
                  Understand Brain Health.
                  <span className="block">Identify Changes Earlier.</span>
                </h1>
                <p className="lp-lead mt-6 max-w-[35rem]">
                  NeuLens brings cognitive, ocular, vocal and facial observations into one structured
                  screening session — supporting personal brain-health baselines and earlier conversations
                  about meaningful change.
                </p>
                <p className="lp-small mt-4 max-w-[35rem] text-nl-muted">
                  Built for neurologists, geriatric specialists, hospitals, clinics and clinical research
                  institutions.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link to="/patient" className="lp-btn lp-btn-primary">
                    Patient portal
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a href="#how-it-works" className="lp-btn lp-btn-secondary">
                    Explore How It Works
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-9 flex items-start gap-2.5 border-t border-nl-line pt-5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-nl-forest" aria-hidden="true" />
                  <p className="text-xs leading-5 text-nl-muted">
                    Developing prototype · Not clinically validated · Clinician-supervised use only
                  </p>
                </div>
              </div>

              <div className="relative mx-auto min-w-0 w-full max-w-[35rem] lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute -right-4 top-1/2 h-[78%] w-[88%] -translate-y-1/2 rounded-[3rem] bg-nl-sage/35 sm:-right-6"
                />
                <div aria-hidden="true" className="absolute -left-4 -top-5 h-24 w-24 rounded-full bg-nl-mint sm:h-28 sm:w-28" />

                <div className="relative rounded-[2rem] border border-nl-line bg-white p-3 shadow-[0_2px_4px_rgba(27,51,43,0.03),0_40px_80px_-64px_rgba(27,51,43,0.55)] sm:p-4">
                  <div className="overflow-hidden rounded-[1.45rem] bg-nl-mint-soft">
                    <div className="lp-float">
                      <HealthcareScene
                        kind="heroCare"
                        className="rounded-[1.45rem]"
                        title="An elderly couple reviewing brain-health observations with their clinician"
                        animated={false}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-1.5 pb-1 pt-4">
                    <p className="max-w-[17rem] text-xs leading-5 text-nl-muted">
                      Illustrative: an elderly couple consulting their clinician.
                    </p>
                    <span className="lp-tag">
                      <ShieldCheck className="h-3.5 w-3.5 text-nl-forest" aria-hidden="true" />
                      Clinician-supervised
                    </span>
                  </div>
                </div>

                <div className="absolute -left-3 top-10 hidden items-center gap-2.5 rounded-xl border border-nl-line bg-white px-3.5 py-3 shadow-[0_16px_40px_-30px_rgba(27,51,43,0.5)] sm:flex">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nl-mint text-nl-forest">
                    <Brain className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold leading-4 text-nl-ink">
                    Four observation types
                    <span className="block text-[12px] font-normal text-nl-muted">One guided session</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tagline reveal -------------------------------------------------- */}
        <section className="lp-on-dark relative isolate overflow-hidden bg-nl-forest" aria-labelledby="tagline-heading">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/[0.04]" />
            <div className="absolute -bottom-40 right-[-4rem] h-[26rem] w-[26rem] rounded-full border border-white/10" />
            <div className="absolute right-[18%] top-10 h-24 w-24 rounded-full bg-nl-sage/10" />
          </div>
          <div className="lp-container relative py-20 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <p className="lp-eyebrow justify-center">Our point of view</p>
              <div className="mt-8">
                <TaglineReveal text="Earlier awareness starts with knowing what change looks like for each person." />
              </div>
              <p className="lp-small mx-auto mt-8 max-w-2xl">
                Population averages can describe a group. Personal baselines help a clinician understand
                what a change means for the individual in front of them.
              </p>
            </div>
          </div>
        </section>

        {/* 3. The challenge ------------------------------------------------ */}
        <section id="challenge" className="lp-section bg-white">
          <div className="lp-container">
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
              <Reveal>
                <SectionIntro
                  eyebrow="The challenge"
                  title="Change is often gradual. Care is often later."
                  lead="Cognitive and functional shifts can emerge long before they become obvious in a routine conversation. The challenge is not only noticing them — it is knowing which changes matter for this person."
                />
              </Reveal>

              <div className="grid gap-0 border-t border-nl-line">
                {[
                  {
                    number: '01',
                    title: 'Signals arrive in fragments',
                    detail:
                      'Cognition, eye movement, voice and behaviour are usually observed at different times, in different formats, by different people.',
                  },
                  {
                    number: '02',
                    title: 'A single score says very little',
                    detail:
                      'Population averages cannot tell a clinician what is meaningful for an individual whose abilities, language, education and context vary.',
                  },
                  {
                    number: '03',
                    title: 'The window narrows quietly',
                    detail:
                      'When change is recognised late, opportunities for prevention, planning and support are already reduced.',
                  },
                ].map((item, index) => (
                  <Reveal key={item.number} delay={index * 70}>
                    <article className="grid gap-3 border-b border-nl-line py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-5 sm:py-8">
                      <p className="lp-caption pt-1">{item.number}</p>
                      <div>
                        <h3 className="lp-h3">{item.title}</h3>
                        <p className="lp-small mt-2.5 max-w-[34rem]">{item.detail}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="mt-12 lg:mt-16">
              <div className="lp-panel flex flex-col gap-5 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
                <p className="lp-h3 max-w-3xl">
                  The useful question is not only how someone compares with a population average — it is
                  what has changed for this person.
                </p>
                <p className="lp-caption shrink-0">A NeuLens design principle</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. Approach & benefits ----------------------------------------- */}
        <section id="approach" className="lp-section bg-nl-warm">
          <div className="lp-container">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
              <Reveal className="order-2 lg:order-1">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-5 -left-4 h-[70%] w-[80%] rounded-[2.5rem] bg-nl-sage/30"
                  />
                  <div className="lp-card relative overflow-hidden p-3">
                    <HealthcareScene
                      kind="manWithDoctor"
                      className="rounded-[1.1rem]"
                      title="A clinician discussing brain-health observations with an older adult"
                      animated={false}
                    />
                    <p className="px-2 pb-1 pt-3 text-xs leading-5 text-nl-muted">
                      Illustrative: a clinician discussing observations in context.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal className="order-1 lg:order-2">
                <SectionIntro
                  eyebrow="The NeuLens approach"
                  title="A structured, multimodal view — built around the individual."
                  lead="NeuLens combines four kinds of observation in one calm, clinician-supervised session. The aim is not to replace clinical judgement, but to give it clearer, more consistent information to work with."
                />
                <div className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3.5">
                      <IconBox icon={benefit.icon} />
                      <div>
                        <h3 className="lp-h4">{benefit.title}</h3>
                        <p className="lp-small mt-1.5 text-[0.9rem]">{benefit.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-8 flex items-start gap-2 text-xs leading-5 text-nl-muted">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-nl-forest" aria-hidden="true" />
                  Screening support, not diagnosis. NeuLens is a developing prototype and is not
                  clinically validated.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 5. Four measurement pillars ------------------------------------ */}
        <section id="measurement" className="lp-section bg-white">
          <div className="lp-container">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <Reveal>
                <SectionIntro
                  eyebrow="Four measurement pillars"
                  title="More than one signal. A more complete conversation."
                  lead="Each pillar contributes a different kind of observation. Together they form a structured session summary for a qualified clinician to interpret."
                />
              </Reveal>
              <Reveal delay={80}>
                <div className="flex max-w-sm items-start gap-3 rounded-2xl bg-nl-mint-soft p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-nl-forest" aria-hidden="true" />
                  <p className="text-xs leading-5 text-nl-body">
                    All four pillars currently produce exploratory observations. Their diagnostic or
                    predictive validity has not been established.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.title} delay={index * 60}>
                    <article className="lp-card h-full overflow-hidden">
                      <div className="bg-nl-mint-soft p-3">
                        <HealthcareScene
                          kind={pillar.scene}
                          className="rounded-[1rem]"
                          title={pillar.sceneTitle}
                          animated={false}
                        />
                      </div>
                      <div className="p-6 sm:p-7">
                        <div className="flex items-start gap-3.5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nl-mint text-nl-forest">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="lp-caption">Pillar {pillar.index}</p>
                            <h3 className="lp-h3 mt-0.5">{pillar.title}</h3>
                          </div>
                        </div>
                        <p className="lp-small mt-4">{pillar.description}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {pillar.tags.map((tag) => (
                            <span key={tag} className="lp-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="mt-5 border-t border-nl-line pt-4 text-xs font-medium text-nl-muted">
                          Prototype observation · Not a diagnostic measure
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. How NeuLens works ------------------------------------------- */}
        <section id="how-it-works" className="lp-section bg-nl-mint-soft">
          <div className="lp-container">
            <Reveal>
              <SectionIntro
                eyebrow="How NeuLens works"
                title="From a guided session to a more informed review."
                lead="The workflow is intentionally simple for the person taking part, and deliberately transparent for the clinician reviewing it."
              />
            </Reveal>

            <ol className="mt-12 grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, index) => (
                <li key={step.number}>
                  <Reveal delay={index * 70}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-nl-sage-dark/60 bg-white text-sm font-semibold text-nl-forest">
                        {step.number}
                      </span>
                      {index < steps.length - 1 ? (
                        <span aria-hidden="true" className="hidden h-px flex-1 bg-nl-sage-dark/40 lg:block" />
                      ) : null}
                    </div>
                    <h3 className="lp-h3 mt-5">{step.title}</h3>
                    <p className="lp-small mt-2.5">{step.detail}</p>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal className="mt-12">
              <div className="flex flex-col gap-3 rounded-2xl border border-nl-sage/50 bg-white/70 p-5 sm:flex-row sm:items-center sm:gap-4">
                <ShieldCheck className="h-5 w-5 shrink-0 text-nl-forest" aria-hidden="true" />
                <p className="text-sm leading-6 text-nl-body">
                  A session does not produce a diagnosis or a standalone risk score. It produces
                  structured observations for professional review.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Baseline & longitudinal monitoring --------------------------- */}
        <section id="baseline" className="lp-section bg-white">
          <div className="lp-container">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
              <Reveal>
                <SectionIntro
                  eyebrow="Personal baseline & longitudinal monitoring"
                  title="The right comparison is the person in front of you."
                  lead="A single screening is a snapshot. NeuLens is designed to compare results over time — within the same person, under comparable conditions — so that change can be described rather than guessed."
                />

                <ul className="lp-check-list mt-8">
                  <li>
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-nl-ink">A personal reference point.</strong>{' '}
                      Results are viewed against the person’s own earlier sessions, not only a population
                      norm.
                    </span>
                  </li>
                  <li>
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-nl-ink">Comparable conditions.</strong> Task
                      version, language, education and access conditions are recorded so comparisons are
                      not made across unlike sessions.
                    </span>
                  </li>
                  <li>
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-nl-ink">Review, not diagnosis.</strong> A change
                      prompt means “look closer”, not “this is a diagnosis”. The clinician decides what it
                      means.
                    </span>
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={80}>
                <div className="lp-card overflow-hidden p-3">
                  <HealthcareScene
                    kind="longitudinal"
                    className="rounded-[1.1rem]"
                    title="An older adult and clinician reviewing a longitudinal brain-health view together"
                    animated={false}
                  />
                  <div className="mt-3 rounded-[1.1rem] bg-nl-warm p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                      {[
                        { icon: CheckCircle, label: 'Personal baseline', note: 'Own prior sessions' },
                        { icon: ClockCounterClockwise, label: 'Comparable follow-up', note: 'Like-for-like conditions' },
                        { icon: Eye, label: 'Change to review', note: 'A clinical prompt' },
                      ].map((node, index) => {
                        const Icon = node.icon;
                        return (
                          <React.Fragment key={node.label}>
                            <div className="flex items-start gap-2.5 sm:block">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-nl-forest ring-1 ring-nl-line">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <div className="sm:mt-2.5">
                                <p className="text-xs font-semibold text-nl-ink">{node.label}</p>
                                <p className="text-[12px] leading-4 text-nl-muted">{node.note}</p>
                              </div>
                            </div>
                            {index < 2 ? (
                              <ArrowRight
                                className="hidden h-4 w-4 text-nl-sage-dark sm:block"
                                aria-hidden="true"
                              />
                            ) : null}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <p className="mt-5 border-t border-nl-line pt-4 text-[12px] leading-4 text-nl-muted">
                      Illustrative workflow only. No clinical thresholds or accuracy figures are shown.
                    </p>
                  </div>
                </div>
                <p className="mt-4 flex items-start gap-2 px-1 text-xs leading-5 text-nl-muted">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-nl-forest" aria-hidden="true" />
                  Within-person change prompts require three prior comparable screens in the current
                  prototype. The absence of a prompt is not evidence of stability.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 8. Health-context integration ---------------------------------- */}
        <section id="health-context" className="lp-section bg-nl-warm">
          <div className="lp-container">
            <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20">
              <Reveal className="order-2 lg:order-1">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-nl-mint"
                  />
                  <div className="lp-card relative overflow-hidden p-3">
                    <HealthcareScene
                      kind="contextReview"
                      className="rounded-[1.1rem]"
                      title="A clinician reviewing health context alongside screening observations"
                      animated={false}
                    />
                    <p className="px-2 pb-1 pt-3 text-xs leading-5 text-nl-muted">
                      Illustrative: screening observations considered with broader health context.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal className="order-1 lg:order-2">
                <SectionIntro
                  eyebrow="Health-context integration"
                  title="A screening result does not stand alone."
                  lead="NeuLens is designed to keep observations connected to the context that gives them meaning — while leaving interpretation with the clinician."
                />
                <div className="mt-8 grid gap-0 border-t border-nl-line">
                  {contextItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="grid gap-3 border-b border-nl-line py-5 sm:grid-cols-[2.75rem_1fr] sm:gap-4"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-nl-forest ring-1 ring-nl-line">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="lp-h4">{item.title}</h3>
                          <p className="lp-small mt-1 text-[0.9rem]">{item.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-5 text-xs leading-5 text-nl-muted">
                  FHIR context import is an optional prototype capability. Live connectivity must be
                  configured and tested for each deployment.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 9. Clinical oversight & safety ---------------------------------- */}
        <section id="clinical-oversight" className="lp-section bg-white">
          <div className="lp-container">
            <Reveal>
              <SectionIntro
                eyebrow="Clinical oversight & safety"
                title="Designed for professional review. Not self-diagnosis."
                lead="NeuLens is intended for use by qualified healthcare professionals within a clinical or research setting. It does not diagnose dementia or any neurological disorder."
              />
            </Reveal>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div className="grid gap-5 sm:grid-cols-2">
                <Reveal>
                  <div className="lp-card h-full p-6 sm:p-7">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-nl-mint text-nl-forest">
                      <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="lp-h3 mt-5">What NeuLens is</h3>
                    <p className="lp-small mt-2.5">
                      A digital brain-health screening and clinical decision-support platform, combining
                      multimodal observations, personal baselines and structured clinician review.
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={70}>
                  <div className="lp-card h-full p-6 sm:p-7">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-nl-warm text-nl-forest ring-1 ring-nl-line">
                      <X className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="lp-h3 mt-5">What NeuLens is not</h3>
                    <p className="lp-small mt-2.5">
                      A diagnostic device, a validated cognitive test, a standalone risk score, or a
                      substitute for professional medical evaluation, diagnosis or treatment.
                    </p>
                  </div>
                </Reveal>

                <div className="sm:col-span-2">
                  <div className="grid gap-x-8 gap-y-6 border-t border-nl-line pt-7 sm:grid-cols-2">
                    {[
                      {
                        title: 'Clinician-owned decisions',
                        detail: 'The platform surfaces observations. The clinician makes the call.',
                      },
                      {
                        title: 'No public self-screening',
                        detail: 'Sessions are conducted in a supervised clinical or research context.',
                      },
                      {
                        title: 'Privacy by design',
                        detail:
                          'Selected signals are processed on the device; raw media is not recorded or uploaded by default.',
                      },
                      {
                        title: 'Transparent about limits',
                        detail: 'Prototype status and comparability conditions are shown alongside results.',
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-nl-forest" aria-hidden="true" />
                        <div>
                          <h3 className="text-sm font-semibold text-nl-ink">{item.title}</h3>
                          <p className="lp-small mt-1 text-[0.875rem]">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Reveal delay={100}>
                <div className="lp-panel h-full p-3">
                  <HealthcareScene
                    kind="clinicalReview"
                    className="rounded-[1.1rem]"
                    title="A clinician reviewing a structured screening summary with a patient"
                    animated={false}
                  />
                  <div className="flex items-start gap-3 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-nl-forest" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-nl-ink">Clinician in the loop</p>
                      <p className="mt-1 text-xs leading-5 text-nl-muted">
                        NeuLens is a developing prototype and is not clinically validated. All outputs
                        require professional interpretation.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 10. For healthcare professionals -------------------------------- */}
        <section id="for-clinicians" className="lp-on-dark lp-section relative isolate overflow-hidden bg-nl-forest">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-white/[0.045]" />
            <div className="absolute -bottom-32 -left-20 h-[22rem] w-[22rem] rounded-full border border-white/10" />
          </div>

          <div className="lp-container relative">
            <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16">
              <Reveal>
                <SectionIntro
                  eyebrow="For healthcare professionals"
                  title="A clearer starting point for earlier conversations."
                  lead="We are working with neurologists, geriatric specialists, hospitals, clinics and clinical research institutions to put multimodal screening into practice carefully — and to test it honestly."
                />

                <div className="mt-8 grid gap-0 border-t border-white/15">
                  {[
                    {
                      icon: Stethoscope,
                      title: 'Neurologists & geriatric specialists',
                      detail: 'Add structured, longitudinal observations to cognitive and functional review.',
                    },
                    {
                      icon: Buildings,
                      title: 'Hospitals & clinics',
                      detail: 'Explore a browser-based screening workflow that fits existing clinical oversight.',
                    },
                    {
                      icon: Flask,
                      title: 'Clinical research institutions',
                      detail: 'Collaborate on measurement quality, fairness and validation research.',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="grid gap-3 border-b border-white/15 py-5 sm:grid-cols-[2.75rem_1fr] sm:gap-4"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="lp-h4">{item.title}</h3>
                          <p className="lp-small mt-1 text-[0.9rem]">{item.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#contact" className="lp-btn lp-btn-light">
                    Request a Clinical Demo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a href="#contact" className="lp-btn lp-btn-outline-light">
                    Discuss research collaboration
                  </a>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/75">
                  Current prototype. No clinical accuracy, adoption or outcome claims are made.
                </p>
              </Reveal>

              <Reveal delay={90}>
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-4 -right-4 h-[70%] w-[80%] rounded-[2.5rem] bg-nl-sage/20"
                  />
                  <div className="relative rounded-[1.75rem] bg-white p-3">
                    <HealthcareScene
                      kind="aboutTeam"
                      className="rounded-[1.2rem]"
                      title="A clinical team working together with older adults"
                      animated={false}
                    />
                    <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-3">
                      <p className="text-xs leading-5 text-nl-muted">Illustrative: a clinician-led care team.</p>
                      <span className="lp-tag shrink-0 text-[12px]">Clinical review</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 11. Technology & research approach ------------------------------ */}
        <section id="research" className="lp-section bg-nl-warm">
          <div className="lp-container">
            <Reveal>
              <SectionIntro
                eyebrow="Technology & research approach"
                title="Clear about what exists today — and what comes next."
                lead="We separate prototype capabilities from planned development and research-stage questions. No clinical accuracy figures, hospital adoption numbers or research outcomes are claimed."
              />
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {researchStatus.map((group, index) => (
                <Reveal key={group.label} delay={index * 70}>
                  <div className="lp-card h-full p-6 sm:p-7">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.09em] ${group.tone}`}
                    >
                      {group.label}
                    </span>
                    <ul className="mt-6 grid gap-3.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-nl-sage-deep" aria-hidden="true" />
                          <span className="text-sm leading-6 text-nl-body">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 grid gap-8 border-t border-nl-line pt-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: LockKey,
                    title: 'Privacy by design',
                    detail: 'Derived measurements, not raw media, by default.',
                  },
                  {
                    icon: Cpu,
                    title: 'Measurement transparency',
                    detail: 'Quality and comparability are shown, not hidden.',
                  },
                  {
                    icon: Flask,
                    title: 'Validation before claims',
                    detail: 'No performance claim without evidence.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-nl-forest ring-1 ring-nl-line">                          <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <h3 className="mt-3 text-sm font-semibold text-nl-ink">{item.title}</h3>
                      <p className="lp-small mt-1 text-[0.875rem]">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-nl-sage/50 bg-white p-5 sm:p-6">
                <p className="lp-caption">What we do not claim</p>
                <p className="lp-small mt-3">
                  Diagnostic accuracy, clinical validation, hospital partnerships, clinical testimonials
                  or completed research outcomes. NeuLens is a developing prototype; its current value is
                  in demonstrating a careful, multimodal screening workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 12. FAQ --------------------------------------------------------- */}
        <section id="faq" className="lp-section bg-white">
          <div className="lp-container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <Reveal>
                <div className="lg:sticky lg:top-28">
                  <SectionIntro
                    eyebrow="Frequently asked questions"
                    title="Common questions, answered plainly."
                    lead="If your question is not covered here, we would be glad to discuss your clinical or research setting directly."
                  />
                  <a href="#contact" className="lp-btn lp-btn-secondary mt-7">
                    Ask us directly
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <div className="border-t border-nl-line">
                  {faqs.map((faq, index) => (
                    <details key={faq.question} className="lp-faq" open={index === 0}>
                      <summary>
                        <span>{faq.question}</span>
                        <CaretDown className="h-4 w-4" aria-hidden="true" />
                      </summary>
                      <div className="lp-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 13. Final clinical demo CTA ------------------------------------ */}
        <section id="contact" className="lp-section-sm bg-nl-warm pb-16 sm:pb-20">
          <div className="lp-container">
            <div className="lp-card overflow-hidden">
              <div className="grid lg:grid-cols-[1fr_1fr]">
                <div className="relative overflow-hidden bg-nl-forest p-7 text-white sm:p-10 lg:p-12">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.05]" />
                    <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-white/10" />
                  </div>
                  <div className="relative lp-on-dark">
                    <p className="lp-eyebrow">Clinical demonstration & research</p>
                    <h2 className="lp-h2 mt-4">Let’s explore the right next step for your team.</h2>
                    <p className="lp-lead mt-5 max-w-lg">
                      Request a walkthrough of the current prototype, discuss your workflow, and review
                      its limitations with our team. We are particularly interested in collaborations
                      with clinical and research groups.
                    </p>

                    <ul className="lp-check-list mt-7">
                      <li>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>A guided walkthrough of the prototype</span>
                      </li>
                      <li>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>A discussion of your screening and review workflow</span>
                      </li>
                      <li>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>An honest review of current evidence and limitations</span>
                      </li>
                    </ul>

                    <div className="mt-8 border-t border-white/15 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">
                        Prefer email?
                      </p>
                      <a
                        href="mailto:neulens.ai@gmail.com"
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
                      >
                        <EnvelopeSimple className="h-4 w-4" aria-hidden="true" />
                        neulens.ai@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-7 sm:p-10 lg:p-12">
                  <DemoRequestForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 14. Footer -------------------------------------------------------- */}
      <footer className="bg-nl-forest-deep text-white">
        <div className="lp-container py-14 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.9fr] lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <Brand tone="light" />
              <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
                Earlier awareness of meaningful change, built for clinical review and follow-up.
              </p>
              <p className="mt-5 max-w-sm text-xs leading-5 text-white/65">
                NeuLens is a developing prototype and is not clinically validated. It does not diagnose
                dementia or any neurological disorder.
              </p>
            </div>

            <nav aria-label="Platform links">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Platform</h2>
              <ul className="mt-4 grid gap-2.5 text-sm">
                {[
                  { label: 'The challenge', href: '#challenge' },
                  { label: 'Our approach', href: '#approach' },
                  { label: 'Measurement pillars', href: '#measurement' },
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'Research approach', href: '#research' },
                  { label: 'FAQ', href: '#faq' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Clinical links">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">For clinicians</h2>
              <ul className="mt-4 grid gap-2.5 text-sm">
                <li>
                  <a href="#contact" className="text-white/70 transition-colors hover:text-white">
                    Request a clinical demo
                  </a>
                </li>
                <li>
                  <a href="#for-clinicians" className="text-white/70 transition-colors hover:text-white">
                    Healthcare professionals
                  </a>
                </li>
                <li>
                  <a href="#clinical-oversight" className="text-white/70 transition-colors hover:text-white">
                    Clinical oversight & safety
                  </a>
                </li>
                <li>
                  <a
                    href="/doctor/login"
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    Clinician portal
                  </a>
                </li>
                <li>
                  <a href="/patient" className="text-white/70 transition-colors hover:text-white">
                    Patient portal
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Contact</h2>
              <ul className="mt-4 grid gap-2.5 text-sm">
                <li>
                  <a
                    href="mailto:neulens.ai@gmail.com"
                    className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                  >
                    <EnvelopeSimple className="h-4 w-4" aria-hidden="true" />
                    neulens.ai@gmail.com
                  </a>
                </li>
                <li>
                  <a href="#contact" className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white">
                    Clinical demonstration
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              </ul>
              <p className="mt-5 text-xs leading-5 text-white/65">
                For healthcare professionals and research institutions. Not for public self-screening.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 NeuLens. All rights reserved.</p>
            <p>Developing prototype · Not clinically validated · Not a diagnostic tool</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
