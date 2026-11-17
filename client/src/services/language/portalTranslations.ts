import { SupportedLanguage } from './types';

export interface PortalNavTranslation {
  groups: Record<string, string>;
  items: Record<string, string>;
}

export interface PortalPageTranslation {
  eyebrow: string;
  title: string;
  description: string;
}

export interface PortalTranslation {
  portalName: string;
  patientPortal: string;
  signOut: string;
  skipToContent: string;
  notifications: string;
  notificationsUnread: string;
  footerLine1: string;
  footerLine2: string;
  nav: PortalNavTranslation;
  consent: PortalPageTranslation & {
    requiredItemsMarked: string;
    acceptAndContinue: string;
    back: string;
  };
  context: {
    overview: PortalPageTranslation;
    sleep: PortalPageTranslation;
    wellbeing: PortalPageTranslation;
    clinical: PortalPageTranslation;
  };
}

const en: PortalTranslation = {
  portalName: 'Patient portal',
  patientPortal: 'Patient portal',
  signOut: 'Sign out',
  skipToContent: 'Skip to content',
  notifications: 'Notifications',
  notificationsUnread: 'unread',
  footerLine1: 'Neurology & Cognitive Health',
  footerLine2: 'Screening support, not a diagnosis. Your care team guides next steps.',
  nav: {
    groups: {
      Home: 'Home',
      Assessment: 'Assessment',
      Monitoring: 'Monitoring',
      'Health context': 'Health context',
      Care: 'Care',
      Account: 'Account'
    },
    items: {
      '/patient/dashboard': 'Dashboard',
      '/patient/brain-health': 'Brain health',
      '/patient/timeline': 'Brain Health Timeline',
      '/patient/assessment/intro': 'Start assessment',
      '/patient/cognitive': 'Cognitive assessment',
      '/patient/cognitive/library': 'Task library',
      '/patient/history': 'History',
      '/patient/daily-function': 'Daily Function Questionnaire',
      '/patient/documents': 'Reports & documents',
      '/patient/trends': 'Longitudinal trends',
      '/patient/change-detection': 'Change detection',
      '/patient/health-profile': 'Health Profile & Context',
      '/patient/context': 'Context overview',
      '/patient/context/assessment-conditions': 'Assessment conditions',
      '/patient/context/sleep': 'Sleep & lifestyle',
      '/patient/context/wellbeing': 'Mental wellbeing',
      '/patient/context/clinical': 'Clinical & family',
      '/patient/prevention-plan': 'Personalized Prevention Plan',
      '/patient/appointments': 'Follow-up & Appointments',
      '/patient/care-plan': 'My care plan',
      '/patient/notifications': 'Notifications',
      '/patient/profile': 'My profile',
      '/patient/settings': 'Account settings',
      '/patient/privacy': 'Privacy & data',
      '/patient/help': 'Help & support'
    }
  },
  consent: {
    eyebrow: 'Screen 18 · Consent & privacy',
    title: 'Your data, your choices',
    description: 'We explain exactly what is collected and how it is used. Required items keep the screening safe and clinically meaningful; optional sharing is your choice.',
    requiredItemsMarked: 'Required items are marked *',
    acceptAndContinue: 'Accept and continue',
    back: 'Back'
  },
  context: {
    overview: {
      eyebrow: 'Screen 34 · Health context',
      title: 'What may be shaping your results',
      description: 'Sleep, activity, wellbeing, and clinical information help your care team interpret screening observations in context. These do not change your score.'
    },
    sleep: {
      eyebrow: 'Screen 35 · Sleep & lifestyle',
      title: 'Sleep, movement, and daily life',
      description: 'Small context updates help your care team interpret the session. Share as much as you like.'
    },
    wellbeing: {
      eyebrow: 'Screen 36 · Mental wellbeing',
      title: 'How have you been feeling?',
      description: 'A short self-report helps put a screening session in context. It is not a mood diagnosis or a validated screening instrument.'
    },
    clinical: {
      eyebrow: 'Screen 37 · Clinical & family history',
      title: 'Clinical information and family history',
      description: 'You control what is shared here. Imported clinical information is labelled with its source and last update date.'
    }
  }
};

const ar: PortalTranslation = {
  portalName: 'بوابة المريض',
  patientPortal: 'بوابة المريض',
  signOut: 'تسجيل الخروج',
  skipToContent: 'انتقل إلى المحتوى',
  notifications: 'الإشعارات',
  notificationsUnread: 'غير مقروء',
  footerLine1: 'طب الأعصاب والصحة المعرفية',
  footerLine2: 'دعم الفحص وليس تشخيصًا. فريق رعايتك يوجّه الخطوات التالية.',
  nav: {
    groups: {
      Home: 'الرئيسية',
      Assessment: 'التقييم',
      Monitoring: 'المتابعة',
      'Health context': 'السياق الصحي',
      Care: 'الرعاية',
      Account: 'الحساب'
    },
    items: {
      '/patient/dashboard': 'لوحة التحكم',
      '/patient/brain-health': 'صحة الدماغ',
      '/patient/timeline': 'الجدول الزمني لصحة الدماغ',
      '/patient/assessment/intro': 'بدء التقييم',
      '/patient/cognitive': 'التقييم المعرفي',
      '/patient/cognitive/library': 'مكتبة المهام',
      '/patient/history': 'السجل',
      '/patient/daily-function': 'استبيان الوظائف اليومية',
      '/patient/documents': 'التقارير والمستندات',
      '/patient/trends': 'الاتجاهات الطولية',
      '/patient/change-detection': 'كشف التغيير',
      '/patient/health-profile': 'الملف الصحي والسياق',
      '/patient/context': 'نظرة عامة على السياق',
      '/patient/context/assessment-conditions': 'ظروف التقييم',
      '/patient/context/sleep': 'النوم ونمط الحياة',
      '/patient/context/wellbeing': 'الرفاهية النفسية',
      '/patient/context/clinical': 'السريري والعائلي',
      '/patient/prevention-plan': 'خطة الوقاية شخصية',
      '/patient/appointments': 'المتابعة والمواعيد',
      '/patient/care-plan': 'خطة رعايتي',
      '/patient/notifications': 'الإشعارات',
      '/patient/profile': 'ملفي',
      '/patient/settings': 'إعدادات الحساب',
      '/patient/privacy': 'الخصوصية والبيانات',
      '/patient/help': 'المساعدة والدعم'
    }
  },
  consent: {
    eyebrow: 'الشاشة 18 · الموافقة والخصوصية',
    title: 'بياناتك، خياراتك',
    description: 'نشرح بالضبط ما يُجمع وكيف يُستخدم. العناصر المطلوبة تحافظ على أمان الفحص وأهميته السريرية؛ المشاركة الاختيارية هي اختيارك.',
    requiredItemsMarked: 'العناصر المطلوبة معلّمة بـ *',
    acceptAndContinue: 'قبول ومتابعة',
    back: 'رجوع'
  },
  context: {
    overview: {
      eyebrow: 'الشاشة 34 · السياق الصحي',
      title: 'ما قد يؤثر على نتائجك',
      description: 'النوم والنشاط والرفاهية والمعلومات السريرية تساعد فريق رعايتك على تفسير ملاحظات الفحص في السياق. هذه لا تغيّر درجتك.'
    },
    sleep: {
      eyebrow: 'الشاشة 35 · النوم ونمط الحياة',
      title: 'النوم والحركة والحياة اليومية',
      description: 'التحديثات الصغيرة للسياق تساعد فريق رعايتك على تفسير الجلسة. شارك بقدر ما تشاء.'
    },
    wellbeing: {
      eyebrow: 'الشاشة 36 · الرفاهية النفسية',
      title: 'كيف شعرت مؤخرًا؟',
      description: 'تقرير ذاتي قصير يضع جلسة الفحص في سياقها. ليس تشخيصًا للمزاج ولا أداة فحص مُتحقق منها.'
    },
    clinical: {
      eyebrow: 'الشاشة 37 · السريري والتاريخ العائلي',
      title: 'المعلومات السريرية والتاريخ العائلي',
      description: 'أنت تتحكم في ما تشاركه هنا. المعلومات السريرية المستوردة مُوسومة بمصدرها وتاريخ آخر تحديث.'
    }
  }
};

const translations: Record<SupportedLanguage, PortalTranslation> = {
  en,
  ar,
  ta: en,
  hi: en,
  te: en,
  ml: en,
  kn: en
};

export function getPortalTranslation(lang: SupportedLanguage): PortalTranslation {
  return translations[lang] || translations.en;
}
