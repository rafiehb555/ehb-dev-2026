'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ur' | 'ar' | 'hi' | 'tr' | 'zh';

interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  greeting: string;
  helpPrompt: string;
  voiceLang: string;
  ui: {
    askAI: string;
    speakNow: string;
    listening: string;
    processing: string;
    typeHere: string;
    quickActions: string;
    findLawyer: string;
    startCase: string;
    createDocument: string;
    askConsultant: string;
    accessibilityMode: string;
    languageDetected: string;
    changeLanguage: string;
  };
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    greeting: 'Welcome to EHB Law Services. I am your AI legal assistant. How can I help you today?',
    helpPrompt: 'Tell me your legal problem or ask any question...',
    voiceLang: 'en-US',
    ui: {
      askAI: 'Ask AI',
      speakNow: 'Tap to speak',
      listening: 'Listening...',
      processing: 'Processing...',
      typeHere: 'Type your legal question here...',
      quickActions: 'Quick Actions',
      findLawyer: 'Find a Lawyer',
      startCase: 'Start Legal Case',
      createDocument: 'Create Document',
      askConsultant: 'AI Consultant',
      accessibilityMode: 'Easy Mode',
      languageDetected: 'Language detected',
      changeLanguage: 'Change language'
    }
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    dir: 'rtl',
    greeting: 'EHB قانونی خدمات میں خوش آمدید۔ میں آپ کا AI قانونی معاون ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟',
    helpPrompt: 'اپنا قانونی مسئلہ بتائیں یا کوئی سوال پوچھیں...',
    voiceLang: 'ur-PK',
    ui: {
      askAI: 'AI سے پوچھیں',
      speakNow: 'بولنے کے لیے ٹیپ کریں',
      listening: 'سن رہا ہوں...',
      processing: 'پروسیسنگ...',
      typeHere: 'اپنا قانونی سوال یہاں لکھیں...',
      quickActions: 'فوری کارروائیاں',
      findLawyer: 'وکیل تلاش کریں',
      startCase: 'کیس شروع کریں',
      createDocument: 'دستاویز بنائیں',
      askConsultant: 'AI مشیر',
      accessibilityMode: 'آسان موڈ',
      languageDetected: 'زبان کا پتہ چلا',
      changeLanguage: 'زبان تبدیل کریں'
    }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
    dir: 'rtl',
    greeting: 'مرحباً بكم في خدمات EHB القانونية. أنا مساعدك القانوني بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟',
    helpPrompt: 'أخبرني بمشكلتك القانونية أو اسأل أي سؤال...',
    voiceLang: 'ar-SA',
    ui: {
      askAI: 'اسأل AI',
      speakNow: 'انقر للتحدث',
      listening: 'أستمع...',
      processing: 'جاري المعالجة...',
      typeHere: 'اكتب سؤالك القانوني هنا...',
      quickActions: 'إجراءات سريعة',
      findLawyer: 'ابحث عن محامٍ',
      startCase: 'ابدأ قضية',
      createDocument: 'إنشاء مستند',
      askConsultant: 'مستشار AI',
      accessibilityMode: 'الوضع السهل',
      languageDetected: 'تم اكتشاف اللغة',
      changeLanguage: 'تغيير اللغة'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    dir: 'ltr',
    greeting: 'EHB कानूनी सेवाओं में आपका स्वागत है। मैं आपका AI कानूनी सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    helpPrompt: 'अपनी कानूनी समस्या बताएं या कोई सवाल पूछें...',
    voiceLang: 'hi-IN',
    ui: {
      askAI: 'AI से पूछें',
      speakNow: 'बोलने के लिए टैप करें',
      listening: 'सुन रहा हूं...',
      processing: 'प्रोसेसिंग...',
      typeHere: 'अपना कानूनी सवाल यहां लिखें...',
      quickActions: 'त्वरित कार्रवाई',
      findLawyer: 'वकील खोजें',
      startCase: 'केस शुरू करें',
      createDocument: 'दस्तावेज़ बनाएं',
      askConsultant: 'AI सलाहकार',
      accessibilityMode: 'आसान मोड',
      languageDetected: 'भाषा का पता चला',
      changeLanguage: 'भाषा बदलें'
    }
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    greeting: 'EHB Hukuk Hizmetlerine hoş geldiniz. Ben AI hukuk asistanınızım. Bugün size nasıl yardımcı olabilirim?',
    helpPrompt: 'Hukuki sorununuzu anlatın veya soru sorun...',
    voiceLang: 'tr-TR',
    ui: {
      askAI: 'AI\'ya Sor',
      speakNow: 'Konuşmak için dokunun',
      listening: 'Dinliyorum...',
      processing: 'İşleniyor...',
      typeHere: 'Hukuki sorunuzu buraya yazın...',
      quickActions: 'Hızlı İşlemler',
      findLawyer: 'Avukat Bul',
      startCase: 'Dava Başlat',
      createDocument: 'Belge Oluştur',
      askConsultant: 'AI Danışman',
      accessibilityMode: 'Kolay Mod',
      languageDetected: 'Dil algılandı',
      changeLanguage: 'Dili değiştir'
    }
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    greeting: '欢迎来到EHB法律服务。我是您的AI法律助手。今天我能为您做些什么？',
    helpPrompt: '告诉我您的法律问题或提问...',
    voiceLang: 'zh-CN',
    ui: {
      askAI: '询问AI',
      speakNow: '点击说话',
      listening: '正在聆听...',
      processing: '处理中...',
      typeHere: '在此输入您的法律问题...',
      quickActions: '快速操作',
      findLawyer: '寻找律师',
      startCase: '开始案件',
      createDocument: '创建文档',
      askConsultant: 'AI顾问',
      accessibilityMode: '简易模式',
      languageDetected: '检测到语言',
      changeLanguage: '更改语言'
    }
  }
};

const COUNTRY_LANGUAGE_MAP: Record<string, Language> = {
  'PK': 'ur', 'IN': 'hi', 'AE': 'ar', 'SA': 'ar', 'EG': 'ar', 'QA': 'ar', 'KW': 'ar', 'BH': 'ar', 'OM': 'ar',
  'TR': 'tr', 'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'zh',
  'GB': 'en', 'US': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en', 'IE': 'en',
};

interface AIContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageConfig: LanguageConfig;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasGreeted: boolean;
  setHasGreeted: (greeted: boolean) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  aiResponse: string;
  setAiResponse: (response: string) => void;
  accessibilityMode: boolean;
  setAccessibilityMode: (mode: boolean) => void;
  showLanguageNotification: boolean;
  setShowLanguageNotification: (show: boolean) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  detectedCountry: string;
  conversationHistory: Array<{ role: 'user' | 'ai'; message: string }>;
  addToConversation: (role: 'user' | 'ai', message: string) => void;
  clearConversation: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [showLanguageNotification, setShowLanguageNotification] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);

  const languageConfig = LANGUAGES[language];

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANGUAGES[language].voiceLang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ehb-language', lang);
  }, []);

  const addToConversation = useCallback((role: 'user' | 'ai', message: string) => {
    setConversationHistory(prev => [...prev, { role, message }]);
  }, []);

  const clearConversation = useCallback(() => {
    setConversationHistory([]);
  }, []);

  useEffect(() => {
    const detectLanguage = async () => {
      setIsLoading(true);
      
      const savedLang = localStorage.getItem('ehb-language') as Language;
      if (savedLang && LANGUAGES[savedLang]) {
        setLanguageState(savedLang);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const data = await response.json();
        const countryCode = data.country_code;
        setDetectedCountry(countryCode);
        
        const detectedLang = COUNTRY_LANGUAGE_MAP[countryCode] || 'en';
        setLanguageState(detectedLang);
        localStorage.setItem('ehb-language', detectedLang);
        setShowLanguageNotification(true);
        
        setTimeout(() => setShowLanguageNotification(false), 5000);
      } catch {
        const browserLang = navigator.language.split('-')[0];
        const langMap: Record<string, Language> = {
          'en': 'en', 'ur': 'ur', 'ar': 'ar', 'hi': 'hi', 'tr': 'tr', 'zh': 'zh'
        };
        const detectedLang = langMap[browserLang] || 'en';
        setLanguageState(detectedLang);
      }
      
      setIsLoading(false);
    };

    detectLanguage();
  }, []);

  return (
    <AIContext.Provider value={{
      language,
      setLanguage,
      languageConfig,
      isListening,
      setIsListening,
      isSpeaking,
      setIsSpeaking,
      isLoading,
      setIsLoading,
      hasGreeted,
      setHasGreeted,
      transcript,
      setTranscript,
      aiResponse,
      setAiResponse,
      accessibilityMode,
      setAccessibilityMode,
      showLanguageNotification,
      setShowLanguageNotification,
      speak,
      stopSpeaking,
      detectedCountry,
      conversationHistory,
      addToConversation,
      clearConversation
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
}
