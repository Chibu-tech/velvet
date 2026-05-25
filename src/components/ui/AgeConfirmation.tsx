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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-velvet-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-sm p-8 glass-panel rounded-3xl border border-white/[0.06] text-center flex flex-col items-center"
      >
        <div className="w-14 h-14 mb-6 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30">
          <ShieldCheck size={28} />
        </div>

        <h1 className="text-2xl font-display font-bold tracking-tight text-white/90 mb-1">
          VELVET
        </h1>
        <p className="text-[10px] text-white/30 font-medium uppercase tracking-[0.2em] mb-6">
          Verified Connections. Premium Experiences.
        </p>

        <p className="text-sm text-white/50 mb-8 leading-relaxed font-light">
          You must be 18 or older to enter. Please confirm your age to proceed.
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white/80 font-medium rounded-xl border border-white/[0.06] hover:border-white/10 transition-all duration-500 text-sm"
          >
            I am 18 or older
          </button>

          <button
            onClick={() => setError(true)}
            className="w-full py-3 text-white/30 hover:text-white/50 rounded-xl transition-colors text-xs"
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
              className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-left text-xs"
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <div>
                <span className="text-white/60 font-medium block mb-0.5">Access Denied</span>
                You must be 18 or older to enter Velvet.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
