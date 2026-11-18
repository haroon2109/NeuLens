import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  Check, 
  Languages, 
  RotateCcw
} from 'lucide-react';
import { useLanguageStore } from '../../services/language/LanguageManager';
import { SUPPORTED_LANGUAGES } from '../../services/language/translations';
import { SupportedLanguage } from '../../services/language/types';
import { useVoiceAssistantStore } from '../../services/voice/VoiceInstructionEngine';
import { useScreeningStore } from '../../store/screeningStore';
import { patientApi, type LanguageReadinessEntry } from '../../services/portalApi';
import { ClinicalIllustration } from '../../components/ClinicalIllustration';

/**
 * The chooser is English until a language is picked, then it follows the pick.
 * Without this, an Arabic-first participant selects العربية and still has to tick
 * an English consent box and find an English "Continue" button to enter an
 * Arabic session.
 */
const ARABIC_CHROME = {
  back: 'رجوع',
  step: 'الخطوة 3 من 6: اختيار اللغة',
  title: 'اختر لغتك',
  subtitle: 'اختر اللغة التي ترتاح أكثر للتحدث والاستماع بها. ستُقرأ التعليمات الصوتية بهذه اللغة.',
  selected: 'محدَّدة',
  choose: 'اضغط للاختيار',
  tasksReady: 'المهام جاهزة',
  underReview: 'الصياغة قيد المراجعة',
  noticeTitle: 'صياغة المهام بالعربية قيد المراجعة',
  noticeBody:
    'لم تكتمل بعد مراجعة الصياغة العربية ولا اعتمادها سريريًا. النتائج استكشافية وينبغي تفسيرها مع فريق رعايتك، وليست تشخيصًا.',
  acknowledge:
    'أفهم أن صياغة المهام بهذه اللغة لم تكتمل مراجعتها اللغوية والسريرية، وأرغب في المتابعة بالعربية.',
  continue: 'المتابعة إلى التقييم',
  checking: 'جارٍ التحقق من اللغات المتاحة للمهام…',
  footer: 'الإرشاد الصوتي مدعوم بتوليد كلام عربي عالي الجودة.',
  stageLabels: {
    stimulus_translation: 'ترجمة تعليمات المهام',
    back_translation: 'الترجمة العكسية المستقلة',
    cognitive_pretesting: 'الاختبار المعرفي مع المشاركين',
    local_clinical_review: 'المراجعة السريرية المحلية',
    spoken_voice: 'مراجعة الصوت المسموع'
  } as Record<string, string>
};

export const PatientLanguagePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, getTranslation } = useLanguageStore();
  const { speak, stopSpeaking, isSpeaking } = useVoiceAssistantStore();

  const [activeSpeakingLang, setActiveSpeakingLang] = useState<SupportedLanguage | null>(null);

  // Which languages can actually administer the tasks. The registry is the same
  // one the server enforces on submission, so the screen cannot promise more than
  // the API will accept.
  const [readiness, setReadiness] = useState<LanguageReadinessEntry[] | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    let cancelled = false;
    patientApi
      .getLanguageReadiness()
      .then((response) => {
        if (!cancelled) setReadiness(response?.languages ?? null);
      })
      .catch(() => {
        // If readiness cannot be read, the screen must not imply that every
        // language is ready — the server will refuse an unacknowledged one.
        if (!cancelled) setReadiness([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ar = currentLanguage === 'ar';
  const t = ar ? ARABIC_CHROME : null;

  const selectedReadiness = useMemo(
    () => readiness?.find((entry) => entry.id === currentLanguage) ?? null,
    [readiness, currentLanguage]
  );

  const tasksNotReady = selectedReadiness ? !selectedReadiness.taskAdministrationReady : false;
  const readyUnknown = readiness === null;

  // Changing language resets the acknowledgement: it was given for one language.
  const selectLanguage = (langId: SupportedLanguage) => {
    const entry = readiness?.find((item) => item.id === langId);
    if (!entry || !entry.taskAdministrationReady) setAcknowledged(false);
    setLanguage(langId);
    handlePlayGreeting(langId);
  };

  const handlePlayGreeting = (langId: SupportedLanguage) => {
    setLanguage(langId);
    setActiveSpeakingLang(langId);
    const translation = useLanguageStore.getState().getTranslation();
    const greeting = translation.welcome?.spokenWelcome || 'Welcome to Neulens.';
    speak(greeting);
    setTimeout(() => setActiveSpeakingLang(null), 3500);
  };

  const handleContinue = () => {
    if (readyUnknown) return;
    if (tasksNotReady && !acknowledged) return;
    stopSpeaking();
    useScreeningStore.getState().setLanguagePreference({
      language: currentLanguage,
      acknowledged: tasksNotReady ? acknowledged : false,
      acknowledgedAt: tasksNotReady && acknowledged ? new Date().toISOString() : null
    });
    useScreeningStore.getState().setStep('intro');
    navigate('/patient/assessment');
  };

  return (
    <div className="min-h-screen bg-warm text-slate-800 py-10 px-6 flex flex-col justify-between selection:bg-medical-500 selection:text-white">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto w-full mb-6 flex items-center justify-between">
        <Link
          to="/patient"
          className="inline-flex items-center gap-2 text-sm font-bold text-body hover:text-ink bg-white border border-line rounded-2xl px-4 py-2.5 transition-all shadow-card"
        >
          {ar ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t ? t.back : 'Back'}</span>
        </Link>

        <div className="text-xs font-semibold text-muted">
          {t ? t.step : 'Step 3 of 6: Language Preference'}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN LANGUAGE SELECTION CARD                                  */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-3xl mx-auto w-full bg-white border border-line rounded-2xl p-8 sm:p-12 shadow-card text-center space-y-8">
        
        {/* Heading & Subtitle */}
        <div className="space-y-3 max-w-xl mx-auto">
          <ClinicalIllustration variant="language" size="compact" className="mx-auto mb-5" />
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-medical-600 flex items-center justify-center mx-auto mb-2">
            <Languages className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-ink">
            {t ? t.title : 'Choose Your Language'}
          </h1>

          <p className="text-sm sm:text-base text-body leading-relaxed font-normal">
            {t
              ? t.subtitle
              : 'Select the language you feel most comfortable speaking and listening to. All voice instructions will be spoken in this language.'}
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CLEAN, LIGHT LANGUAGE SELECTION BUTTONS                       */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-start">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.id;
            const isCurrentlySpeaking = activeSpeakingLang === lang.id && isSpeaking;

            return (
              <div
                key={lang.id}
                onClick={() => selectLanguage(lang.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between min-h-[120px] cursor-pointer relative group ${
                  isSelected
                    ? 'bg-blue-50/70 border-medical-600 shadow-card ring-2 ring-medical-600/10'
                    : 'bg-white border-line hover:border-slate-300 hover:bg-warm/50'
                }`}
              >
                {/* Top Row: Native Script & Speaker Button */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold font-display text-ink block leading-tight">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-muted font-semibold block mt-1">
                      {lang.name}
                    </span>
                  </div>

                  {/* Speaker Button to listen to voice greeting */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayGreeting(lang.id);
                    }}
                    title={`Listen to sample in ${lang.name}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isCurrentlySpeaking
                        ? 'bg-medical-600 text-white animate-pulse'
                        : isSelected
                        ? 'bg-white border border-medical-200 text-medical-600 hover:bg-medical-50'
                        : 'bg-slate-100 text-muted hover:bg-slate-200 hover:text-slate-800'
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Row: readiness + selection indicator */}
                <div className="pt-3 mt-3 border-t border-line flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-muted">
                    {isSelected ? (t ? t.selected : 'Selected') : (t ? t.choose : 'Tap to choose')}
                  </span>
                  {readiness && (() => {
                    const entry = readiness.find((item) => item.id === lang.id);
                    if (!entry) return null;
                    return entry.taskAdministrationReady ? (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                        {t ? t.tasksReady : 'Tasks ready'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        {t ? t.underReview : 'Wording under review'}
                      </span>
                    );
                  })()}
                  
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-medical-600 text-white flex items-center justify-center shadow-card">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* LANGUAGE READINESS NOTICE                                     */}
        {/* ------------------------------------------------------------- */}
        {tasksNotReady && selectedReadiness && (
          <div className="max-w-xl mx-auto text-start bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-bold text-amber-900">
              {t ? `${t.noticeTitle}` : `${selectedReadiness.nativeName} task wording is still being reviewed`}
            </p>
            <p className="text-sm text-amber-900/90 leading-relaxed">
              {t ? t.noticeBody : selectedReadiness.participantNotice}
            </p>
            <ul className="text-xs text-amber-900/80 list-disc ps-5 space-y-1">
              {selectedReadiness.pendingStages.map((stage) => (
                <li key={stage.key}>{t?.stageLabels[stage.key] || stage.label}</li>
              ))}
            </ul>
            <label className="flex items-start gap-3 py-2 text-sm text-amber-900 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-amber-600"
              />
              <span>
                {t
                  ? t.acknowledge
                  : `I understand that the task wording in this language has not completed linguistic and clinical review, and I want to continue in ${selectedReadiness.nativeName}.`}
              </span>
            </label>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ONE LARGE "CONTINUE" BUTTON                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleContinue}
            disabled={readyUnknown || (tasksNotReady && !acknowledged)}
            className="w-full py-4 px-8 bg-medical-600 hover:bg-medical-700 active:scale-[0.99] text-white text-base sm:text-lg font-bold rounded-2xl shadow-md shadow-medical-600/20 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-medical-600"
          >
            <span>{t ? t.continue : 'Continue to Assessment'}</span>
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </button>
          {readyUnknown && (
            <p className="mt-3 text-xs text-muted">{t ? t.checking : 'Checking which languages can run the tasks…'}</p>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted mt-8">
        {t
          ? t.footer
          : 'Spoken voice guidance is powered by high-fidelity Gnani Timbre speech synthesis in your chosen regional language.'}
      </footer>

    </div>
  );
};