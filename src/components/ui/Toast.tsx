"use client";

import { useVelvetStore } from "@/store/useVelvetStore";
import { useEffect, useState } from "react";
import { X, MessageSquare, ShieldCheck, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Toast() {
  const notifications = useVelvetStore((state) => state.notifications);
  const markAsRead = useVelvetStore((state) => state.markNotificationsAsRead);
  const [activeToast, setActiveToast] = useState<typeof notifications[0] | null>(null);

  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length > 0) {
      setActiveToast(unread[0]);
      const timer = setTimeout(() => {
        markAsRead();
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, markAsRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare size={14} className="text-white/50" />;
      case "booking_approved":
        return <ShieldCheck size={14} className="text-white/50" />;
      case "booking_request":
        return <Calendar size={14} className="text-white/50" />;
      default:
        return <MessageSquare size={14} className="text-white/50" />;
    }
  };

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-20 md:bottom-6 right-6 z-[9999] w-full max-w-sm glass-panel border border-white/[0.06] p-4 rounded-2xl flex items-start gap-3"
        >
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] shrink-0">
            {getIcon(activeToast.type)}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-medium text-white/70">{activeToast.title}</h4>
            <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{activeToast.message}</p>
          </div>

          <button
            onClick={() => setActiveToast(null)}
            className="text-white/20 hover:text-white/60 transition-colors p-1 shrink-0"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
