import { SupportedLanguage } from '../language/types';

/**
 * Copy for the patient voice copilot. One typed interface for both languages,
 * so a missing Arabic string is a compile error.
 */
export interface VoiceAssistantCopy {
  buttonLabel: string;
  panelTitle: string;
  panelSubtitle: string;
  statusIdle: string;
  statusListening: string;
  statusWaitingForWake: string;
  wakePrompt: (name: string) => string;
  wakeHint: string;
  backgroundOn: string;
  backgroundOff: string;
  backgroundActive: string;
  statusThinking: string;
  statusSpeaking: string;
  startListening: string;
  stopListening: string;
  micHint: string;
  unsupported: string;
  you: string;
  assistant: string;
  emptyState: string;
  suggestionsTitle: string;
  suggestions: string[];
  openingPage: (page: string) => string;
  greeting: (name: string) => string;
  capabilities: string;
  summary: (parts: string[]) => string;
  summaryNothing: string;
  noAppointments: string;
  nextAppointment: (title: string, date: string, time: string) => string;
  carePlanStatus: (progress: number, nextReview: string) => string;
  carePlanNoReview: (progress: number) => string;
  stopped: string;
  languageSwitched: string;
  notUnderstood: string;
  modelUnavailable: string;
  micDenied: string;
  permissionTitle: string;
  permissionBody: string;
  permissionBullet1: string;
  permissionBullet2: string;
  permissionBullet3: string;
  permissionAllow: string;
  permissionNotNow: string;
  permissionDenied: string;
  permissionClose: string;
  summaryBrain: string;
  summaryAppointments: string;
  summaryNotifications: string;
  close: string;
}

const en: VoiceAssistantCopy = {
  buttonLabel: 'Voice assistant',
  panelTitle: 'NeuLens assistant',
  panelSubtitle: 'Speak in English or Arabic',
  statusIdle: 'Tap the microphone and speak',
  statusListening: 'Listening…',
  statusWaitingForWake: 'Say “Hey NeuLens” to start',
  wakePrompt: (name) => `Yes ${name}? I'm listening.`,
  wakeHint: 'Wake me by saying “Hey NeuLens”, then speak your command.',
  backgroundOn: 'Turn off hands-free listening',
  backgroundOff: 'Turn on hands-free listening',
  backgroundActive: 'Hands-free listening is on',
  statusThinking: 'One moment…',
  statusSpeaking: 'Speaking…',
  startListening: 'Start listening',
  stopListening: 'Stop listening',
  micHint: 'Try “open my brain health” or “when is my next appointment?”',
  unsupported: 'Voice input needs Chrome, Edge or Safari with microphone access.',
  you: 'You',
  assistant: 'Assistant',
  emptyState: 'Ask me to open a page or explain your results.',
  suggestionsTitle: 'Try saying',
  suggestions: ['Open my brain health', 'When is my next appointment?', 'What should I do next?', 'Switch to Arabic'],
  openingPage: (page) => `Opening ${page}.`,
  greeting: (name) => `Hello ${name}. What would you like to see?`,
  capabilities:
    'I can open any page in your portal, read your brain health summary, tell you your next appointment, and explain your care plan. You can speak in English or Arabic.',
  summary: (parts) => `Here is your summary. ${parts.join(' ')}`,
  summaryNothing: 'I do not have assessment results to summarize yet. Starting an assessment is the best next step.',
  noAppointments: 'You have no upcoming appointments scheduled.',
  nextAppointment: (title, date, time) => `Your next appointment is ${title} on ${date} at ${time}.`,
  carePlanStatus: (progress, nextReview) =>
    `Your care plan is ${progress}% complete. The next review is ${nextReview}.`,
  carePlanNoReview: (progress) => `Your care plan is ${progress}% complete.`,
  stopped: 'Stopped.',
  languageSwitched: 'Switched to English.',
  notUnderstood:
    'I did not catch a command in that. You can ask me to open a page, read your summary, or check your appointments.',
  modelUnavailable:
    'I cannot answer that one here yet. I can open any page, read your summary, or check your appointments — or your clinician can discuss it with you.',
  micDenied: 'Microphone access was blocked. Allow it in your browser settings and try again.',
  permissionTitle: 'Allow microphone access',
  permissionBody:
    'NeuLens uses your microphone to hear “Hey NeuLens” and your voice commands, in English or Arabic. It only listens while hands-free mode is on.',
  permissionBullet1: 'Your voice is processed to understand your commands.',
  permissionBullet2: 'You can turn hands-free listening off at any time.',
  permissionBullet3: 'Nothing is recorded for anyone else to hear.',
  permissionAllow: 'Allow microphone',
  permissionNotNow: 'Not now',
  permissionDenied:
    'Microphone access is blocked in this browser. Open your browser settings, allow the microphone for this site, then try again.',
  permissionClose: 'Close',
  summaryBrain: 'Your brain health score is',
  summaryAppointments: 'next appointment',
  summaryNotifications: 'unread notifications',
  close: 'Close assistant'
};

const ar: VoiceAssistantCopy = {
  buttonLabel: 'المساعد الصوتي',
  panelTitle: 'مساعد نيولينز',
  panelSubtitle: 'تحدّث بالإنجليزية أو العربية',
  statusIdle: 'اضغط على الميكروفون وتحدّث',
  statusListening: 'أستمع إليك…',
  statusWaitingForWake: 'قل «يا نيولينز» للبدء',
  wakePrompt: (name) => `نعم ${name}؟ أستمع إليك.`,
  wakeHint: 'نادني بقول «يا نيولينز» ثم قل أمرك.',
  backgroundOn: 'إيقاف الاستماع الحر',
  backgroundOff: 'تشغيل الاستماع الحر',
  backgroundActive: 'الاستماع الحر مُفعّل',
  statusThinking: 'لحظة…',
  statusSpeaking: 'أتحدث…',
  startListening: 'ابدأ الاستماع',
  stopListening: 'أوقف الاستماع',
  micHint: 'جرّب «افتح صحة الدماغ» أو «متى موعدي القادم؟»',
  unsupported: 'الإدخال الصوتي يحتاج متصفح كروم أو إيدج أو سفاري مع إذن الميكروفون.',
  you: 'أنت',
  assistant: 'المساعد',
  emptyState: 'اطلب مني فتح صفحة أو شرح نتائجك.',
  suggestionsTitle: 'جرّب أن تقول',
  suggestions: ['افتح صحة الدماغ', 'متى موعدي القادم؟', 'ماذا أفعل الآن؟', 'تحدّث بالإنجليزية'],
  openingPage: (page) => `أفتح ${page}.`,
  greeting: (name) => `مرحبًا ${name}. ماذا تريد أن ترى؟`,
  capabilities:
    'أستطيع فتح أي صفحة في بوابتك، وقراءة ملخص صحة الدماغ، وإخبارك بموعدك القادم، وشرح خطة الرعاية. يمكنك التحدث بالإنجليزية أو العربية.',
  summary: (parts) => `هذا ملخصك. ${parts.join(' ')}`,
  summaryNothing: 'لا توجد لدي نتائج تقييم لتلخيصها بعد. أفضل خطوة تالية هي بدء تقييم.',
  noAppointments: 'لا توجد مواعيد قادمة مجدولة.',
  nextAppointment: (title, date, time) => `موعدك القادم هو ${title} في ${date} الساعة ${time}.`,
  carePlanStatus: (progress, nextReview) => `أنجزت ${progress}% من خطة الرعاية. المراجعة القادمة ${nextReview}.`,
  carePlanNoReview: (progress) => `أنجزت ${progress}% من خطة الرعاية.`,
  stopped: 'توقفت.',
  languageSwitched: 'تم التبديل إلى العربية.',
  notUnderstood: 'لم ألتقط أمرًا واضحًا. يمكنك أن تطلب مني فتح صفحة أو قراءة الملخص أو التحقق من مواعيدك.',
  modelUnavailable: 'لا أستطيع الإجابة عن ذلك هنا بعد. أستطيع فتح أي صفحة أو قراءة ملخصك أو التحقق من مواعيدك، ويمكن لفريق رعايتك مناقشته معك.',
  micDenied: 'تم حجب إذن الميكروفون. اسمح به من إعدادات المتصفح ثم حاول مرة أخرى.',
  permissionTitle: 'السماح بالوصول إلى الميكروفون',
  permissionBody:
    'يستخدم نيولينز الميكروفون لسماع «يا نيولينز» وأوامرك الصوتية، بالإنجليزية أو العربية. يستمع فقط أثناء تفعيل الاستماع الحر.',
  permissionBullet1: 'تتم معالجة صوتك لفهم أوامرك.',
  permissionBullet2: 'يمكنك إيقاف الاستماع الحر في أي وقت.',
  permissionBullet3: 'لا يُسجّل شيء للاستماع من قِبل أي شخص آخر.',
  permissionAllow: 'السماح للميكروفون',
  permissionNotNow: 'ليس الآن',
  permissionDenied: 'الوصول إلى الميكروفون محجوب في هذا المتصفح. افتح إعدادات المتصفح، اسمح للميكروفون لهذا الموقع، ثم حاول مرة أخرى.',
  permissionClose: 'إغلاق',
  summaryBrain: 'درجة صحة دماغك هي',
  summaryAppointments: 'الموعد القادم',
  summaryNotifications: 'إشعارات غير مقروءة',
  close: 'إغلاق المساعد'
};

export function getVoiceAssistantCopy(language: SupportedLanguage): VoiceAssistantCopy {
  return language === 'ar' ? ar : en;
}
