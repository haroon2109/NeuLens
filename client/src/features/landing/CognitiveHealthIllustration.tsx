import type { FC } from 'react';
import { Activity, AudioLines, ClipboardList, Eye, ScanFace, ShieldCheck } from 'lucide-react';
import { HealthcareScene } from '../../components/illustrations/HealthcareScene';
import { GentleFloat, MotionReveal } from '../../components/motion/Reveal';

const items = [
  { icon: Eye, label: 'Eye movement', note: 'Gaze and fixation observations' },
  { icon: AudioLines, label: 'Voice', note: 'Speech and acoustic observations' },
  { icon: ScanFace, label: 'Facial movement', note: 'Guided behavioural observations' },
  { icon: ClipboardList, label: 'Cognitive tasks', note: 'Memory, attention, executive function' },
];

export const CognitiveHealthIllustration: FC = () => (
  <div className="mx-auto w-full max-w-[640px]">
    <MotionReveal>
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-[#F7FBF8] to-[#EAF4EF] p-5 shadow-[0_18px_50px_-30px_rgba(47,94,78,0.28)] sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#DFF3EA]/70 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 bottom-10 h-32 w-32 rounded-full bg-[#9DBFAD]/25 blur-2xl" />

        <GentleFloat amplitude={5} duration={7} className="relative">
          <HealthcareScene kind="heroCare" className="w-full shadow-sm" title="Doctor and elderly adults reviewing brain-health observations" />
        </GentleFloat>

        <div className="relative mt-5 rounded-2xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-sm sm:p-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFF3EA] bg-[#F4FBF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#2F5E4E]">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Longitudinal, clinician-guided screening
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">What NeuLens brings together</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {items.map(({ icon: Icon, label, note }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 transition-colors hover:border-[#9DBFAD] hover:bg-[#F4FBF8]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2F5E4E] shadow-sm ring-1 ring-slate-200">
                  <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">{label}</span>
                  <span className="block text-xs leading-5 text-slate-500">{note}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-4 flex items-start gap-2.5 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-xs leading-5 text-slate-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6F9E87]" aria-hidden="true" />
          <p>Screening support for professional review. Results do not provide a diagnosis.</p>
        </div>
      </div>
    </MotionReveal>
  </div>
);

export default CognitiveHealthIllustration;
