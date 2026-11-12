import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Music, Play, Volume2 } from 'lucide-react';

type Props = {
  patientMode?: boolean;
  onComplete: (result: any) => void;
  speak?: (text: string) => void;
  t?: any;
};

const KEYS = [
  { id: 0, label: 'C', color: 'bg-rose-500', light: 'bg-rose-300', freq: 261.63 },
  { id: 1, label: 'D', color: 'bg-amber-500', light: 'bg-amber-300', freq: 293.66 },
  { id: 2, label: 'E', color: 'bg-emerald-500', light: 'bg-emerald-300', freq: 329.63 },
  { id: 3, label: 'G', color: 'bg-sky-500', light: 'bg-sky-300', freq: 392.0 },
];

// Fixed-observation rounds (standardized): same structure for every administration of this form version.
const ROUNDS = [3, 4, 5];

export const PianoSequenceTask: React.FC<Props> = ({ patientMode = false, onComplete, speak }) => {
  const [phase, setPhase] = useState<'intro' | 'showing' | 'input' | 'feedback' | 'done'>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [roundResults, setRoundResults] = useState<any[]>([]);
  const [message, setMessage] = useState('Watch the piano keys light up, then repeat the sequence in the same order.');
  const timers = useRef<number[]>([]);
  const audioCtx = useRef<AudioContext | null>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const beep = useCallback((freq: number, duration = 280) => {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx.current) audioCtx.current = new Ctx();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
      osc.start(now);
      osc.stop(now + duration / 1000 + 0.02);
    } catch {
      // Audio unavailable: visual cue remains.
    }
  }, []);

  const makeSequence = useCallback((len: number) => {
    // Deterministic-feeling but varied per round using fixed round lengths only (not adaptive difficulty).
    const base = [0, 2, 1, 3, 0, 1, 3, 2, 0, 3, 1, 2];
    const offset = roundIndex * 2;
    return Array.from({ length: len }, (_, i) => base[(i + offset) % base.length]);
  }, [roundIndex]);

  const playSequence = useCallback((seq: number[]) => {
    clearTimers();
    setPhase('showing');
    setInputIndex(0);
    setMessage('Watch the sequence carefully.');
    seq.forEach((keyId, i) => {
      const t1 = window.setTimeout(() => {
        setActiveKey(keyId);
        beep(KEYS[keyId].freq);
      }, 600 + i * 700);
      const t2 = window.setTimeout(() => setActiveKey(null), 600 + i * 700 + 380);
      timers.current.push(t1, t2);
    });
    const done = window.setTimeout(() => {
      setActiveKey(null);
      setPhase('input');
      setMessage('Now tap the keys in the same order.');
      speak?.('Now repeat the sequence.');
    }, 600 + seq.length * 700 + 200);
    timers.current.push(done);
  }, [beep, speak]);

  const startRound = useCallback((idx: number) => {
    const len = ROUNDS[idx];
    const seq = makeSequence(len);
    setSequence(seq);
    setRoundIndex(idx);
    setRoundResults((prev) => prev);
    playSequence(seq);
  }, [makeSequence, playSequence]);

  const finish = useCallback((finalCorrect: number, results: any[]) => {
    const total = ROUNDS.length;
    const score = Math.round((finalCorrect / total) * 100);
    const payload = {
      taskId: 'piano_sequence',
      taskName: 'Piano Sequence (Fixed Observation)',
      mode: 'fixed_observation',
      formVersion: 'piano-seq-v1',
      score,
      correctRounds: finalCorrect,
      totalRounds: total,
      roundLengths: ROUNDS,
      roundResults: results,
      clinicalUse: true,
      note: 'Standardized fixed-observation sequencing task; not adaptive. Comparable only with the same form/version under similar conditions.',
      completedAt: new Date().toISOString(),
    };
    setPhase('done');
    onComplete(payload);
  }, [onComplete]);

  const handleKey = (keyId: number) => {
    if (phase !== 'input') return;
    beep(KEYS[keyId].freq, 180);
    setActiveKey(keyId);
    window.setTimeout(() => setActiveKey(null), 150);

    const expected = sequence[inputIndex];
    const correctSoFar = keyId === expected;
    const nextIndex = inputIndex + 1;

    if (!correctSoFar || nextIndex === sequence.length) {
      const roundCorrect = correctSoFar && nextIndex === sequence.length;
      const newCorrect = correctRounds + (roundCorrect ? 1 : 0);
      const result = {
        round: roundIndex + 1,
        length: sequence.length,
        correct: roundCorrect,
        entered: [...sequence.slice(0, inputIndex), keyId],
        expected: sequence,
      };
      const newResults = [...roundResults, result];
      setRoundResults(newResults);
      setCorrectRounds(newCorrect);
      setPhase('feedback');
      setMessage(roundCorrect ? 'Correct sequence.' : 'That sequence was different. Continue to the next round.');
      speak?.(roundCorrect ? 'Correct.' : 'Let us try the next one.');

      const t = window.setTimeout(() => {
        const next = roundIndex + 1;
        if (next < ROUNDS.length) {
          startRound(next);
        } else {
          finish(newCorrect, newResults);
        }
      }, 1200);
      timers.current.push(t);
      return;
    }

    setInputIndex(nextIndex);
  };

  const start = () => {
    setCorrectRounds(0);
    setRoundResults([]);
    startRound(0);
  };

  if (phase === 'done') {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">Piano Sequence Complete</h3>
        <p className="text-sm text-slate-600">Fixed-observation sequencing recorded.</p>
      </div>
    );
  }

  return (
    <div className={patientMode ? 'bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm' : 'glass-card p-6 space-y-5'}>
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-200">
          <Music className="w-4 h-4" /> Fixed observation · Sequence memory
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">Piano Sequence</h3>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">{message}</p>
        {phase !== 'intro' && (
          <p className="text-xs font-semibold text-slate-500">Round {Math.min(roundIndex + 1, ROUNDS.length)} of {ROUNDS.length} · Length {ROUNDS[roundIndex] || ROUNDS[0]}</p>
        )}
      </div>

      <div className="flex justify-center gap-3 sm:gap-4 py-4">
        {KEYS.map((k) => {
          const active = activeKey === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => handleKey(k.id)}
              disabled={phase !== 'input'}
              className={`relative w-16 sm:w-20 h-40 sm:h-52 rounded-b-2xl rounded-t-lg border-2 transition-all shadow-sm flex items-end justify-center pb-4 select-none ${
                active ? `${k.light} border-slate-400 scale-[1.02]` : 'bg-white border-slate-300 hover:border-slate-400'
              } ${phase === 'input' ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default opacity-95'}`}
              aria-label={`Piano key ${k.label}`}
            >
              <span className={`absolute top-3 w-8 h-8 rounded-full ${active ? k.color : 'bg-slate-200'} transition-colors`} />
              <span className="text-sm font-bold text-slate-700">{k.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3">
        {phase === 'intro' ? (
          <button type="button" onClick={start} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-medical-600 hover:bg-medical-700 text-white font-bold shadow-md">
            <Play className="w-4 h-4 fill-white" /> Start sequence
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Volume2 className="w-4 h-4" />
            <span>{phase === 'showing' ? 'Listen and watch' : phase === 'input' ? 'Your turn' : 'Preparing next round'}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-slate-400 max-w-xl mx-auto">
        Standardized fixed-observation activity (same form). Results may be used for within-person comparison only when quality/comparability gates pass. This is not adaptive practice.
      </p>
    </div>
  );
};

export default PianoSequenceTask;
