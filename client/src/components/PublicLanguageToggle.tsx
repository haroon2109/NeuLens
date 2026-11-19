import React from 'react';
import { useLanguageStore } from '../services/language/LanguageManager';

const NAMES: Record<'en' | 'ar', string> = {
  en: 'English',
  ar: 'العربية',
};

/**
 * Two-way language switch for the public site. The portal has its own header
 * switcher, but a visitor has to be able to choose Arabic before signing in.
 */
export const PublicLanguageToggle: React.FC<{
  tone?: 'light' | 'dark';
  className?: string;
}> = ({ tone = 'light', className = '' }) => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const isArabic = currentLanguage === 'ar';

  return (
    <div
      role="group"
      aria-label={isArabic ? 'لغة الموقع' : 'Site language'}
      className={`inline-flex items-center gap-0.5 rounded-full border p-0.5 ${
        tone === 'dark' ? 'border-white/25' : 'border-nl-line bg-white'
      } ${className}`}
    >
      {(['en', 'ar'] as const).map((lang) => {
        const active = currentLanguage === lang;
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            aria-pressed={active}
            onClick={() => setLanguage(lang)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active
                ? tone === 'dark'
                  ? 'bg-white text-nl-forest-deep'
                  : 'bg-nl-mint text-nl-forest'
                : tone === 'dark'
                  ? 'text-white/75 hover:text-white'
                  : 'text-nl-muted hover:text-nl-forest'
            }`}
          >
            {NAMES[lang]}
          </button>
        );
      })}
    </div>
  );
};

export default PublicLanguageToggle;
