import React, { useState } from 'react';
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
import { ClinicalIllustration } from '../../components/ClinicalIllustration';

export const PatientLanguagePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, getTranslation } = useLanguageStore();
  const { speak, stopSpeaking, isSpeaking } = useVoiceAssistantStore();

  const [activeSpeakingLang, setActiveSpeakingLang] = useState<SupportedLanguage | null>(null);

  const handleSelectLanguage = (langId: SupportedLanguage) => {
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
    stopSpeaking();
    useScreeningStore.getState().setStep('intro');
    navigate('/patient/assessment');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-10 px-6 flex flex-col justify-between selection:bg-medical-500 selection:text-white">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto w-full mb-6 flex items-center justify-between">
        <Link
          to="/patient"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        <div className="text-xs font-semibold text-slate-400">
          Step 3 of 6: Language Preference
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN LANGUAGE SELECTION CARD                                  */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-3xl mx-auto w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8">
        
        {/* Heading & Subtitle */}
        <div className="space-y-3 max-w-xl mx-auto">
          <ClinicalIllustration variant="language" size="compact" className="mx-auto mb-5" />
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-medical-600 flex items-center justify-center mx-auto mb-2">
            <Languages className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900">
            Choose Your Language
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Select the language you feel most comfortable speaking and listening to. All voice instructions will be spoken in this language.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CLEAN, LIGHT LANGUAGE SELECTION BUTTONS                       */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.id;
            const isCurrentlySpeaking = activeSpeakingLang === lang.id && isSpeaking;

            return (
              <div
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-150 flex flex-col justify-between min-h-[120px] cursor-pointer relative group ${
                  isSelected
                    ? 'bg-blue-50/70 border-medical-600 shadow-sm ring-2 ring-medical-600/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Top Row: Native Script & Speaker Button */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 block leading-tight">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold block mt-1">
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
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Row: Selected Checkmark indicator */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    {isSelected ? 'Selected' : 'Tap to choose'}
                  </span>
                  
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-medical-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ONE LARGE "CONTINUE" BUTTON                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-4 px-8 bg-medical-600 hover:bg-medical-700 active:scale-[0.99] text-white text-base sm:text-lg font-bold rounded-2xl shadow-md shadow-medical-600/20 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Continue to Assessment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-8">
        Spoken voice guidance is powered by high-fidelity Gnani Timbre speech synthesis in your chosen regional language.
      </footer>

    </div>
  );
};