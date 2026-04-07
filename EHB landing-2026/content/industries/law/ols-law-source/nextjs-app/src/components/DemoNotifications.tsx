'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, MessageSquare, FileText, CheckCircle2, Users, Scale, Sparkles } from 'lucide-react';

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    type: 'message',
    icon: MessageSquare,
    title: 'New Message from Lawyer',
    message: 'Sarah Ahmed: "I reviewed your documents..."',
    time: '2 min ago',
    color: 'blue',
  },
  {
    id: 2,
    type: 'case',
    icon: FileText,
    title: 'Case Update',
    message: 'Your divorce case status changed to "In Review"',
    time: '5 min ago',
    color: 'emerald',
  },
  {
    id: 3,
    type: 'match',
    icon: Users,
    title: 'New Lawyer Match',
    message: 'AI found 3 lawyers matching your criteria',
    time: '10 min ago',
    color: 'violet',
  },
  {
    id: 4,
    type: 'payment',
    icon: CheckCircle2,
    title: 'Payment Received',
    message: 'Escrow payment of $1,500 confirmed',
    time: '15 min ago',
    color: 'green',
  },
  {
    id: 5,
    type: 'ai',
    icon: Sparkles,
    title: 'AI Analysis Complete',
    message: 'Your case documents have been analyzed',
    time: '20 min ago',
    color: 'amber',
  },
];

export default function DemoNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [showToast, setShowToast] = useState(false);
  const [currentToast, setCurrentToast] = useState<typeof DEMO_NOTIFICATIONS[0] | null>(null);

  useEffect(() => {
    const showRandomNotification = () => {
      const randomIndex = Math.floor(Math.random() * DEMO_NOTIFICATIONS.length);
      setCurrentToast(DEMO_NOTIFICATIONS[randomIndex]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    const interval = setInterval(showRandomNotification, 30000);
    
    const initialTimeout = setTimeout(showRandomNotification, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-slate-700 transition-all shadow-lg"
        >
          <Bell className="text-white" size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-14 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Notifications</h3>
                  <p className="text-xs text-ehb-textMuted">Demo notifications</p>
                </div>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-[#D4AF37] hover:text-yellow-400"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto text-ehb-textMuted mb-2" size={32} />
                    <p className="text-ehb-textMuted text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClasses(notif.color)}`}>
                          <notif.icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{notif.title}</p>
                          <p className="text-ehb-textMuted text-xs truncate">{notif.message}</p>
                          <p className="text-ehb-textMuted text-xs mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-white/10">
                <button className="w-full py-2 text-[#D4AF37] text-sm font-medium hover:bg-white/5 rounded-lg transition-all">
                  View All Notifications
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && currentToast && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-24 right-4 z-50 w-80"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClasses(currentToast.color)}`}>
                  <currentToast.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{currentToast.title}</p>
                  <p className="text-ehb-textMuted text-xs">{currentToast.message}</p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="text-ehb-textMuted hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className={`h-full ${currentToast.color === 'blue' ? 'bg-blue-500' : currentToast.color === 'emerald' ? 'bg-emerald-500' : currentToast.color === 'violet' ? 'bg-violet-500' : currentToast.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
