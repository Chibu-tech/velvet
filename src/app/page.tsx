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
    setTimeout(() => router.push("/discover"), 300);
  };

  if (!ageConfirmed) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#0E0E12]"
        >
          {!showContent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center"
            >
              <span className="text-5xl font-display font-medium text-[#C9A84C] mb-6">V</span>
              <div className="w-5 h-5 border border-[#C9A84C]/20 border-t-[#C9A84C]/60 rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center px-6 text-center"
            >
              <span className="text-5xl font-display font-medium text-[#C9A84C] mb-8">V</span>
              <h1 className="text-5xl font-display font-medium tracking-tight text-[#F0EDE6] mb-3">
                Velvet
              </h1>
              <p className="text-sm text-[#7A7870] font-light max-w-xs leading-relaxed mb-12">
                Verified Connections. Premium Experiences.
              </p>
              <button
                onClick={handleEnter}
                className="px-10 py-3.5 bg-[#C9A84C] text-[#0E0E12] font-medium rounded-[100px] transition-all duration-300 text-sm tracking-[0.04em] active:scale-[0.97]"
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
