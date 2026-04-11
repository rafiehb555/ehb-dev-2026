'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Mic, MicOff, Send, Check, ChevronRight, Upload, 
  FileText, X, Star, CreditCard, Shield, Clock, 
  CheckCircle2, AlertCircle, User, Scale, Briefcase,
  MessageSquare, Phone, Video, ArrowLeft, Loader2,
  Volume2, VolumeX, Globe
} from 'lucide-react';
import { useAgent, CASE_TYPES, CaseType, MatchedLawyer, UploadedDocument } from './AgentContext';

const INTENT_KEYWORDS: Record<CaseType, string[]> = {
  divorce: ['divorce', 'talaq', 'طلاق', 'separate', 'separation', 'علیحدگی'],
  khula: ['khula', 'خلع', 'wife divorce'],
  child_custody: ['custody', 'حضانت', 'children', 'بچے', 'bachay'],
  maintenance: ['maintenance', 'nafqa', 'نفقہ', 'kharcha'],
  property_dispute: ['property dispute', 'land dispute', 'جائیداد تنازعہ', 'zameen'],
  property_transfer: ['property transfer', 'sell property', 'buy property', 'منتقلی'],
  inheritance: ['inheritance', 'wirasat', 'وراثت', 'heirship'],
  criminal_defense: ['criminal', 'defense', 'مقدمہ', 'case defend'],
  bail: ['bail', 'zamanat', 'ضمانت', 'release'],
  fir: ['fir', 'ایف آئی آر', 'police report', 'complaint'],
  business_registration: ['business registration', 'company', 'کمپنی', 'register business'],
  contract_dispute: ['contract', 'agreement dispute', 'معاہدہ'],
  partnership: ['partnership', 'شراکت', 'partner'],
  immigration: ['immigration', 'امیگریشن', 'migrate'],
  visa: ['visa', 'ویزا'],
  citizenship: ['citizenship', 'شہریت'],
  accident_claim: ['accident', 'حادثہ', 'claim', 'injury'],
  medical_malpractice: ['medical', 'doctor', 'hospital', 'ڈاکٹر', 'malpractice'],
  cyber_crime: ['cyber', 'hacking', 'online fraud', 'سائبر'],
  defamation: ['defamation', 'ہتک عزت', 'slander'],
  other: []
};

const MOCK_LAWYERS: MatchedLawyer[] = [
  { id: '1', name: 'Adv. Ahmed Khan', specialization: 'Family Law', experience: '15 years', rating: 4.8, sqlLevel: 'SQL-5', fee: 500, city: 'Karachi', image: '' },
  { id: '2', name: 'Adv. Sarah Malik', specialization: 'Family Law', experience: '12 years', rating: 4.9, sqlLevel: 'SQL-4', fee: 450, city: 'Lahore', image: '' },
  { id: '3', name: 'Adv. Imran Ali', specialization: 'Criminal Law', experience: '20 years', rating: 4.7, sqlLevel: 'SQL-5', fee: 600, city: 'Islamabad', image: '' },
  { id: '4', name: 'Adv. Fatima Hassan', specialization: 'Property Law', experience: '10 years', rating: 4.6, sqlLevel: 'SQL-3', fee: 400, city: 'Rawalpindi', image: '' },
  { id: '5', name: 'Adv. Zainab Shah', specialization: 'Business Law', experience: '8 years', rating: 4.5, sqlLevel: 'SQL-3', fee: 350, city: 'Multan', image: '' },
];

export default function AIAgentPanel() {
  const {
    phase, setPhase, caseType, setCaseType, caseData, setCaseData,
    currentQuestionIndex, setCurrentQuestionIndex, matchedLawyers, setMatchedLawyers,
    agentMessages, addAgentMessage, clearAgent, language, setLanguage
  } = useAgent();

  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        handleUserInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages]);

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const detectCaseType = (input: string): CaseType | null => {
    const lowerInput = input.toLowerCase();
    for (const [type, keywords] of Object.entries(INTENT_KEYWORDS)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return type as CaseType;
      }
    }
    return null;
  };

  const handleUserInput = (input: string = userInput) => {
    if (!input.trim()) return;
    
    addAgentMessage('user', input);
    setUserInput('');

    if (phase === 'idle') {
      const detected = detectCaseType(input);
      if (detected) {
        setCaseType(detected);
        setPhase('confirming');
        const caseInfo = CASE_TYPES[detected];
        const confirmMsg = language === 'ur'
          ? `میں سمجھ گیا کہ آپ ${caseInfo.nameUrdu} فائل کرنا چاہتے ہیں۔ کیا میں یہ عمل شروع کروں؟`
          : `I understood that you want to file a ${caseInfo.name}. Shall I start the process for you?`;
        setTimeout(() => {
          addAgentMessage('agent', confirmMsg);
          speak(confirmMsg);
        }, 500);
      } else {
        const helpMsg = language === 'ur'
          ? 'براہ کرم بتائیں آپ کو کس قسم کی قانونی مدد چاہیے؟ مثلاً: طلاق کا کیس، جائیداد کا تنازعہ، ضمانت کی درخواست'
          : 'Please tell me what kind of legal help you need. For example: divorce case, property dispute, bail application';
        setTimeout(() => {
          addAgentMessage('agent', helpMsg);
          speak(helpMsg);
        }, 500);
      }
    } else if (phase === 'confirming') {
      const affirmatives = ['yes', 'ok', 'sure', 'proceed', 'start', 'haan', 'ji', 'ہاں', 'جی', 'theek'];
      if (affirmatives.some(a => input.toLowerCase().includes(a))) {
        setPhase('collecting_info');
        setCaseData({
          type: caseType!,
          answers: {},
          documents: [],
          status: 'draft'
        });
        setCurrentQuestionIndex(0);
        const caseInfo = CASE_TYPES[caseType!];
        const startMsg = language === 'ur'
          ? `بہت اچھا! آپ کا کیس شروع کرنے کے لیے مجھے کچھ معلومات چاہیے۔\n\nسوال 1 / ${caseInfo.questions.length}: ${caseInfo.questions[0].questionUrdu}`
          : `Great! To start your case, I need some information.\n\nQuestion 1 of ${caseInfo.questions.length}: ${caseInfo.questions[0].question}`;
        setTimeout(() => {
          addAgentMessage('agent', startMsg);
          speak(startMsg);
        }, 500);
      } else {
        clearAgent();
        const cancelMsg = language === 'ur' ? 'کوئی بات نہیں۔ جب چاہیں مجھ سے پوچھیں۔' : 'No problem. Feel free to ask me anytime.';
        setTimeout(() => {
          addAgentMessage('agent', cancelMsg);
          speak(cancelMsg);
        }, 500);
      }
    } else if (phase === 'collecting_info') {
      const caseInfo = CASE_TYPES[caseType!];
      const question = caseInfo.questions[currentQuestionIndex];
      
      setCaseData(prev => prev ? {
        ...prev,
        answers: { ...prev.answers, [question.id]: input }
      } : null);

      if (currentQuestionIndex < caseInfo.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        const nextQ = caseInfo.questions[currentQuestionIndex + 1];
        const nextMsg = language === 'ur'
          ? `سوال ${currentQuestionIndex + 2} / ${caseInfo.questions.length}: ${nextQ.questionUrdu}`
          : `Question ${currentQuestionIndex + 2} of ${caseInfo.questions.length}: ${nextQ.question}`;
        setTimeout(() => {
          addAgentMessage('agent', nextMsg);
          speak(nextMsg);
        }, 500);
      } else {
        setPhase('collecting_docs');
        const docsMsg = language === 'ur'
          ? `شکریہ! اب مجھے درج ذیل دستاویزات کی ضرورت ہے:\n\n${caseInfo.requiredDocsUrdu.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nبراہ کرم اپلوڈ کریں۔`
          : `Thank you! Now I need the following documents:\n\n${caseInfo.requiredDocs.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nPlease upload them.`;
        setTimeout(() => {
          addAgentMessage('agent', docsMsg);
          speak(docsMsg);
        }, 500);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: UploadedDocument = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          status: 'uploading'
        };
        setUploadedDocs(prev => [...prev, newDoc]);
        
        setTimeout(() => {
          setUploadedDocs(prev => 
            prev.map(d => d.id === newDoc.id ? { ...d, status: 'uploaded' as const } : d)
          );
        }, 1500);
      });
    }
  };

  const proceedToLawyerMatching = () => {
    setCaseData(prev => prev ? { ...prev, documents: uploadedDocs } : null);
    setPhase('matching_lawyer');
    
    const caseInfo = CASE_TYPES[caseType!];
    const filteredLawyers = MOCK_LAWYERS.filter(l => 
      l.specialization.toLowerCase().includes(caseInfo.category.split(' ')[0].toLowerCase()) ||
      Math.random() > 0.3
    ).slice(0, 3);
    setMatchedLawyers(filteredLawyers);
    
    const matchMsg = language === 'ur'
      ? `میں نے آپ کے کیس کے لیے موزوں وکلاء تلاش کیے ہیں۔ براہ کرم ایک منتخب کریں۔`
      : `I found suitable lawyers for your case. Please select one.`;
    addAgentMessage('agent', matchMsg);
    speak(matchMsg);
  };

  const selectLawyer = (lawyer: MatchedLawyer) => {
    setCaseData(prev => prev ? { ...prev, selectedLawyer: lawyer } : null);
    setPhase('creating_case');
    
    const createMsg = language === 'ur'
      ? `آپ نے ${lawyer.name} کو منتخب کیا۔ میں آپ کا کیس بنا رہا ہوں...`
      : `You selected ${lawyer.name}. I am creating your case...`;
    addAgentMessage('agent', createMsg);
    speak(createMsg);
    
    setTimeout(() => {
      const caseId = 'EHB-' + Date.now().toString().slice(-6);
      const caseInfo = CASE_TYPES[caseType!];
      setCaseData(prev => prev ? { 
        ...prev, 
        id: caseId, 
        status: 'submitted',
        createdAt: new Date(),
        totalFee: caseInfo.baseFee + lawyer.fee
      } : null);
      setPhase('payment');
      
      const successMsg = language === 'ur'
        ? `آپ کا کیس کامیابی سے بن گیا ہے!\n\nکیس ID: ${caseId}\n\nاب براہ کرم ادائیگی کریں تاکہ آپ کے وکیل کام شروع کر سکیں۔`
        : `Your case has been created successfully!\n\nCase ID: ${caseId}\n\nPlease make the payment so your lawyer can start working.`;
      addAgentMessage('agent', successMsg);
      speak(successMsg);
      setShowPayment(true);
    }, 2000);
  };

  const handlePayment = () => {
    setCaseData(prev => prev ? { ...prev, paymentStatus: 'in_escrow' } : null);
    setPhase('completed');
    
    const completeMsg = language === 'ur'
      ? `ادائیگی کامیاب! آپ کی رقم محفوظ طریقے سے ایسکرو میں رکھ دی گئی ہے۔ آپ کے وکیل کو مطلع کر دیا گیا ہے اور وہ جلد آپ کے کیس پر کام شروع کریں گے۔`
      : `Payment successful! Your funds are securely held in escrow. Your lawyer has been notified and will start working on your case shortly.`;
    addAgentMessage('agent', completeMsg);
    speak(completeMsg);
  };

  const renderPhaseContent = () => {
    switch (phase) {
      case 'collecting_docs':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mt-4"
          >
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Upload className="text-brand-gold" size={20} />
              {language === 'ur' ? 'دستاویزات اپلوڈ کریں' : 'Upload Documents'}
            </h4>
            
            <div className="space-y-2 mb-4">
              {uploadedDocs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <FileText className="text-brand-gold" size={20} />
                  <span className="text-white text-sm flex-1 truncate">{doc.name}</span>
                  {doc.status === 'uploading' && <Loader2 className="text-brand-gold animate-spin" size={18} />}
                  {doc.status === 'uploaded' && <CheckCircle2 className="text-green-400" size={18} />}
                </div>
              ))}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:bg-brand-gold/90 transition-all"
              >
                <Upload size={20} />
                {language === 'ur' ? 'فائل منتخب کریں' : 'Select Files'}
              </button>
              
              {uploadedDocs.length > 0 && (
                <button
                  onClick={proceedToLawyerMatching}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all"
                >
                  <ChevronRight size={20} />
                  {language === 'ur' ? 'آگے بڑھیں' : 'Continue'}
                </button>
              )}
            </div>
          </motion.div>
        );

      case 'matching_lawyer':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3"
          >
            <h4 className="text-white font-bold flex items-center gap-2">
              <Scale className="text-brand-gold" size={20} />
              {language === 'ur' ? 'تجویز کردہ وکلاء' : 'Recommended Lawyers'}
            </h4>
            
            {matchedLawyers.map(lawyer => (
              <motion.div
                key={lawyer.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-brand-gold/30"
                onClick={() => selectLawyer(lawyer)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold to-brand-primary flex items-center justify-center text-white font-bold text-xl">
                    {lawyer.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-bold">{lawyer.name}</h5>
                    <p className="text-ehb-textMuted text-sm">{lawyer.specialization} • {lawyer.experience}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-brand-gold text-sm">
                        <Star size={14} fill="currentColor" />
                        {lawyer.rating}
                      </span>
                      <span className="text-xs bg-brand-primary/30 text-brand-primary px-2 py-0.5 rounded">
                        {lawyer.sqlLevel}
                      </span>
                      <span className="text-green-400 text-sm font-bold">${lawyer.fee}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-ehb-textMuted" size={24} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'creating_case':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <Loader2 className="text-brand-gold animate-spin" size={48} />
            <p className="text-white mt-4">
              {language === 'ur' ? 'کیس بنایا جا رہا ہے...' : 'Creating your case...'}
            </p>
          </motion.div>
        );

      case 'payment':
        return showPayment && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mt-4"
          >
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-brand-gold" size={20} />
              {language === 'ur' ? 'ادائیگی کی تفصیلات' : 'Payment Details'}
            </h4>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-ehb-textMuted">{language === 'ur' ? 'سروس فیس' : 'Service Fee'}</span>
                <span className="text-white">${CASE_TYPES[caseType!].baseFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ehb-textMuted">{language === 'ur' ? 'وکیل فیس' : 'Lawyer Fee'}</span>
                <span className="text-white">${caseData?.selectedLawyer?.fee || 0}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-white font-bold">{language === 'ur' ? 'کل رقم' : 'Total'}</span>
                <span className="text-brand-gold font-bold text-lg">${caseData?.totalFee}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-ehb-textMuted mb-4">
              <Shield className="text-green-400" size={16} />
              {language === 'ur' ? 'ادائیگی ایسکرو میں محفوظ رہے گی' : 'Payment secured in escrow'}
            </div>

            <button
              onClick={handlePayment}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-brand-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all"
            >
              <CreditCard size={20} />
              {language === 'ur' ? 'محفوظ ادائیگی کریں' : 'Make Secure Payment'}
            </button>
          </motion.div>
        );

      case 'completed':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-500/20 to-brand-gold/20 rounded-xl p-6 mt-4 text-center"
          >
            <CheckCircle2 className="text-green-400 mx-auto mb-4" size={64} />
            <h4 className="text-white font-bold text-xl mb-2">
              {language === 'ur' ? 'کیس کامیابی سے بن گیا!' : 'Case Created Successfully!'}
            </h4>
            <p className="text-ehb-textBody mb-4">
              {language === 'ur' ? `کیس ID: ${caseData?.id}` : `Case ID: ${caseData?.id}`}
            </p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg">
                <MessageSquare size={18} />
                {language === 'ur' ? 'وکیل سے بات کریں' : 'Chat with Lawyer'}
              </button>
              <button 
                onClick={clearAgent}
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg"
              >
                <ArrowLeft size={18} />
                {language === 'ur' ? 'واپس' : 'Back'}
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-gold p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {language === 'ur' ? 'EHB قانونی ایجنٹ' : 'EHB Legal Agent'}
            </h3>
            <p className="text-white/70 text-sm">
              {language === 'ur' ? 'آپ کا ذاتی قانونی معاون' : 'Your Personal Legal Assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <Globe size={20} />
          </button>
          {isSpeaking ? (
            <button onClick={stopSpeaking} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
              <VolumeX size={20} />
            </button>
          ) : (
            <button className="p-2 rounded-full bg-white/20 text-white/50 cursor-default">
              <Volume2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {agentMessages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Bot className="text-brand-gold mx-auto mb-4" size={48} />
            <h4 className="text-white font-bold mb-2">
              {language === 'ur' ? 'میں آپ کا قانونی ایجنٹ ہوں' : 'I am your Legal Agent'}
            </h4>
            <p className="text-ehb-textMuted text-sm mb-4">
              {language === 'ur' 
                ? 'مجھے بتائیں آپ کو کیا قانونی مدد چاہیے اور میں آپ کے لیے سب کچھ کروں گا'
                : 'Tell me what legal help you need and I will handle everything for you'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Divorce', 'Property', 'Bail', 'Visa'].map(example => (
                <button
                  key={example}
                  onClick={() => handleUserInput(`I want to file a ${example.toLowerCase()} case`)}
                  className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {agentMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-br-sm' 
                  : 'bg-white/10 text-white rounded-bl-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {renderPhaseContent()}
        <div ref={messagesEndRef} />
      </div>

      {/* Progress Bar */}
      {phase !== 'idle' && phase !== 'completed' && (
        <div className="px-4 py-2 bg-white/5">
          <div className="flex items-center gap-2 text-xs text-ehb-textMuted mb-1">
            <Clock size={14} />
            {language === 'ur' ? 'پیش رفت' : 'Progress'}
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-primary to-brand-gold transition-all duration-500"
              style={{ 
                width: `${
                  phase === 'confirming' ? 15 :
                  phase === 'collecting_info' ? 30 :
                  phase === 'collecting_docs' ? 50 :
                  phase === 'matching_lawyer' ? 65 :
                  phase === 'creating_case' ? 80 :
                  phase === 'payment' ? 90 : 0
                }%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Input */}
      {phase !== 'completed' && phase !== 'creating_case' && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
              placeholder={language === 'ur' ? 'اپنا پیغام یہاں لکھیں...' : 'Type your message here...'}
              className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <button
              onClick={() => handleUserInput()}
              disabled={!userInput.trim()}
              className="p-3 rounded-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
