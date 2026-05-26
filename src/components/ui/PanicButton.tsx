"use client";

import { useEffect, useRef } from "react";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";

export function PanicButton() {
  const panicModalState = useVelvetStore((state) => state.panicModalState);
  const triggerPanicButton = useVelvetStore((state) => state.triggerPanicButton);
  const cancelPanic = useVelvetStore((state) => state.cancelPanic);
  const setPanicModalState = useVelvetStore((state) => state.setPanicModalState);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (longPressRef.current) clearTimeout(longPressRef.current);
    };
  }, []);

  const handlePointerDown = () => {
    setPanicModalState({ show: true, countingDown: true, countdownValue: 5 });
    intervalRef.current = setInterval(() => {
      const current = useVelvetStore.getState().panicModalState.countdownValue;
      if (current <= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        triggerPanicButton();
      } else {
        setPanicModalState({ countdownValue: current - 1 });
      }
    }, 1000);
  };

  const handlePointerUp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!panicModalState.countingDown) return;
    cancelPanic();
  };

  return (
    <>
      <button
        ref={buttonRef}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        className="relative p-3 rounded-xl transition-all duration-300 group flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 active:bg-rose-500/20"
        title="Safety (hold 5s for emergency)"
      >
        <ShieldAlert size={20} strokeWidth={1.5} />
        <span className="absolute left-[calc(100%+12px)] px-2.5 py-1 text-[11px] font-medium text-[#F0EDE6]/80 bg-[#1A1A22] rounded-lg border border-white/[0.07] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Emergency
        </span>
      </button>

      <AnimatePresence>
        {panicModalState.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-sm p-8 bg-[#1A1A22] rounded-[24px] border border-rose-500/20 text-center flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center">
                <span className="text-3xl font-display font-bold text-rose-400">
                  {panicModalState.countdownValue}
                </span>
              </div>
              <h3 className="text-lg font-display font-medium text-rose-400">Emergency Alert</h3>
              <p className="text-xs text-[#7A7870] leading-relaxed">
                Hold to trigger a distress alert. Your emergency contacts and platform admins will be notified immediately.
              </p>
              <button
                onClick={cancelPanic}
                className="px-6 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97] mt-2"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
