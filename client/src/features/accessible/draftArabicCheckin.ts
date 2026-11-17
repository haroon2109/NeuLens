/**
 * Draft Arabic content for the accessible, sensor-free check-in pathway
 * (word-list recall + daily-function check-in).
 *
 * STATUS: DRAFT — NOT VALIDATED.
 * This wording has NOT completed forward-translation review, independent
 * back-translation, cognitive interviewing (including low education and
 * sensory impairment), or local clinical sign-off. It must not be treated as a
 * validated instrument and must not be described as locally adapted.
 *
 * Evidence container and protocol:
 *   docs/future-health-challenge/ARABIC_ACCESSIBLE_PATHWAY_VALIDATION.md
 */

export type ValidationStatus = 'DRAFT_NOT_VALIDATED';

export interface DraftWordItem {
  /** Stable English source id, used for scoring/recording. */
  id: string;
  /** Arabic display/reading form (draft). */
  ar: string;
  /** English source word (for the record and back-translation). */
  en: string;
}

export const ACCESSIBLE_CHECKIN_VALIDATION = {
  status: 'DRAFT_NOT_VALIDATED' as ValidationStatus,
  pathway: 'accessible-arabic-wordlist-functional-v1',
  requires: [
    'forward_translation_review',
    'independent_back_translation',
    'cognitive_pretesting_low_education_x2',
    'cognitive_pretesting_high_education_x2',
    'cognitive_pretesting_sensory_impairment_x1',
    'local_clinical_sign_off'
  ],
  evidenceDoc: 'docs/future-health-challenge/ARABIC_ACCESSIBLE_PATHWAY_VALIDATION.md',
  note:
    'Draft wording. Not validated. Administered without camera, microphone or motion sensor; recorded as a response set for clinician review, not as a validated score or diagnosis.'
};

export const ARABIC_WORD_LIST: DraftWordItem[] = [
  { id: 'river', ar: 'نهر', en: 'River' },
  { id: 'lamp', ar: 'مصباح', en: 'Lamp' },
  { id: 'bread', ar: 'خبز', en: 'Bread' },
  { id: 'chair', ar: 'كرسي', en: 'Chair' },
  { id: 'garden', ar: 'حديقة', en: 'Garden' },
  { id: 'pencil', ar: 'قلم رصاص', en: 'Pencil' },
  { id: 'window', ar: 'نافذة', en: 'Window' },
  { id: 'basket', ar: 'سلة', en: 'Basket' }
];

/** Distractors for recognition (not in the studied list). Draft wording. */
export const ARABIC_WORD_DISTRACTORS: DraftWordItem[] = [
  { id: 'spoon', ar: 'ملعقة', en: 'Spoon' },
  { id: 'market', ar: 'سوق', en: 'Market' },
  { id: 'clock', ar: 'ساعة', en: 'Clock' },
  { id: 'key', ar: 'مفتاح', en: 'Key' }
];

export const ARABIC_WORDLIST_COPY = {
  title: 'تذكّر قائمة الكلمات',
  titleEn: 'Word list recall',
  studyIntro:
    'سيتم عرض كلمات عليك ويمكن سماعها. استمع أو اقرأ جيدًا. يمكنك طلب سماعها مرة أخرى. عندما تكون جاهزًا، اختر كل كلمة تتذكرها.',
  studyIntroEn:
    'Words will be shown and can be read aloud. Listen or read carefully. You can hear them again. When ready, choose every word you remember.',
  readAloud: 'اقرأ الكلمات بصوت عالٍ',
  readAloudEn: 'Read the words aloud',
  readAgain: 'أعد قراءة الكلمات',
  readAgainEn: 'Read the words again',
  ready: 'أنا جاهز للاختيار',
  readyEn: 'I am ready to choose',
  recallPrompt: 'اختر كل كلمة كانت في القائمة.',
  recallPromptEn: 'Select every word that was in the list.',
  recallHelper: 'اختر كل ما ينطبق. لا يوجد حد للوقت.',
  recallHelperEn: 'Choose all that apply. There is no time limit.',
  confirm: 'تأكيد الاختيارات',
  confirmEn: 'Confirm choices',
  next: 'التالي',
  nextEn: 'Next'
};

export interface FunctionalItem {
  id: 'appointments' | 'medication' | 'finances' | 'household';
  ar: string;
  en: string;
}

export interface FunctionalOption {
  value: 0 | 1 | 2;
  ar: string;
  en: string;
}

export const ARABIC_FUNCTIONAL_COPY = {
  title: 'متابعة الأنشطة اليومية',
  titleEn: 'Daily activities check-in',
  intro:
    'هذه الأسئلة عن الأنشطة اليومية. ليست اختبارًا وليست تشخيصًا. لا توجد إجابات صحيحة أو خاطئة. يمكنك تخطي أي سؤال.',
  introEn:
    'These questions are about everyday activities. Not a test and not a diagnosis. There are no right or wrong answers. You can skip any question.',
  prompt: 'بالمقارنة مع قدرتك المعتادة، كيف تسير هذه الأنشطة؟',
  promptEn: 'Compared with your usual ability, how are these activities going?',
  items: [
    { id: 'appointments', ar: 'تذكّر المواعيد', en: 'Remembering appointments' },
    { id: 'medication', ar: 'إدارة الأدوية', en: 'Managing medicines' },
    { id: 'finances', ar: 'التعامل مع المال أو الفواتير', en: 'Handling money or bills' },
    { id: 'household', ar: 'إعداد وجبة بسيطة أو القيام بالأعمال المنزلية', en: 'Preparing a simple meal or doing household tasks' }
  ] as FunctionalItem[],
  options: [
    { value: 0, ar: 'كما المعتاد تقريبًا', en: 'About the same' },
    { value: 1, ar: 'أصبح أصعب', en: 'More difficult' },
    { value: 2, ar: 'أحتاج مساعدة أكبر', en: 'I need more help' }
  ] as FunctionalOption[],
  skip: 'تخطَّ هذا السؤال',
  skipEn: 'Skip this question',
  finish: 'إنهاء المتابعة',
  finishEn: 'Finish check-in'
};
