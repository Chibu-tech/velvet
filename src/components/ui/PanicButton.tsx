"use client";

import { useState, useRef } from "react";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";

export function PanicButton() {
  const triggerPanicButton = useVelvetStore((state) => state.triggerPanicButton);
  const [arming, setArming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = () => {
    setArming(true);
    timerRef.current = setTimeout(() => {
      setArming(false);
      triggerPanicButton();
    }, 1500);
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (arming) setArming(false);
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        className={`fixed bottom-20 md:bottom-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all select-none ${
          arming ? "bg-rose-600 scale-110" : "bg-rose-600/80 hover:bg-rose-600"
        }`}
        title="Emergency (hold 1.5s)"
      >
        <ShieldAlert size={20} strokeWidth={1.5} className="text-white" />
      </motion.button>
    </AnimatePresence>
  );
}
