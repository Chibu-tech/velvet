"use client";

import { useVelvetStore } from "@/store/useVelvetStore";
import { useEffect, useState } from "react";
import { X, MessageSquare, ShieldCheck, Calendar, ShieldAlert, Star, LogIn, AlertTriangle } from "lucide-react";
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
        return <MessageSquare size={14} strokeWidth={1.5} className="text-[#C9A84C]" />;
      case "booking_approved":
        return <ShieldCheck size={14} strokeWidth={1.5} className="text-[#C9A84C]" />;
      case "booking_request":
        return <Calendar size={14} strokeWidth={1.5} className="text-[#C9A84C]" />;
      case "booking_active":
        return <LogIn size={14} strokeWidth={1.5} className="text-emerald-400" />;
      case "safety_alert":
        return <ShieldAlert size={14} strokeWidth={1.5} className="text-rose-400" />;
      case "panic":
        return <AlertTriangle size={14} strokeWidth={1.5} className="text-rose-400" />;
      case "rating":
        return <Star size={14} strokeWidth={1.5} className="text-[#C9A84C]" />;
      default:
        return <MessageSquare size={14} strokeWidth={1.5} className="text-[#C9A84C]" />;
    }
  };

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-20 md:bottom-6 right-6 z-[9999] w-full max-w-sm bg-[#1A1A22] border border-white/[0.07] p-5 rounded-[18px] flex items-start gap-3"
        >
          <div className="p-2 rounded-xl bg-[#22222E] border border-white/[0.07] shrink-0">
            {getIcon(activeToast.type)}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-medium text-[#F0EDE6]">{activeToast.title}</h4>
            <p className="text-xs text-[#7A7870] mt-0.5 leading-relaxed">{activeToast.message}</p>
          </div>

          <button
            onClick={() => setActiveToast(null)}
            className="text-[#7A7870] hover:text-[#F0EDE6] transition-colors p-1 shrink-0"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
