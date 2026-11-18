import { useLanguageStore } from '../../services/language/LanguageManager';
import type { SupportedLanguage } from '../../services/language/types';

/**
 * Language copy for the screening surface itself.
 *
 * The portal chrome and the functional check-in already use the translation
 * files. The activity instructions did not, so an Arabic session showed Arabic
 * navigation followed by English task prompts. This module is the single source
 * for the wording a participant sees while being assessed.
 *
 * Arabic wording here is a working translation. It is NOT a validated Arabic
 * administration: translation/back-translation, cognitive interviews and local
 * sign-off are still outstanding, and the language registry keeps Arabic tasks
 * marked as not ready for administration.
 */

export interface ScreeningCopy {
  intro: {
    title: string;
    body: string;
    listenTitle: string;
    listenHelp: string;
    cameraNeeded: string;
    allowCamera: string;
    cameraReady: string;
    preparing: string;
    start: string;
  };
  header: {
    repeat: string;
    activities: [string, string, string, string, string];
  };
  announcements: [string, string, string, string, string];
  game1: {
    title: string;
    body: string;
    targets: string;
    camera: string;
    notMeasured: string;
    completeTitle: string;
    completeBody: string;
    continueTo2: string;
  };
  game2: {
    title: string;
    body: string;
  };
  game3: {
    title: string;
    body: string;
    hear: string;
    recordedWords: string;
    tapToSpeak: string;
    recording: string;
    recorded: string;
    analysing: string;
    continueTo4: string;
  };
  game4: {
    title: string;
    body: string;
    hear: string;
    expressionOf: (index: number, total: number) => string;
    next: string;
    continueTo5: string;
    unavailableTitle: string;
    unavailableBody: string;
    continueWithout: string;
    cameraStarting: string;
    expressions: Array<{ key: string; label: string; prompt: string }>;
  };
  game5: {
    title: string;
    body: string;
    hear: string;
    hearText: string;
    nextNumber: string;
  };
  calibration: {
    title: string;
    body: string;
    pointOf: (index: number, total: number) => string;
    checking: string;
    cameraUnavailable: string;
    starting: string;
    continueWithout: string;
    failedEyes: string;
    failedFit: string;
    tryAgain: string;
    continueAnyway: string;
    distance: string;
  };
  sensor: {
    aligned: string;
    alignFace: string;
    detected: string;
    speakToTest: string;
    micLevel: string;
    testVoice: string;
    calibrationProgress: string;
    initializingCamera: string;
    levelGood: string;
    levelFair: string;
    levelPoor: string;
  };
  saving: {
    savingTitle: string;
    savingBody: string;
    errorTitle: string;
    errorBody: string;
    errorDetailLabel: string;
    retry: string;
    waiting: string;
    secure: string;
  };
  chrome: {
    textLabel: string;
    repeatGuidance: string;
    repeatShort: string;
    help: string;
    footer: string;
  };
  completion: {
    title: string;
    thanks: string;
    badge: string;
    identifierLabel: string;
    nameLabel: string;
    dateLabel: string;
    keepNote: string;
    download: string;
    downloaded: string;
    print: string;
    returnHome: string;
    confidential: string;
  };
}

const en: ScreeningCopy = {
  intro: {
    title: "Let's Begin",
    body: 'We will guide you through a few simple activities. Listen carefully and follow each instruction. Take your time.',
    listenTitle: 'Listen to Instructions',
    listenHelp:
      'You can listen to instructions aloud at any time during an activity by pressing "Repeat Instructions".',
    cameraNeeded: 'Camera and microphone access are needed to continue',
    allowCamera: 'Please allow camera and microphone access to proceed',
    cameraReady: 'Camera and microphone are ready',
    preparing: 'Preparing camera and microphone...',
    start: 'Start Assessment'
  },
  header: {
    repeat: 'Repeat Instructions',
    activities: [
      'Activity 1 of 5: Eye Movement Tracking',
      'Activity 2 of 5: Memory Match',
      'Activity 3 of 5: Spoken Repeat',
      'Activity 4 of 5: Facial Movement',
      'Activity 5 of 5: Number Path'
    ]
  },
  announcements: [
    'Activity 1 of 5: Focus Orbit. Tap or focus the moving blue circle and press Enter when it appears.',
    'Activity 2 of 5: Cortex Match. Turn over two cards at a time and match the pairs.',
    'Activity 3 of 5: Spoken Repeat. Say the sentence you hear out loud.',
    'Activity 4 of 5: Facial Movement. Copy the expression shown on the screen.',
    'Activity 5 of 5: Connect the Numbers. Press the number keys 1 to 6 in order, or tap each circle.'
  ],
  game1: {
    title: 'Follow the Moving Circle',
    body: 'Keep your eyes on the blue circle as it moves. You can also touch it on the screen.',
    targets: 'Targets Completed',
    camera: 'Camera',
    notMeasured: 'Not measured',
    completeTitle: 'Activity 1 Complete',
    completeBody: 'Great job! You have completed the first activity.',
    continueTo2: 'Continue to Activity 2'
  },
  game2: {
    title: 'Find the Matching Pairs',
    body: 'Tap cards to turn them over and match pairs with identical symbols.'
  },
  game3: {
    title: 'Repeat the Sentence Aloud',
    body: 'Listen to the sentence, then tap the microphone button and read it aloud clearly.',
    hear: 'Hear Sentence Aloud',
    recordedWords: 'Recorded Words',
    tapToSpeak: 'Tap Microphone to Speak',
    recording: 'Recording... Tap to Stop',
    recorded: 'Voice Recorded Successfully!',
    analysing: 'Analysing voice…',
    continueTo4: 'Continue to Activity 4'
  },
  game4: {
    title: 'Activity 4: Facial Expressions',
    body: 'Look at the camera and make the facial expression shown below.',
    hear: 'Hear Instruction Aloud',
    expressionOf: (index, total) => `Expression ${index} of ${total}`,
    next: 'Next Expression',
    continueTo5: 'Continue to Activity 5',
    unavailableTitle: 'Camera not available',
    unavailableBody:
      'This activity reads facial movement through the camera, so it cannot be scored without one. It will be recorded as not measured — the rest of the assessment still counts.',
    continueWithout: 'Continue without this activity',
    cameraStarting: 'Starting camera...',
    expressions: [
      { key: 'smile', label: '🙂 Smile', prompt: 'Please smile naturally' },
      { key: 'relax', label: '😐 Relax', prompt: 'Please relax your face' },
      { key: 'blink', label: '😉 Blink', prompt: 'Please blink your eyes naturally' },
      { key: 'mouth', label: '😲 Open Mouth', prompt: 'Please open your mouth gently' }
    ]
  },
  game5: {
    title: 'Activity 5: Connect the Numbers',
    body: 'Tap each numbered circle in order, starting from 1 to 6.',
    hear: 'Hear Instructions',
    hearText: 'Tap each numbered circle in order, starting from number 1 up to number 6.',
    nextNumber: 'Next Number to Tap'
  },
  calibration: {
    title: 'Quick camera check',
    body: 'Look at each blue dot as it appears. This helps the camera understand where you are looking. It takes about ten seconds.',
    pointOf: (index, total) => `Point ${index} of ${total}`,
    checking: 'Checking calibration…',
    cameraUnavailable: 'The camera is not available right now. You can continue without the eye activity.',
    starting: 'Starting the camera…',
    continueWithout: 'Continue without calibration',
    failedEyes: 'We could not see your eyes clearly at that point. Let us try again.',
    failedFit:
      'The calibration did not line up well enough. You can try again, or continue without it — the activity still works.',
    tryAgain: 'Try again',
    continueAnyway: 'Continue anyway',
    distance: "Sit about an arm's length from the screen and keep your head still."
  },
  sensor: {
    aligned: 'Aligned',
    alignFace: 'Align Face',
    detected: 'Detected',
    speakToTest: 'Speak to Test',
    micLevel: 'Microphone Input Level',
    testVoice: 'Test AI Voice Output',
    calibrationProgress: 'Calibration Progress',
    initializingCamera: 'Initializing camera sensor...',
    levelGood: 'good',
    levelFair: 'fair',
    levelPoor: 'poor'
  },
  saving: {
    savingTitle: 'Saving Your Assessment...',
    savingBody:
      'Please wait while your screening activities are securely saved. You will receive your confirmation shortly.',
    errorTitle: 'Assessment Not Saved',
    errorBody: 'Your activities were not saved, so no result was produced.',
    errorDetailLabel: 'Technical detail',
    retry: 'Retry saving',
    waiting: 'Your completion confirmation is waiting for a successful save',
    secure: 'Secure Hospital Connection'
  },
  chrome: {
    textLabel: 'Text',
    repeatGuidance: 'Repeat Spoken Guidance',
    repeatShort: 'Repeat',
    help: 'Help',
    footer: 'Hospital Neurological Screening Session • Private & Secure'
  },
  completion: {
    title: 'Assessment Completed',
    thanks: 'Thank you. You have completed your screening activities.',
    badge: 'Completed',
    identifierLabel: 'Your Patient Identifier',
    nameLabel: 'Patient Name',
    dateLabel: 'Completed On',
    keepNote:
      'Please keep this Patient ID safe for future reference. When returning to the clinic or speaking with your doctor, provide this ID number.',
    download: 'Download Slip (.txt)',
    downloaded: 'Downloaded!',
    print: 'Print Confirmation',
    returnHome: 'Return to Home',
    confidential: 'Confidential clinical record • Session safely closes on return'
  }
};

const ar: ScreeningCopy = {
  intro: {
    title: 'لنبدأ',
    body: 'سنرشدك خلال بعض الأنشطة البسيطة. استمع جيدًا واتبع كل تعليمات. خذ وقتك.',
    listenTitle: 'استمع إلى التعليمات',
    listenHelp: 'يمكنك الاستماع إلى التعليمات بصوت مسموع في أي وقت أثناء النشاط بالضغط على «إعادة التعليمات».',
    cameraNeeded: 'يلزم السماح بالوصول إلى الكاميرا والميكروفون للمتابعة',
    allowCamera: 'يرجى السماح بالوصول إلى الكاميرا والميكروفون للمتابعة',
    cameraReady: 'الكاميرا والميكروفون جاهزان',
    preparing: 'جارٍ تجهيز الكاميرا والميكروفون…',
    start: 'ابدأ التقييم'
  },
  header: {
    repeat: 'إعادة التعليمات',
    activities: [
      'النشاط 1 من 5: تتبّع حركة العين',
      'النشاط 2 من 5: مطابقة البطاقات',
      'النشاط 3 من 5: تكرار الجملة',
      'النشاط 4 من 5: حركات الوجه',
      'النشاط 5 من 5: ربط الأرقام'
    ]
  },
  announcements: [
    'النشاط 1 من 5: تتبّع حركة العين. المس الدائرة الزرقاء المتحركة أو ركّز عليها واضغط مفتاح الإدخال عند ظهورها.',
    'النشاط 2 من 5: مطابقة البطاقات. اقلب بطاقتين في كل مرة وطابق الأزواج المتشابهة.',
    'النشاط 3 من 5: تكرار الجملة. انطق الجملة التي تسمعها بصوت واضح.',
    'النشاط 4 من 5: حركات الوجه. قلّد التعبير الظاهر على الشاشة.',
    'النشاط 5 من 5: ربط الأرقام. اضغط الأرقام من 1 إلى 6 بالترتيب، أو المس كل دائرة.'
  ],
  game1: {
    title: 'اتبع الدائرة المتحركة',
    body: 'أبقِ عينيك على الدائرة الزرقاء أثناء حركتها. يمكنك أيضًا لمسها على الشاشة.',
    targets: 'الأهداف المكتملة',
    camera: 'الكاميرا',
    notMeasured: 'لم يُقَس',
    completeTitle: 'اكتمل النشاط 1',
    completeBody: 'أحسنت! لقد أكملت النشاط الأول.',
    continueTo2: 'المتابعة إلى النشاط 2'
  },
  game2: {
    title: 'اعثر على الأزواج المتطابقة',
    body: 'المس البطاقات لقلبها وطابق الأزواج التي تحمل الرموز نفسها.'
  },
  game3: {
    title: 'أعد الجملة بصوت عالٍ',
    body: 'استمع إلى الجملة، ثم اضغط زر الميكروفون واقرأها بصوت واضح.',
    hear: 'اسمع الجملة',
    recordedWords: 'الكلمات المسجَّلة',
    tapToSpeak: 'اضغط الميكروفون للتحدث',
    recording: 'جارٍ التسجيل… اضغط للإيقاف',
    recorded: 'تم تسجيل الصوت بنجاح!',
    analysing: 'جارٍ تحليل الصوت…',
    continueTo4: 'المتابعة إلى النشاط 4'
  },
  game4: {
    title: 'النشاط 4: تعبيرات الوجه',
    body: 'انظر إلى الكاميرا وقم بتعبير الوجه الظاهر أدناه.',
    hear: 'اسمع التعليمات',
    expressionOf: (index, total) => `التعبير ${index} من ${total}`,
    next: 'التعبير التالي',
    continueTo5: 'المتابعة إلى النشاط 5',
    unavailableTitle: 'الكاميرا غير متاحة',
    unavailableBody:
      'يقرأ هذا النشاط حركات الوجه عبر الكاميرا، لذلك لا يمكن تقييمه بدونها. سيُسجَّل على أنه غير مقيس، ويبقى بقية التقييم صالحًا.',
    continueWithout: 'المتابعة بدون هذا النشاط',
    cameraStarting: 'جارٍ تشغيل الكاميرا…',
    expressions: [
      { key: 'smile', label: '🙂 ابتسم', prompt: 'يرجى الابتسام بشكل طبيعي' },
      { key: 'relax', label: '😐 ارتخِ', prompt: 'أبقِ وجهك مرتاحًا' },
      { key: 'blink', label: '😉 ارمش', prompt: 'ارمش بعينيك بشكل طبيعي' },
      { key: 'mouth', label: '😲 افتح فمك', prompt: 'افتح فمك بلطف' }
    ]
  },
  game5: {
    title: 'النشاط 5: ربط الأرقام',
    body: 'المس كل دائرة مرقّمة بالترتيب، من 1 إلى 6.',
    hear: 'استمع إلى التعليمات',
    hearText: 'المس كل دائرة مرقّمة بالترتيب، بدءًا من الرقم 1 حتى الرقم 6.',
    nextNumber: 'الرقم التالي'
  },
  calibration: {
    title: 'فحص سريع للكاميرا',
    body: 'انظر إلى كل نقطة زرقاء عند ظهورها. يساعد ذلك الكاميرا على معرفة اتجاه نظرك. يستغرق نحو عشر ثوانٍ.',
    pointOf: (index, total) => `النقطة ${index} من ${total}`,
    checking: 'جارٍ التحقق من المعايرة…',
    cameraUnavailable: 'الكاميرا غير متاحة الآن. يمكنك المتابعة بدون نشاط العين.',
    starting: 'جارٍ تشغيل الكاميرا…',
    continueWithout: 'المتابعة بدون معايرة',
    failedEyes: 'لم نتمكن من رؤية عينيك بوضوح عند تلك النقطة. لنجرّب مرة أخرى.',
    failedFit: 'لم تكن المعايرة دقيقة بما يكفي. يمكنك المحاولة مرة أخرى أو المتابعة بدونها، فالنشاط يعمل على أي حال.',
    tryAgain: 'إعادة المحاولة',
    continueAnyway: 'المتابعة على أي حال',
    distance: 'اجلس على مسافة ذراع تقريبًا من الشاشة وأبقِ رأسك ثابتًا.'
  },
  sensor: {
    aligned: 'محاذاة جيدة',
    alignFace: 'حاذِ وجهك',
    detected: 'تم الالتقاط',
    speakToTest: 'تحدّث للاختبار',
    micLevel: 'مستوى إدخال الميكروفون',
    testVoice: 'اختبار الصوت',
    calibrationProgress: 'تقدّم المعايرة',
    initializingCamera: 'جارٍ تشغيل كاميرا الاستشعار…',
    levelGood: 'جيد',
    levelFair: 'مقبول',
    levelPoor: 'ضعيف'
  },
  saving: {
    savingTitle: 'جارٍ حفظ تقييمك…',
    savingBody: 'يرجى الانتظار بينما تُحفظ أنشطة الفحص بأمان. ستظهر لك رسالة التأكيد قريبًا.',
    errorTitle: 'لم يتم حفظ التقييم',
    errorBody: 'لم تُحفظ أنشطتك، لذلك لم تُنتج أي نتيجة.',
    errorDetailLabel: 'تفاصيل تقنية',
    retry: 'إعادة المحاولة',
    waiting: 'تأكيد الإكمال بانتظار نجاح الحفظ',
    secure: 'اتصال آمن بالمستشفى'
  },
  chrome: {
    textLabel: 'حجم النص',
    repeatGuidance: 'إعادة الإرشاد الصوتي',
    repeatShort: 'إعادة',
    help: 'مساعدة',
    footer: 'جلسة فحص عصبي • خاصة وآمنة'
  },
  completion: {
    title: 'اكتمل التقييم',
    thanks: 'شكرًا لك. لقد أكملت أنشطة الفحص.',
    badge: 'مكتمل',
    identifierLabel: 'رقم هويتك في المستشفى',
    nameLabel: 'اسم المريض',
    dateLabel: 'تاريخ الإكمال',
    keepNote:
      'يرجى الحفاظ على رقم المريض هذا للرجوع إليه لاحقًا. عند زيارتك للعيادة أو حديثك مع طبيبك، قدّم هذا الرقم.',
    download: 'تنزيل الإيصال (.txt)',
    downloaded: 'تم التنزيل!',
    print: 'طباعة التأكيد',
    returnHome: 'العودة إلى الصفحة الرئيسية',
    confidential: 'سجل سريري خاص • تُغلق الجلسة بأمان عند العودة'
  }
};

export const getScreeningCopy = (language: SupportedLanguage): ScreeningCopy =>
  language === 'ar' ? ar : en;

/** Reactive copy for the screening surface, following the selected language. */
export const useScreeningCopy = (): ScreeningCopy => {
  const language = useLanguageStore((state) => state.currentLanguage);
  return getScreeningCopy(language);
};
