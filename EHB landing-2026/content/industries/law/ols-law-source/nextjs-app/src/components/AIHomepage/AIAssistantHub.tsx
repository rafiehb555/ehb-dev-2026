'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, MicOff, Send, Bot, Sparkles, 
  Volume2, VolumeX, Loader2, MessageSquare,
  ArrowRight, Accessibility, Globe, ChevronDown, Check,
  Scale, FileText, Users, Briefcase, Home, Heart, Shield,
  Gavel, Building2, Car, BookOpen, HelpCircle, X
} from 'lucide-react';
import { useAI, LANGUAGES } from './AIContext';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const INTENT_MAP: Record<string, { route: string; keywords: string[]; confirmMsg: Record<string, string> }> = {
  divorce: { 
    route: '/service/family-law', 
    keywords: ['divorce', 'talaq', 'طلاق', 'خلع', 'khula', 'separation', 'तलाक', 'boşanma', '离婚'],
    confirmMsg: {
      en: 'I understood that you want to file a divorce case. Opening the service now.',
      ur: 'میں سمجھ گیا کہ آپ طلاق کا کیس فائل کرنا چاہتے ہیں۔ سروس کھول رہا ہوں۔',
      ar: 'فهمت أنك تريد رفع دعوى طلاق. جاري فتح الخدمة.',
      hi: 'मैं समझ गया कि आप तलाक का केस दायर करना चाहते हैं। सेवा खोल रहा हूं।',
      tr: 'Boşanma davası açmak istediğinizi anladım. Hizmeti açıyorum.',
      zh: '我明白您想提起离婚诉讼。正在打开服务。'
    }
  },
  property: { 
    route: '/service/property-law', 
    keywords: ['property', 'land', 'zameen', 'زمین', 'جائیداد', 'real estate', 'plot', 'संपत्ति', 'mülk', '房产'],
    confirmMsg: {
      en: 'I understood you need help with a property matter. Opening Property Law services.',
      ur: 'میں سمجھ گیا کہ آپ کو جائیداد کے معاملے میں مدد چاہیے۔ پراپرٹی لا سروسز کھول رہا ہوں۔',
      ar: 'فهمت أنك تحتاج مساعدة في مسألة عقارية. جاري فتح خدمات قانون العقارات.',
      hi: 'मैं समझ गया कि आपको संपत्ति के मामले में मदद चाहिए। प्रॉपर्टी लॉ सेवाएं खोल रहा हूं।',
      tr: 'Mülk konusunda yardıma ihtiyacınız olduğunu anladım. Mülk Hukuku hizmetlerini açıyorum.',
      zh: '我明白您需要房产方面的帮助。正在打开房产法服务。'
    }
  },
  lawyer: { 
    route: '/marketplace', 
    keywords: ['lawyer', 'وکیل', 'advocate', 'attorney', 'वकील', 'find lawyer', 'need lawyer', 'avukat', '律师'],
    confirmMsg: {
      en: 'I will help you find a lawyer. Opening the lawyer directory.',
      ur: 'میں آپ کو وکیل تلاش کرنے میں مدد کروں گا۔ وکیلوں کی ڈائریکٹری کھول رہا ہوں۔',
      ar: 'سأساعدك في العثور على محامٍ. جاري فتح دليل المحامين.',
      hi: 'मैं आपको वकील खोजने में मदद करूंगा। वकीलों की डायरेक्टरी खोल रहा हूं।',
      tr: 'Size avukat bulmanıza yardımcı olacağım. Avukat dizinini açıyorum.',
      zh: '我会帮您找律师。正在打开律师目录。'
    }
  },
  document: { 
    route: '/document-generator', 
    keywords: ['document', 'دستاویز', 'contract', 'agreement', 'معاہدہ', 'notice', 'नोटिस', 'belge', '文件'],
    confirmMsg: {
      en: 'I will help you create a legal document. Opening the document generator.',
      ur: 'میں آپ کو قانونی دستاویز بنانے میں مدد کروں گا۔ دستاویز جنریٹر کھول رہا ہوں۔',
      ar: 'سأساعدك في إنشاء مستند قانوني. جاري فتح منشئ المستندات.',
      hi: 'मैं आपको कानूनी दस्तावेज़ बनाने में मदद करूंगा। डॉक्यूमेंट जेनरेटर खोल रहा हूं।',
      tr: 'Yasal belge oluşturmanıza yardımcı olacağım. Belge oluşturucuyu açıyorum.',
      zh: '我会帮您创建法律文件。正在打开文件生成器。'
    }
  },
  case: { 
    route: '/create-case', 
    keywords: ['case', 'کیس', 'file', 'start', 'new case', 'मामला', 'दर्ज', 'dava', '案件'],
    confirmMsg: {
      en: 'I will help you start a new legal case. Opening the case creation form.',
      ur: 'میں آپ کو نیا قانونی کیس شروع کرنے میں مدد کروں گا۔ کیس بنانے کا فارم کھول رہا ہوں۔',
      ar: 'سأساعدك في بدء قضية قانونية جديدة. جاري فتح نموذج إنشاء القضية.',
      hi: 'मैं आपको नया कानूनी केस शुरू करने में मदद करूंगा। केस क्रिएशन फॉर्म खोल रहा हूं।',
      tr: 'Yeni bir dava başlatmanıza yardımcı olacağım. Dava oluşturma formunu açıyorum.',
      zh: '我会帮您开始新的法律案件。正在打开案件创建表单。'
    }
  },
  custody: { 
    route: '/service/family-law', 
    keywords: ['custody', 'child', 'بچہ', 'حضانت', 'बच्चा', 'velayet', '抚养权'],
    confirmMsg: {
      en: 'I understood you need help with child custody. Opening Family Court services.',
      ur: 'میں سمجھ گیا کہ آپ کو بچے کی حضانت میں مدد چاہیے۔ فیملی کورٹ سروسز کھول رہا ہوں۔',
      ar: 'فهمت أنك تحتاج مساعدة في حضانة الطفل. جاري فتح خدمات محكمة الأسرة.',
      hi: 'मैं समझ गया कि आपको बच्चे की कस्टडी में मदद चाहिए। फैमिली कोर्ट सेवाएं खोल रहा हूं।',
      tr: 'Çocuk velayeti konusunda yardıma ihtiyacınız olduğunu anladım. Aile Mahkemesi hizmetlerini açıyorum.',
      zh: '我明白您需要儿童抚养权方面的帮助。正在打开家庭法院服务。'
    }
  },
  criminal: { 
    route: '/service/criminal-law', 
    keywords: ['criminal', 'crime', 'جرم', 'bail', 'ضمانت', 'police', 'FIR', 'अपराध', 'suç', '刑事'],
    confirmMsg: {
      en: 'I will help you with criminal law matters. Opening Criminal Law services.',
      ur: 'میں آپ کی فوجداری قانون کے معاملات میں مدد کروں گا۔ کریمنل لا سروسز کھول رہا ہوں۔',
      ar: 'سأساعدك في مسائل القانون الجنائي. جاري فتح خدمات القانون الجنائي.',
      hi: 'मैं आपकी आपराधिक कानून के मामलों में मदद करूंगा। क्रिमिनल लॉ सेवाएं खोल रहा हूं।',
      tr: 'Ceza hukuku konularında size yardımcı olacağım. Ceza Hukuku hizmetlerini açıyorum.',
      zh: '我会帮您处理刑法事务。正在打开刑法服务。'
    }
  },
  business: { 
    route: '/service/business-law', 
    keywords: ['business', 'company', 'کمپنی', 'corporate', 'व्यापार', 'şirket', '商业'],
    confirmMsg: {
      en: 'I will help you with business law matters. Opening Business Law services.',
      ur: 'میں آپ کی کاروباری قانون کے معاملات میں مدد کروں گا۔ بزنس لا سروسز کھول رہا ہوں۔',
      ar: 'سأساعدك في مسائل قانون الأعمال. جاري فتح خدمات قانون الأعمال.',
      hi: 'मैं आपकी व्यापार कानून के मामलों में मदद करूंगा। बिज़नेस लॉ सेवाएं खोल रहा हूं।',
      tr: 'Ticaret hukuku konularında size yardımcı olacağım. Ticaret Hukuku hizmetlerini açıyorum.',
      zh: '我会帮您处理商业法事务。正在打开商业法服务。'
    }
  },
  help: { 
    route: '/ai-assistant', 
    keywords: ['help', 'مدد', 'assist', 'guide', 'मदद', 'yardım', '帮助'],
    confirmMsg: {
      en: 'I will open the AI assistant for more detailed help.',
      ur: 'میں مزید تفصیلی مدد کے لیے AI اسسٹنٹ کھول رہا ہوں۔',
      ar: 'سأفتح مساعد AI للحصول على مساعدة أكثر تفصيلاً.',
      hi: 'मैं अधिक विस्तृत मदद के लिए AI असिस्टेंट खोल रहा हूं।',
      tr: 'Daha detaylı yardım için AI asistanını açıyorum.',
      zh: '我将打开AI助手提供更详细的帮助。'
    }
  }
};

export default function AIAssistantHub() {
  const router = useRouter();
  const { 
    language, languageConfig, setLanguage,
    isListening, setIsListening,
    isSpeaking, speak, stopSpeaking,
    transcript, setTranscript,
    aiResponse, setAiResponse,
    accessibilityMode, setAccessibilityMode,
    isLoading, hasGreeted, setHasGreeted,
    showLanguageNotification, setShowLanguageNotification,
    conversationHistory, addToConversation
  } = useAI();

  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick action buttons
  const quickActions = [
    { icon: Users, label: languageConfig.ui.findLawyer, route: '/marketplace', color: 'from-blue-500 to-blue-600' },
    { icon: Briefcase, label: languageConfig.ui.startCase, route: '/create-case', color: 'from-purple-500 to-purple-600' },
    { icon: FileText, label: languageConfig.ui.createDocument, route: '/document-generator', color: 'from-emerald-500 to-emerald-600' },
    { icon: Bot, label: languageConfig.ui.askConsultant, route: '/ai-assistant', color: 'from-orange-500 to-orange-600' },
  ];

  // Service categories for accessibility mode
  const serviceCategories = [
    { icon: Heart, label: language === 'ur' ? 'خاندانی عدالت' : 'Family Court', route: '/service/family-law', color: 'bg-pink-500' },
    { icon: Home, label: language === 'ur' ? 'جائیداد قانون' : 'Property Law', route: '/service/property-law', color: 'bg-blue-500' },
    { icon: Scale, label: language === 'ur' ? 'فوجداری قانون' : 'Criminal Law', route: '/service/criminal-law', color: 'bg-red-500' },
    { icon: Building2, label: language === 'ur' ? 'کاروباری قانون' : 'Business Law', route: '/service/business-law', color: 'bg-green-500' },
    { icon: Car, label: language === 'ur' ? 'حادثے کے دعوے' : 'Accident Claims', route: '/service/accident-claims', color: 'bg-yellow-500' },
    { icon: Shield, label: language === 'ur' ? 'سائبر قانون' : 'Cyber Law', route: '/service/cyber-law', color: 'bg-purple-500' },
  ];

  const detectIntent = useCallback((text: string): string | null => {
    const lowerText = text.toLowerCase();
    for (const [intent, config] of Object.entries(INTENT_MAP)) {
      for (const keyword of config.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return intent;
        }
      }
    }
    return null;
  }, []);

  const processInput = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setTranscript(input);
    addToConversation('user', input);

    const intent = detectIntent(input);
    setDetectedIntent(intent);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (intent && INTENT_MAP[intent]) {
      const intentConfig = INTENT_MAP[intent];
      const response = intentConfig.confirmMsg[language] || intentConfig.confirmMsg.en;

      setAiResponse(response);
      addToConversation('ai', response);
      speak(response);

      setTimeout(() => {
        router.push(intentConfig.route);
      }, 2500);
    } else {
      const defaultResponses: Record<string, string> = {
        en: "I'm trying to understand your request. Could you please tell me more about your legal need? For example, you can say 'I need a lawyer' or 'I want to file a divorce case'.",
        ur: "میں آپ کی درخواست سمجھنے کی کوشش کر رہا ہوں۔ براہ کرم اپنی قانونی ضرورت کے بارے میں مزید بتائیں۔ مثال کے طور پر، آپ کہہ سکتے ہیں 'مجھے وکیل چاہیے' یا 'میں طلاق کا کیس فائل کرنا چاہتا ہوں'۔",
        ar: "أحاول فهم طلبك. هل يمكنك إخباري بالمزيد عن حاجتك القانونية؟ على سبيل المثال، يمكنك قول 'أحتاج محامياً' أو 'أريد رفع دعوى طلاق'.",
        hi: "मैं आपके अनुरोध को समझने की कोशिश कर रहा हूं। कृपया अपनी कानूनी जरूरत के बारे में और बताएं। उदाहरण के लिए, आप कह सकते हैं 'मुझे वकील चाहिए' या 'मैं तलाक का केस दायर करना चाहता हूं'।",
        tr: "Talebinizi anlamaya çalışıyorum. Lütfen hukuki ihtiyacınız hakkında daha fazla bilgi verin. Örneğin, 'Bir avukata ihtiyacım var' veya 'Boşanma davası açmak istiyorum' diyebilirsiniz.",
        zh: "我正在尝试理解您的请求。请告诉我更多关于您的法律需求。例如，您可以说'我需要律师'或'我想提起离婚诉讼'。"
      };
      const response = defaultResponses[language] || defaultResponses.en;
      setAiResponse(response);
      addToConversation('ai', response);
      speak(response);
    }

    setIsProcessing(false);
  }, [detectIntent, language, router, setAiResponse, setTranscript, speak, addToConversation]);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      const msg = language === 'ur' 
        ? 'معذرت، آپ کا براؤزر آواز کی شناخت کو سپورٹ نہیں کرتا۔'
        : 'Sorry, your browser does not support speech recognition.';
      setAiResponse(msg);
      speak(msg);
      return;
    }

    stopSpeaking();
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANGUAGES[language].voiceLang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);
      
      if (result.isFinal) {
        processInput(text);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [language, processInput, setIsListening, setTranscript, stopSpeaking, setAiResponse, speak]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [setIsListening]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      processInput(textInput);
      setTextInput('');
    }
  };

  // Auto-greet on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [userInteracted]);

  useEffect(() => {
    if (userInteracted && !hasGreeted && !isLoading) {
      const timer = setTimeout(() => {
        speak(languageConfig.greeting);
        setHasGreeted(true);
        addToConversation('ai', languageConfig.greeting);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userInteracted, hasGreeted, isLoading, languageConfig.greeting, speak, setHasGreeted, addToConversation]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-brand-primary border-t-transparent"
        />
        <p className="mt-4 text-ehb-textMuted text-sm">Loading AI Assistant...</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${accessibilityMode ? 'py-6' : 'py-4'}`} dir={languageConfig.dir}>
      {/* Language Detection Notification */}
      <AnimatePresence>
        {showLanguageNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500/90 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            <Globe size={16} />
            {languageConfig.ui.languageDetected}: {languageConfig.nativeName}
            <button onClick={() => setShowLanguageNotification(false)} className="ml-2 hover:bg-white/20 rounded-full p-1">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI Hub Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto"
      >
        {/* Header with Language Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center shadow-lg shadow-brand-primary/30"
              animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
            >
              <Bot size={28} className="text-white" />
            </motion.div>
            <div>
              <h2 className={`font-bold text-white ${accessibilityMode ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
                {language === 'ur' ? 'AI قانونی معاون' : 
                 language === 'hi' ? 'AI कानूनी सहायक' : 
                 language === 'ar' ? 'مساعد قانوني AI' : 
                 'AI Legal Assistant'}
              </h2>
              <p className={`text-ehb-textMuted ${accessibilityMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                {languageConfig.helpPrompt}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Accessibility Mode Toggle */}
            <button
              onClick={() => setAccessibilityMode(!accessibilityMode)}
              className={`p-2 sm:p-2.5 rounded-xl transition-all ${
                accessibilityMode 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                  : 'bg-slate-800 text-ehb-textMuted hover:text-white border border-slate-700'
              }`}
              title={languageConfig.ui.accessibilityMode}
            >
              <Accessibility size={accessibilityMode ? 22 : 18} />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all"
              >
                <span className="text-lg sm:text-xl">{languageConfig.flag}</span>
                <span className={`font-bold text-white hidden sm:inline ${accessibilityMode ? 'text-base' : 'text-sm'}`}>
                  {languageConfig.nativeName}
                </span>
                <ChevronDown size={14} className={`text-ehb-textMuted transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLanguageDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLanguageDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute ${languageConfig.dir === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-52 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50`}
                    >
                      <div className="p-2">
                        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {languageConfig.ui.changeLanguage}
                        </p>
                        {Object.values(LANGUAGES).map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setShowLanguageDropdown(false);
                              setTimeout(() => speak(lang.greeting), 300);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              language === lang.code
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'hover:bg-slate-800 text-white'
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <div className="flex-grow text-left">
                              <p className={`font-bold ${accessibilityMode ? 'text-base' : 'text-sm'}`}>{lang.nativeName}</p>
                              <p className="text-[10px] text-slate-500">{lang.name}</p>
                            </div>
                            {language === lang.code && <Check size={16} className="text-brand-primary" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Interaction Card */}
        <div className={`ms-card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden ${
          accessibilityMode ? 'p-8 sm:p-10' : 'p-5 sm:p-8'
        }`}>
          
          {/* Voice Assistant Section */}
          <div className="flex flex-col items-center mb-8">
            {/* Large Mic Button */}
            <motion.button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`relative rounded-full flex items-center justify-center transition-all shadow-2xl ${
                accessibilityMode ? 'w-32 h-32 sm:w-40 sm:h-40' : 'w-24 h-24 sm:w-28 sm:h-28'
              } ${
                isListening 
                  ? 'bg-red-500 shadow-red-500/40' 
                  : 'bg-gradient-to-br from-brand-primary to-purple-600 shadow-brand-primary/40 hover:scale-105'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse animations */}
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  />
                </>
              )}
              
              {isProcessing ? (
                <Loader2 size={accessibilityMode ? 48 : 36} className="text-white animate-spin" />
              ) : isListening ? (
                <MicOff size={accessibilityMode ? 48 : 36} className="text-white" />
              ) : (
                <Mic size={accessibilityMode ? 48 : 36} className="text-white" />
              )}
            </motion.button>

            {/* Status Text */}
            <p className={`mt-4 font-bold text-center ${accessibilityMode ? 'text-xl' : 'text-sm sm:text-base'} ${
              isListening ? 'text-red-400' : 'text-ehb-textMuted'
            }`}>
              {isProcessing ? languageConfig.ui.processing :
               isListening ? `🎤 ${languageConfig.ui.listening}` :
               languageConfig.ui.speakNow}
            </p>

            {/* Live Transcript */}
            <AnimatePresence>
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 px-5 py-3 bg-slate-800/70 rounded-2xl border border-slate-700 max-w-lg ${
                    accessibilityMode ? 'text-lg' : 'text-sm'
                  }`}
                >
                  <p className="text-white text-center">&ldquo;{transcript}&rdquo;</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Response */}
            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 px-5 py-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl max-w-lg ${
                    accessibilityMode ? 'text-lg' : 'text-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Bot size={22} className="text-brand-primary shrink-0 mt-0.5" />
                    <p className="text-ehb-textBody">{aiResponse}</p>
                  </div>
                  {isSpeaking && (
                    <button 
                      onClick={stopSpeaking}
                      className="mt-3 flex items-center gap-2 text-xs text-brand-primary hover:underline"
                    >
                      <VolumeX size={14} /> {language === 'ur' ? 'آواز بند کریں' : 'Stop speaking'}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Intent Detection Badge */}
            <AnimatePresence>
              {detectedIntent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
                >
                  <Sparkles size={14} className="text-emerald-400" />
                  <span className={`font-bold text-emerald-400 ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
                    {language === 'ur' ? 'پہچان لیا:' : 'Detected:'} {detectedIntent}
                  </span>
                  <ArrowRight size={14} className="text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-grow h-px bg-slate-700" />
            <span className={`text-slate-500 font-bold uppercase tracking-widest ${accessibilityMode ? 'text-sm' : 'text-xs'}`}>
              {language === 'ur' ? 'یا ٹائپ کریں' : language === 'ar' ? 'أو اكتب' : 'or type'}
            </span>
            <div className="flex-grow h-px bg-slate-700" />
          </div>

          {/* Text Input Section */}
          <form onSubmit={handleTextSubmit} className="relative">
            <div className="flex gap-3">
              <div className="flex-grow relative">
                <MessageSquare 
                  size={18} 
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${languageConfig.dir === 'rtl' ? 'right-4' : 'left-4'}`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={languageConfig.ui.typeHere}
                  className={`w-full bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-white ${
                    accessibilityMode ? 'py-5 text-lg' : 'py-3 sm:py-4 text-sm'
                  } ${languageConfig.dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                  dir={languageConfig.dir}
                />
              </div>
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className={`bg-gradient-to-r from-brand-primary to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all ${
                  accessibilityMode ? 'px-8 py-5' : 'px-5 sm:px-6 py-3 sm:py-4'
                }`}
              >
                <Send size={accessibilityMode ? 24 : 20} />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions Section */}
        <div className={`mt-6 ${accessibilityMode ? 'mt-8' : ''}`}>
          <h3 className={`font-bold text-ehb-textMuted uppercase tracking-widest mb-4 ${accessibilityMode ? 'text-base' : 'text-xs'}`}>
            {languageConfig.ui.quickActions}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                onClick={() => router.push(action.route)}
                className={`bg-gradient-to-br ${action.color} text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center gap-2 ${
                  accessibilityMode ? 'p-6 sm:p-8' : 'p-4 sm:p-5'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon size={accessibilityMode ? 32 : 24} />
                <span className={accessibilityMode ? 'text-base' : 'text-xs sm:text-sm'}>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Accessibility Mode - Service Categories */}
        {accessibilityMode && (
          <div className="mt-8">
            <h3 className="text-base font-bold text-ehb-textMuted uppercase tracking-widest mb-4">
              {language === 'ur' ? 'قانونی خدمات' : 'Legal Services'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {serviceCategories.map((cat, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    const msg = language === 'ur' 
                      ? `${cat.label} کھول رہا ہوں` 
                      : `Opening ${cat.label}`;
                    speak(msg);
                    setTimeout(() => router.push(cat.route), 1000);
                  }}
                  className={`${cat.color} text-white rounded-3xl p-6 sm:p-8 font-bold shadow-xl hover:scale-105 transition-all flex flex-col items-center justify-center gap-3`}
                  whileTap={{ scale: 0.95 }}
                >
                  <cat.icon size={40} />
                  <span className="text-lg text-center">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Accessibility Mode Info */}
        {accessibilityMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <Accessibility className="text-blue-400 shrink-0" size={28} />
              <div>
                <p className="text-base font-bold text-blue-400">
                  {languageConfig.ui.accessibilityMode} {language === 'ur' ? 'فعال ہے' : 'Active'}
                </p>
                <p className="text-sm text-ehb-textMuted">
                  {language === 'ur' 
                    ? 'بڑے بٹن اور آواز سے رہنمائی فعال ہے۔ صرف بولیں یا بڑے بٹن دبائیں۔' 
                    : 'Large buttons and voice guidance enabled. Just speak or press the large buttons.'}
                </p>
              </div>
              <button 
                onClick={() => setAccessibilityMode(false)}
                className="ml-auto p-2 hover:bg-slate-800 rounded-lg"
              >
                <X size={20} className="text-ehb-textMuted" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
