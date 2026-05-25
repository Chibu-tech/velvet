"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Splash() {
  const router = useRouter();
  const ageConfirmed = useVelvetStore((state) => state.ageConfirmed);
  const [showContent, setShowContent] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => router.push("/discover"), 600);
  };

  if (!ageConfirmed) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-velvet-black"
        >
          <div className="absolute inset-0 bg-subtle-glow pointer-events-none" />
          <div className="absolute inset-0 bg-subtle-light pointer-events-none" />

          {!showContent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full border border-white/[0.06] flex items-center justify-center mb-6"
                style={{ boxShadow: "0 0 40px rgba(201, 169, 78, 0.06)" }}>
                <span className="text-4xl font-display font-bold text-gold">V</span>
              </div>
              <div className="w-5 h-5 border border-velvet-gold/20 border-t-velvet-gold/60 rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center px-6 text-center"
            >
              <div className="w-20 h-20 rounded-full border border-white/[0.06] flex items-center justify-center mb-8"
                style={{ boxShadow: "0 0 40px rgba(201, 169, 78, 0.06)" }}>
                <span className="text-4xl font-display font-bold text-gold">V</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white/90 mb-3">
                Velvet
              </h1>
              <p className="text-sm text-white/40 font-light max-w-xs leading-relaxed mb-12">
                Verified Connections. Premium Experiences.
              </p>
              <button
                onClick={handleEnter}
                className="px-10 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 font-medium rounded-xl border border-white/[0.06] hover:border-velvet-gold/20 transition-all duration-500 text-sm tracking-wide"
              >
                Enter
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
