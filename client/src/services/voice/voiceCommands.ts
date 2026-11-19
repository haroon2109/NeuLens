/**
 * Bilingual voice command grammar.
 *
 * Maps a spoken utterance (English or Arabic) to a portal route or a
 * conversational action. Both languages are always matched, so a patient can
 * say "brain health" or "صحة الدماغ" regardless of the UI language.
 */

export type VoiceAction =
  | 'stop'
  | 'repeat'
  | 'language-en'
  | 'language-ar'
  | 'capabilities'
  | 'summary'
  | 'appointments'
  | 'care-plan'
  | 'greeting';

export type VoiceCommand =
  | { kind: 'navigate'; route: string }
  | { kind: 'action'; action: VoiceAction };

interface PhraseSet {
  phrases: string[];
}

const ROUTES: Array<PhraseSet & { route: string }> = [
  {
    route: '/patient/dashboard',
    phrases: ['dashboard', 'home page', 'go home', 'main page', 'لوحة التحكم', 'الرئيسية', 'الصفحة الرئيسية', 'الرئيسيه']
  },
  {
    route: '/patient/brain-health',
    phrases: ['brain health', 'my brain health', 'brain score', 'my brain score', 'صحة الدماغ', 'صحة المخ', 'درجة الدماغ', 'مؤشر الدماغ']
  },
  {
    route: '/patient/timeline',
    phrases: ['timeline', 'my timeline', 'line of time', 'الخط الزمني', 'الجدول الزمني', 'مسار صحتي']
  },
  {
    route: '/patient/assessment/intro',
    phrases: ['start assessment', 'take assessment', 'begin assessment', 'new assessment', 'start the assessment', 'ابدأ التقييم', 'ابدأ الاختبار', 'قيّم نفسي', 'ابدأ الفحص']
  },
  {
    route: '/patient/cognitive',
    phrases: ['cognitive assessment', 'cognitive tests', 'memory tests', 'الاختبار المعرفي', 'التقييم الإدراكي', 'التقييم المعرفي', 'اختبار الذاكرة']
  },
  {
    route: '/patient/cognitive/library',
    phrases: ['task library', 'library', 'games', 'exercises', 'مكتبة المهام', 'المكتبة', 'التمارين', 'الألعاب']
  },
  {
    route: '/patient/history',
    phrases: ['history', 'history page', 'open history', 'my history', 'assessment history', 'past assessments', 'previous tests', 'سجلي', 'تاريخي', 'صفحة السجل', 'فتح السجل', 'التقييمات السابقة', 'نتائجي']
  },
  {
    route: '/patient/daily-function',
    phrases: ['daily function', 'daily activities', 'daily questionnaire', 'الأنشطة اليومية', 'الوظائف اليومية', 'الاستبيان اليومي']
  },
  {
    route: '/patient/documents',
    phrases: ['documents', 'reports and documents', 'my reports', 'my documents', 'المستندات', 'التقارير', 'تقريري', 'وثائقي']
  },
  {
    route: '/patient/trends',
    phrases: ['trends', 'my trends', 'longitudinal trends', 'الاتجاهات', 'اتجاهاتي', 'المسار الزمني']
  },
  {
    route: '/patient/change-detection',
    phrases: ['change detection', 'what changed', 'detect changes', 'تغيير', 'التغيرات', 'تغيّر', 'ما الجديد']
  },
  {
    route: '/patient/health-profile',
    phrases: ['health profile', 'health context', 'my health profile', 'ملفي الصحي', 'الملف الصحي', 'سياقي الصحي']
  },
  {
    route: '/patient/context',
    phrases: ['context overview', 'my context', 'السياق', 'ملخص السياق', 'نظرة على سياقي']
  },
  {
    route: '/patient/context/assessment-conditions',
    phrases: ['assessment conditions', 'my conditions', 'ظروف التقييم', 'حالتي أثناء التقييم']
  },
  {
    route: '/patient/context/sleep',
    phrases: ['sleep', 'my sleep', 'sleep and lifestyle', 'النوم', 'نومي', 'النوم ونمط الحياة']
  },
  {
    route: '/patient/context/wellbeing',
    phrases: ['wellbeing', 'mental wellbeing', 'mental health', 'mood', 'الصحة النفسية', 'رفاهيتي', 'مزاجي']
  },
  {
    route: '/patient/context/clinical',
    phrases: ['clinical history', 'family history', 'clinical and family', 'التاريخ العائلي', 'السجل السريري', 'التاريخ المرضي']
  },
  {
    route: '/patient/prevention-plan',
    phrases: ['prevention plan', 'my plan', 'personalized plan', 'الخطة الوقائية', 'خطتي', 'خطة الوقاية']
  },
  {
    route: '/patient/appointments',
    phrases: ['appointments', 'my appointments', 'consultations', 'المواعيد', 'مواعيدي', 'الاستشارات']
  },
  {
    route: '/patient/care-plan',
    phrases: ['care plan', 'my care plan', 'خطة الرعاية', 'خطة العلاج', 'خطة رعايتي']
  },
  {
    route: '/patient/notifications',
    phrases: ['notifications', 'messages', 'alerts', 'التنبيهات', 'الإشعارات', 'الرسائل']
  },
  {
    route: '/patient/profile',
    phrases: ['my profile', 'profile', 'my details', 'ملفي الشخصي', 'بياناتي الشخصية', 'ملفي']
  },
  {
    route: '/patient/settings',
    phrases: ['settings', 'account settings', 'preferences', 'الإعدادات', 'إعدادات الحساب', 'التفضيلات']
  },
  {
    route: '/patient/privacy',
    phrases: ['privacy', 'privacy and data', 'my data', 'الخصوصية', 'الخصوصية والبيانات', 'بياناتي']
  },
  {
    route: '/patient/help',
    phrases: ['help and support', 'support', 'contact support', 'المساعدة والدعم', 'الدعم', 'تواصل مع الدعم']
  }
];

const ACTIONS: Array<PhraseSet & { action: VoiceAction }> = [
  {
    action: 'stop',
    phrases: ['stop talking', 'stop speaking', 'be quiet', 'silence', 'enough', 'توقف', 'توقفي', 'اسكت', 'كفى', 'أوقف الصوت']
  },
  {
    action: 'repeat',
    phrases: ['repeat', 'say again', 'again please', 'أعد', 'كرر', 'مرة أخرى', 'أعد من فضلك']
  },
  {
    action: 'language-en',
    phrases: ['speak english', 'switch to english', 'in english', 'english please', 'الإنجليزية', 'إنجليزي', 'تكلم إنجليزي']
  },
  {
    action: 'language-ar',
    phrases: ['speak arabic', 'switch to arabic', 'in arabic', 'arabic please', 'بالعربية', 'عربي', 'تكلم عربي']
  },
  {
    action: 'summary',
    phrases: ['how is my brain', 'how am i doing', 'my summary', 'read my summary', 'brain summary', 'كيف صحتي', 'كيف حالتي', 'كيف صحة دماغي', 'ملخصي', 'لخص صحتي']
  },
  {
    action: 'appointments',
    phrases: ['next appointment', 'when is my appointment', 'my next appointment', 'موعدي القادم', 'متى موعدي', 'موعدي']
  },
  {
    action: 'care-plan',
    phrases: ['my care plan status', 'care plan progress', 'what should i do next', 'تقدم خطة الرعاية', 'ماذا أفعل الآن', 'ما هي خطتي']
  },
  {
    action: 'capabilities',
    phrases: ['what can you do', 'what can i say', 'how do you work', 'ماذا تستطيع', 'ماذا يمكنك أن تفعل', 'كيف أسألك']
  },
  {
    action: 'greeting',
    phrases: ['hello', 'hi', 'hey', 'good morning', 'مرحبا', 'أهلا', 'السلام عليكم', 'صباح الخير']
  }
];

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scorePhrase(haystack: string, phrase: string): number {
  const needle = normalize(phrase);
  if (!needle) return 0;
  if (!haystack.includes(needle)) return 0;
  const words = needle.split(' ').length;
  return words * 10 + needle.length;
}

/**
 * Wake phrases. Recognition stays on, but nothing is acted on until one of
 * these is heard — the same pattern as "Hey Jarvis".
 */
const WAKE_WORDS = [
  'hey neulens',
  'hi neulens',
  'ok neulens',
  'okay neulens',
  'hello neulens',
  'neulens',
  'neu lens',
  'new lens',
  'new lense',
  'nulens',
  'nu lens',
  'neu lenses',
  'assistant',
  'hey assistant',
  'يا نيولينز',
  'مرحبا نيولينز',
  'أهلا نيولينز',
  'السلام عليكم نيولينز',
  'نيو لينز',
  'نيولينز',
  'نيو لنس'
];

/**
 * Detects the wake word and returns whatever was said after it, so
 * "Hey NeuLens, open my reports" runs the command immediately.
 */
export function extractWakeWord(transcript: string): { wake: boolean; rest: string } {
  const normalized = normalize(transcript);
  if (!normalized) return { wake: false, rest: '' };

  let bestIndex = -1;
  let bestLength = 0;

  for (const word of WAKE_WORDS) {
    const needle = normalize(word);
    const index = normalized.indexOf(needle);
    if (index === -1) continue;
    // Prefer the longest matching wake phrase at the earliest position.
    if (bestIndex === -1 || index < bestIndex || (index === bestIndex && needle.length > bestLength)) {
      bestIndex = index;
      bestLength = needle.length;
    }
  }

  // Fuzzy fallback: browsers often mishear "NeuLens" as a similar word.
  if (bestIndex === -1) {
    const tokens = normalized.split(' ');
    for (let i = 0; i < tokens.length; i += 1) {
      if (tokens[i].length < 4) continue;
      if (editDistance(tokens[i], 'neulens') <= 2) {
        bestIndex = normalized.indexOf(tokens[i]);
        bestLength = tokens[i].length;
        break;
      }
    }
  }

  if (bestIndex === -1) return { wake: false, rest: '' };

  // "neulense" can match "neulens" and leave a stray letter behind; that is
  // an acknowledgement, not a command.
  const rest = normalized.slice(bestIndex + bestLength).trim();
  return { wake: true, rest: rest.length < 2 ? '' : rest };
}

/**
 * True for utterances phrased as a question, so "what does my brain health
 * score mean?" is answered rather than treated as navigation.
 */
export function looksLikeQuestion(transcript: string): boolean {
  const text = transcript.trim();
  if (!text) return false;
  if (/[?؟]$/.test(text)) return true;
  return /^(what|why|how|when|where|who|can you|could you|do i|should i|is my|are my|will i)\b/i.test(text) ||
    /^(لماذا|كيف|ماذا|ما |هل|متى|أين|اين|هل يمكن)/.test(text);
}

/** Small Levenshtein helper used for fuzzy wake-word matching. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  const text = normalize(transcript);
  if (!text) return null;

  let best: { score: number; command: VoiceCommand } | null = null;

  for (const entry of ROUTES) {
    for (const phrase of entry.phrases) {
      const score = scorePhrase(text, phrase);
      if (score > 0 && (!best || score > best.score)) {
        best = { score, command: { kind: 'navigate', route: entry.route } };
      }
    }
  }

  for (const entry of ACTIONS) {
    for (const phrase of entry.phrases) {
      // Actions win ties: a patient asking "when is my appointment" wants an
      // answer, not a page.
      const score = scorePhrase(text, phrase) + 1;
      if (score > 0 && (!best || score > best.score)) {
        best = { score, command: { kind: 'action', action: entry.action } };
      }
    }
  }

  return best && best.score >= 10 ? best.command : null;
}
