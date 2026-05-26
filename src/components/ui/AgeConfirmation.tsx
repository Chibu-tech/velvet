"use client";

import { useState } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgeConfirmationProps {
  onConfirm: () => void;
}

export function AgeConfirmation({ onConfirm }: AgeConfirmationProps) {
  const [error, setError] = useState(false);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#0E0E12]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#80465E]/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-sm p-8 bg-[#1A1A22] rounded-[24px] border border-white/[0.07] text-center flex flex-col items-center"
      >
        <div className="w-14 h-14 mb-6 rounded-full bg-[#22222E] border border-white/[0.07] flex items-center justify-center">
          <ShieldCheck size={28} strokeWidth={1.5} className="text-[#80465E]" />
        </div>

        <h1 className="text-3xl font-display font-medium tracking-tight text-[#F0EDE6] mb-1">
          Premium
        </h1>
        <p className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] mb-6">
          Verified Connections. Premium Experiences.
        </p>

        <p className="text-sm text-[#7A7870] mb-8 leading-relaxed font-light">
          You must be 18 or older to enter. Please confirm your age to proceed.
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] transition-all duration-300 text-sm tracking-[0.04em] active:scale-[0.97]"
          >
            I am 18 or older
          </button>

          <button
            onClick={() => setError(true)}
            className="w-full py-3 text-[#7A7870] hover:text-[#F0EDE6] rounded-[100px] transition-colors text-xs"
          >
            I am under 18
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-start gap-3 p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07] text-[#7A7870] text-left text-xs"
            >
              <AlertCircle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5 text-[#80465E]" />
              <div>
                <span className="text-[#F0EDE6] font-medium block mb-0.5">Access Denied</span>
                You must be 18 or older to enter.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
