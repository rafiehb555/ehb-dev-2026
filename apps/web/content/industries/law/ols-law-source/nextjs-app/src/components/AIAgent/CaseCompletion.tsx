'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2, Star, MessageSquare, ThumbsUp, ThumbsDown,
  Award, Shield, Wallet, AlertCircle, ArrowRight,
  Sparkles, Clock, Scale, FileText, X
} from 'lucide-react';

interface CaseCompletionProps {
  caseId: string;
  caseType: string;
  lawyerName: string;
  lawyerId: string;
  totalAmount: number;
  language?: 'en' | 'ur';
  onComplete?: () => void;
}

export default function CaseCompletion({
  caseId,
  caseType,
  lawyerName,
  lawyerId,
  totalAmount,
  language = 'en',
  onComplete
}: CaseCompletionProps) {
  const [step, setStep] = useState<'review' | 'feedback' | 'complete'>('review');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState<'satisfied' | 'neutral' | 'unsatisfied' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDispute, setShowDispute] = useState(false);

  const feedbackTags = [
    { en: 'Professional', ur: 'پیشہ ور' },
    { en: 'Responsive', ur: 'فوری جواب' },
    { en: 'Knowledgeable', ur: 'ماہر' },
    { en: 'Helpful', ur: 'مددگار' },
    { en: 'Good Communication', ur: 'اچھی بات چیت' },
    { en: 'Timely', ur: 'وقت پر' }
  ];

  const handleConfirmCompletion = () => {
    setStep('feedback');
  };

  const handleSubmitFeedback = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('complete');
    }, 2000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const paymentBreakdown = {
    lawyerFee: totalAmount * 0.75,
    platformFee: totalAmount * 0.15,
    franchiseFee: totalAmount * 0.10
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-brand-gold flex items-center justify-center">
                <CheckCircle2 className="text-white" size={40} />
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">
                {language === 'ur' ? 'کیس مکمل ہو گیا!' : 'Case Completed!'}
              </h2>
              <p className="text-ehb-textMuted">
                {language === 'ur' 
                  ? 'آپ کے وکیل نے کیس مکمل کر دیا ہے۔ براہ کرم جائزہ لیں۔'
                  : 'Your lawyer has marked the case as completed. Please review.'}
              </p>
            </div>

            {/* Case Summary */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Scale className="text-brand-gold" size={20} />
                {language === 'ur' ? 'کیس کی تفصیلات' : 'Case Summary'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'کیس ID' : 'Case ID'}</span>
                  <span className="text-white font-mono">{caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'کیس کی قسم' : 'Case Type'}</span>
                  <span className="text-white">{caseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'وکیل' : 'Lawyer'}</span>
                  <span className="text-white">{lawyerName}</span>
                </div>
              </div>
            </div>

            {/* Payment Release */}
            <div className="bg-gradient-to-r from-brand-gold/10 to-brand-primary/10 rounded-xl p-4 mb-6 border border-brand-gold/20">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Wallet className="text-brand-gold" size={20} />
                {language === 'ur' ? 'ایسکرو ادائیگی' : 'Escrow Payment'}
              </h3>
              <p className="text-ehb-textMuted text-sm mb-4">
                {language === 'ur' 
                  ? 'تصدیق کرنے پر ایسکرو سے ادائیگی جاری ہو جائے گی'
                  : 'Upon confirmation, payment will be released from escrow'}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'وکیل فیس' : 'Lawyer Fee'}</span>
                  <span className="text-white">${paymentBreakdown.lawyerFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'پلیٹ فارم فیس' : 'Platform Fee'}</span>
                  <span className="text-white">${paymentBreakdown.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'فرنچائز فیس' : 'Franchise Fee'}</span>
                  <span className="text-white">${paymentBreakdown.franchiseFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-white font-bold">{language === 'ur' ? 'کل' : 'Total'}</span>
                  <span className="text-brand-gold font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmCompletion}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={24} />
                {language === 'ur' ? 'تصدیق کریں اور ادائیگی جاری کریں' : 'Confirm & Release Payment'}
              </motion.button>
              
              <button 
                onClick={() => setShowDispute(true)}
                className="w-full py-3 bg-white/5 text-ehb-textMuted rounded-xl hover:bg-white/10 transition-all text-sm"
              >
                {language === 'ur' ? 'مسئلہ رپورٹ کریں' : 'Report an Issue'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-gold to-brand-primary flex items-center justify-center">
                <Star className="text-white" size={40} />
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">
                {language === 'ur' ? 'اپنا تجربہ بتائیں' : 'Rate Your Experience'}
              </h2>
              <p className="text-ehb-textMuted">
                {language === 'ur' 
                  ? 'آپ کی رائے ہمیں بہتر بنانے میں مدد کرتی ہے'
                  : 'Your feedback helps us improve'}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-brand-gold fill-brand-gold'
                        : 'text-ehb-textMuted'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <p className="text-center text-ehb-textMuted text-sm mb-6">
              {rating === 0 ? (language === 'ur' ? 'ستارے منتخب کریں' : 'Select stars') :
               rating === 1 ? (language === 'ur' ? 'بہت خراب' : 'Very Poor') :
               rating === 2 ? (language === 'ur' ? 'خراب' : 'Poor') :
               rating === 3 ? (language === 'ur' ? 'ٹھیک ہے' : 'Okay') :
               rating === 4 ? (language === 'ur' ? 'اچھا' : 'Good') :
               (language === 'ur' ? 'بہترین' : 'Excellent')}
            </p>

            {/* Satisfaction */}
            <div className="mb-6">
              <p className="text-white font-medium text-center mb-3">
                {language === 'ur' ? 'کیا آپ سروس سے مطمئن ہیں؟' : 'Are you satisfied with the service?'}
              </p>
              <div className="flex justify-center gap-4">
                {[
                  { id: 'satisfied', icon: ThumbsUp, label: language === 'ur' ? 'ہاں' : 'Yes', color: 'green' },
                  { id: 'neutral', icon: Scale, label: language === 'ur' ? 'ٹھیک ہے' : 'Okay', color: 'yellow' },
                  { id: 'unsatisfied', icon: ThumbsDown, label: language === 'ur' ? 'نہیں' : 'No', color: 'red' }
                ].map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSatisfaction(option.id as any)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                      satisfaction === option.id
                        ? option.color === 'green' ? 'bg-green-500/20 border-green-500' :
                          option.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500' :
                          'bg-red-500/20 border-red-500'
                        : 'bg-white/5 border-transparent'
                    } border-2`}
                  >
                    <option.icon 
                      size={28} 
                      className={
                        satisfaction === option.id
                          ? option.color === 'green' ? 'text-green-400' :
                            option.color === 'yellow' ? 'text-yellow-400' :
                            'text-red-400'
                          : 'text-ehb-textMuted'
                      }
                    />
                    <span className="text-white text-sm">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <p className="text-white font-medium mb-3">
                {language === 'ur' ? 'وکیل کی خصوصیات' : 'Lawyer Qualities'}
              </p>
              <div className="flex flex-wrap gap-2">
                {feedbackTags.map((tag) => (
                  <button
                    key={tag.en}
                    onClick={() => toggleTag(tag.en)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag.en)
                        ? 'bg-brand-gold text-brand-dark'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {language === 'ur' ? tag.ur : tag.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Written Feedback */}
            <div className="mb-6">
              <label className="text-white font-medium mb-2 block">
                {language === 'ur' ? 'تحریری رائے (اختیاری)' : 'Written Feedback (Optional)'}
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={language === 'ur' ? 'اپنا تجربہ تفصیل سے بتائیں...' : 'Share your experience in detail...'}
                rows={4}
                className="w-full bg-white/5 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold border border-white/10"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitFeedback}
              disabled={rating === 0 || isProcessing}
              className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  {language === 'ur' ? 'جمع ہو رہا ہے...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <MessageSquare size={24} />
                  {language === 'ur' ? 'رائے جمع کریں' : 'Submit Feedback'}
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-900/30 via-slate-800 to-slate-900 rounded-2xl p-8 border border-green-500/20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-brand-gold flex items-center justify-center"
            >
              <Award className="text-white" size={48} />
            </motion.div>
            
            <h2 className="text-white font-bold text-2xl mb-2">
              {language === 'ur' ? 'شکریہ!' : 'Thank You!'}
            </h2>
            <p className="text-ehb-textMuted mb-6">
              {language === 'ur' 
                ? 'آپ کی رائے کا شکریہ۔ ادائیگی کامیابی سے جاری ہو گئی۔'
                : 'Thank you for your feedback. Payment has been released successfully.'}
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Sparkles className="text-brand-gold" size={18} />
                {language === 'ur' ? 'مزید قانونی مدد چاہیے؟' : 'Need More Legal Help?'}
              </h4>
              <p className="text-ehb-textMuted text-sm mb-4">
                {language === 'ur' 
                  ? 'ہم آپ کی مدد کے لیے ہمیشہ موجود ہیں'
                  : 'We are always here to help you'}
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium">
                  {language === 'ur' ? 'نیا کیس' : 'New Case'}
                </button>
                <button className="flex-1 py-2 bg-white/10 text-white rounded-lg text-sm font-medium">
                  {language === 'ur' ? 'AI سے پوچھیں' : 'Ask AI'}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onComplete}
              className="w-full py-3 bg-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              {language === 'ur' ? 'ڈیش بورڈ پر جائیں' : 'Go to Dashboard'}
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dispute Modal */}
      <AnimatePresence>
        {showDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDispute(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <AlertCircle className="text-orange-400" size={20} />
                  {language === 'ur' ? 'مسئلہ رپورٹ کریں' : 'Report an Issue'}
                </h3>
                <button onClick={() => setShowDispute(false)} className="text-ehb-textMuted hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-ehb-textMuted text-sm mb-4">
                {language === 'ur' 
                  ? 'اگر آپ کو کوئی مسئلہ ہے تو براہ کرم بتائیں'
                  : 'Please describe the issue you are facing'}
              </p>

              <textarea
                placeholder={language === 'ur' ? 'مسئلے کی تفصیل...' : 'Describe the issue...'}
                rows={4}
                className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold border border-white/10 mb-4"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDispute(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl"
                >
                  {language === 'ur' ? 'منسوخ' : 'Cancel'}
                </button>
                <button className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl">
                  {language === 'ur' ? 'جمع کریں' : 'Submit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
