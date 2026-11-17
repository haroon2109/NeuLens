import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Download, Ear, Keyboard, Volume2 } from 'lucide-react';
import {
  ACCESSIBLE_CHECKIN_VALIDATION,
  ARABIC_FUNCTIONAL_COPY,
  ARABIC_WORD_DISTRACTORS,
  ARABIC_WORD_LIST,
  ARABIC_WORDLIST_COPY,
  type DraftWordItem
} from './draftArabicCheckin';

type Phase = 'intro' | 'word-study' | 'word-recall' | 'functional' | 'complete';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

function speakArabic(text: string, onEnd?: () => void) {
  if (!canSpeak()) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar';
    utterance.rate = 0.9;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}

function speakSequence(texts: string[], onEnd?: () => void) {
  if (texts.length === 0) {
    onEnd?.();
    return;
  }
  const [first, ...rest] = texts;
  speakArabic(first, () => {
    window.setTimeout(() => speakSequence(rest, onEnd), 350);
  });
}

const LargeButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean }> = ({
  pressed,
  className = '',
  children,
  ...props
}) => (
  <button
    type="button"
    aria-pressed={pressed}
    className={`min-h-14 w-full rounded-2xl border-2 px-4 py-3 text-right text-lg font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
      pressed
        ? 'border-blue-700 bg-blue-50 text-blue-900'
        : 'border-slate-300 bg-white text-slate-900 hover:border-blue-500 hover:bg-slate-50'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const AccessibleArabicCheckinPage: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [statusMessage, setStatusMessage] = useState('');
  const [ttsAvailable] = useState(canSpeak());

  const studyWords = useMemo(() => ARABIC_WORD_LIST, []);
  const recallOptions = useMemo(
    () => shuffle<DraftWordItem>([...ARABIC_WORD_LIST, ...ARABIC_WORD_DISTRACTORS]),
    []
  );
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [wordRecallDone, setWordRecallDone] = useState(false);

  const [functionalIndex, setFunctionalIndex] = useState(0);
  const [functionalResponses, setFunctionalResponses] = useState<Record<string, number | 'skipped'>>({});

  const [record, setRecord] = useState<any | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase, functionalIndex, wordRecallDone]);

  useEffect(() => () => {
    if (canSpeak()) window.speechSynthesis.cancel();
  }, []);

  const announce = useCallback((message: string) => setStatusMessage(message), []);

  const readStudyWords = useCallback(() => {
    announce('جارٍ قراءة الكلمات.');
    speakSequence(
      [ARABIC_WORDLIST_COPY.studyIntro, ...studyWords.map((w) => w.ar)],
      () => announce('اكتملت قراءة الكلمات. يمكنك الاستماع مرة أخرى أو المتابعة إلى الاختيار.')
    );
  }, [announce, studyWords]);

  const toggleWord = (id: string) => {
    setSelectedWordIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const confirmRecall = () => {
    setWordRecallDone(true);
    const studiedIds = new Set(studyWords.map((w) => w.id));
    const correct = selectedWordIds.filter((id) => studiedIds.has(id)).length;
    announce(`تم حفظ اختياراتك. عدد الكلمات الصحيحة من القائمة: ${correct} من ${studyWords.length}.`);
  };

  const answerFunctional = (value: number | 'skipped') => {
    const item = ARABIC_FUNCTIONAL_COPY.items[functionalIndex];
    setFunctionalResponses((current) => ({ ...current, [item.id]: value }));
    if (functionalIndex + 1 < ARABIC_FUNCTIONAL_COPY.items.length) {
      setFunctionalIndex((i) => i + 1);
      announce('السؤال التالي.');
    } else {
      finish({ ...functionalResponses, [item.id]: value });
    }
  };

  const finish = (finalFunctional = functionalResponses) => {
    const studiedIds = new Set(studyWords.map((w) => w.id));
    const recognised = selectedWordIds.filter((id) => studiedIds.has(id));
    const falsePositives = selectedWordIds.filter((id) => !studiedIds.has(id));
    const result = {
      pathway: ACCESSIBLE_CHECKIN_VALIDATION.pathway,
      validation: ACCESSIBLE_CHECKIN_VALIDATION,
      administration: {
        mode: 'ACCESSIBLE_NO_CAMERA_NO_MIC',
        sensoryRoute: ttsAvailable ? 'ON_SCREEN_KEYBOARD_WITH_BROWSER_TTS' : 'ON_SCREEN_KEYBOARD',
        cameraUsed: false,
        microphoneUsed: false,
        visionRequired: false,
        input: 'BUTTONS_AND_KEYBOARD',
        language: 'ar',
        bcp47: 'ar-AE',
        direction: 'rtl',
        completedAt: new Date().toISOString()
      },
      wordListRecall: {
        taskId: 'memory.word-list',
        studiedWordIds: studyWords.map((w) => w.id),
        selectedWordIds,
        recognisedWordIds: recognised,
        falsePositiveIds: falsePositives,
        recognisedCount: recognised.length,
        studiedCount: studyWords.length,
        // Recorded counts only. Not a validated score.
        scoring: 'RECORDED_COUNTS_ONLY_NOT_A_VALIDATED_SCORE'
      },
      functionalCheckIn: {
        items: ARABIC_FUNCTIONAL_COPY.items.map((item) => ({
          id: item.id,
          response: finalFunctional[item.id] ?? 'skipped'
        }))
      },
      clinicianNotice:
        'Draft Arabic wording, not validated (forward translation, independent back-translation, 5 cognitive interviews including low education and sensory impairment, and local clinical sign-off are pending). Administered without camera/microphone; not part of the Neulens composite; not a diagnosis or risk score.'
    };
    setRecord(result);
    setPhase('complete');
    announce('اكتملت المتابعة. تم إعداد سجل مسودّة غير مُحقَّق.');
  };

  const downloadRecord = () => {
    if (!record) return;
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessible-checkin-draft-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentFunctional = ARABIC_FUNCTIONAL_COPY.items[functionalIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl" lang="ar">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white">
        تخطَّ إلى المحتوى
      </a>
      <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <div aria-live="polite" aria-atomic="true" className="sr-only">{statusMessage}</div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Link to="/patient" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400">
            العودة
          </Link>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-300"><Keyboard className="h-3.5 w-3.5" /> لوحة مفاتيح / أزرار</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-300"><Ear className="h-3.5 w-3.5" /> قارئ شاشة</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-300"><Volume2 className="h-3.5 w-3.5" /> قراءة بصوت (اختياري)</span>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950" role="note">
          <p className="flex items-start gap-2 font-bold">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            مسار تجريبي غير مُحقَّق (مسودّة)
          </p>
          <p className="mt-1 text-sm leading-6">
            صياغة عربية أولية لمسار بدون كاميرا أو ميكروفون: لم تُستكمل الترجمة العكسية المستقلة، ولا المقابلات المعرفية (بما فيها تعليم منخفض ومرتفع وإعاقة حسية)، ولا اعتماد سريري محلي. هذا المسار ليس أداة مُحقَّقة ولا تشخيصًا ولا درجة خطر، ولا يُدمج في الدرجة المركّبة.
          </p>
          <p className="mt-1 text-xs text-amber-900" dir="ltr" lang="en">
            Draft, not validated. No camera, no microphone. Not a score, not a diagnosis. Evidence protocol: {ACCESSIBLE_CHECKIN_VALIDATION.evidenceDoc}
          </p>
        </div>

        {phase === 'intro' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-slate-900 sm:text-3xl">متابعة مبسطة يمكن الوصول إليها (عربي)</h1>
            <p className="mt-2 text-base leading-7 text-slate-700" dir="ltr" lang="en">
              Accessible Arabic check-in: word-list recall and a daily-function check-in. Completable with buttons and keyboard, compatible with screen readers, and with optional browser read-aloud (audio output only). No camera, no microphone, no movement sensor.
            </p>
            <ul className="mt-4 space-y-2 text-base text-slate-800">
              <li>• تذكّر قائمة كلمات (بدون كاميرا/ميكروفون).</li>
              <li>• أسئلة عن الأنشطة اليومية (4 أسئلة، يمكن تخطي أي منها).</li>
              <li>• يمكنك استخدام لوحة المفاتيح أو قارئ الشاشة أو تكبير النص.</li>
              {!ttsAvailable && <li>• ميزة القراءة الصوتية غير متاحة في هذا المتصفح؛ يمكنك القراءة من الشاشة أو باستخدام قارئ الشاشة.</li>}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => { setPhase('word-study'); announce('بدأ نشاط تذكّر الكلمات.'); }}
                className="min-h-14 rounded-2xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              >
                ابدأ المتابعة
              </button>
            </div>
          </section>
        )}

        {phase === 'word-study' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-slate-900">{ARABIC_WORDLIST_COPY.title}</h1>
            <p className="mt-1 text-sm text-slate-600" dir="ltr" lang="en">{ARABIC_WORDLIST_COPY.titleEn} — study phase, no time limit, no auto-advance.</p>
            <p className="mt-4 text-lg leading-8 text-slate-800">{ARABIC_WORDLIST_COPY.studyIntro}</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="قائمة الكلمات">
              {studyWords.map((word) => (
                <li key={word.id} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-xl font-semibold text-slate-900">
                  {word.ar} <span className="text-sm font-normal text-slate-600" dir="ltr" lang="en">({word.en})</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={readStudyWords}
                disabled={!ttsAvailable}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-lg font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              >
                <Volume2 className="h-5 w-5" /> {ARABIC_WORDLIST_COPY.readAloud}
              </button>
              <button
                type="button"
                onClick={readStudyWords}
                disabled={!ttsAvailable}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-lg font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              >
                {ARABIC_WORDLIST_COPY.readAgain}
              </button>
              <button
                type="button"
                onClick={() => { setPhase('word-recall'); announce('اختر الآن كل كلمة تتذكرها من القائمة.'); }}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              >
                {ARABIC_WORDLIST_COPY.ready}
              </button>
            </div>
            {!ttsAvailable && (
              <p className="mt-3 text-sm text-slate-600">القراءة الصوتية التلقائية غير متاحة في هذا المتصفح. يمكنك قراءة الكلمات أعلاه أو استخدام قارئ الشاشة، ثم المتابعة عندما تكون جاهزًا.</p>
            )}
          </section>
        )}

        {phase === 'word-recall' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-slate-900">{ARABIC_WORDLIST_COPY.recallPrompt}</h1>
            <p className="mt-1 text-base text-slate-700">{ARABIC_WORDLIST_COPY.recallHelper}</p>
            <p className="mt-1 text-sm text-slate-600" dir="ltr" lang="en">{ARABIC_WORDLIST_COPY.recallPromptEn} {ARABIC_WORDLIST_COPY.recallHelperEn}</p>

            {!wordRecallDone ? (
              <>
                <fieldset className="mt-5">
                  <legend className="sr-only">الكلمات</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {recallOptions.map((word) => {
                      const pressed = selectedWordIds.includes(word.id);
                      return (
                        <LargeButton key={word.id} pressed={pressed} onClick={() => toggleWord(word.id)}>
                          <span className="flex items-center justify-between gap-3">
                            <span>{word.ar}</span>
                            {pressed && <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />}
                          </span>
                        </LargeButton>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={confirmRecall}
                    className="min-h-14 rounded-2xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
                  >
                    {ARABIC_WORDLIST_COPY.confirm}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-800">
                  تم حفظ اختياراتك (عدد مطابق للقائمة: {selectedWordIds.filter((id) => studyWords.some((w) => w.id === id)).length} من {studyWords.length}). هذا تعداد مسجّل فقط وليس درجة مُحقَّقة.
                </p>
                <button
                  type="button"
                  onClick={() => { setPhase('functional'); announce('أسئلة عن الأنشطة اليومية.'); }}
                  className="min-h-14 rounded-2xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
                >
                  {ARABIC_WORDLIST_COPY.next}: {ARABIC_FUNCTIONAL_COPY.title}
                </button>
              </div>
            )}
          </section>
        )}

        {phase === 'functional' && currentFunctional && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-slate-900">{ARABIC_FUNCTIONAL_COPY.title}</h1>
            <p className="mt-2 text-base leading-7 text-slate-700">{ARABIC_FUNCTIONAL_COPY.intro}</p>
            <p className="mt-1 text-sm text-slate-600" dir="ltr" lang="en">{ARABIC_FUNCTIONAL_COPY.introEn}</p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-600">سؤال {functionalIndex + 1} من {ARABIC_FUNCTIONAL_COPY.items.length}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{ARABIC_FUNCTIONAL_COPY.prompt}</p>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{currentFunctional.ar}</h2>
              <p className="text-sm text-slate-600" dir="ltr" lang="en">{currentFunctional.en}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {ARABIC_FUNCTIONAL_COPY.options.map((option) => (
                <LargeButton key={option.value} onClick={() => answerFunctional(option.value)}>
                  <span className="block">{option.ar}</span>
                  <span className="block text-sm font-normal text-slate-600" dir="ltr" lang="en">{option.en}</span>
                </LargeButton>
              ))}
              <button
                type="button"
                onClick={() => answerFunctional('skipped')}
                className="min-h-14 w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-lg font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              >
                {ARABIC_FUNCTIONAL_COPY.skip}
              </button>
            </div>
          </section>
        )}

        {phase === 'complete' && record && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 ref={headingRef} tabIndex={-1} className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" /> اكتملت المتابعة (مسودّة)
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-700">{record.clinicianNotice}</p>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2" dir="ltr" lang="en">
              <div className="rounded-xl bg-slate-50 p-3"><dt className="font-semibold text-slate-600">Administration</dt><dd>No camera, no microphone, {record.administration.sensoryRoute}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="font-semibold text-slate-600">Validation</dt><dd>{record.validation.status} (see evidence protocol)</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="font-semibold text-slate-600">Word-list (recorded counts)</dt><dd>{record.wordListRecall.recognisedCount} / {record.wordListRecall.studiedCount} recognised, {record.wordListRecall.falsePositiveIds.length} false positive(s) — not a validated score</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="font-semibold text-slate-600">Functional check-in</dt><dd>{record.functionalCheckIn.items.filter((i: any) => i.response !== 'skipped').length} / 4 answered</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={downloadRecord} className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-lg font-bold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400">
                <Download className="h-5 w-5" /> تنزيل السجل (JSON)
              </button>
              <Link to="/patient" className="inline-flex min-h-14 items-center rounded-2xl border-2 border-slate-300 bg-white px-6 py-3 text-lg font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400">
                العودة إلى البوابة
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-600" dir="ltr" lang="en">
              This record is stored only when you download it. A telephone/IVR script for the same two tasks is designed but not implemented; see the evidence protocol.
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AccessibleArabicCheckinPage;
