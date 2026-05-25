"use client";

import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import type { Booking } from "@/lib/mockData";

export function RatingModal({
  booking,
  companionName,
  onClose,
}: {
  booking: Booking;
  companionName: string;
  onClose: () => void;
}) {
  const submitRating = useVelvetStore((state) => state.submitRating);
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) return;
    submitRating(booking.id, booking.companionId, score, review || undefined);
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="w-full max-w-md p-6 bg-[#1A1A22] rounded-[24px] border border-white/[0.07]"
        >
          {submitted ? (
            <div className="text-center py-6 flex flex-col items-center">
              <CheckCircle size={40} strokeWidth={1.5} className="text-green-400 mb-2" />
              <p className="text-sm font-medium text-[#F0EDE6]">Rating Submitted</p>
              <p className="text-xs text-[#7A7870] mt-1">Thank you for your feedback.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="text-center">
                <h3 className="text-lg font-display font-medium text-[#F0EDE6]">Rate Your Experience</h3>
                <p className="text-xs text-[#7A7870] mt-1">How was your time with {companionName}?</p>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-all active:scale-90"
                  >
                    <Star
                      size={32}
                      strokeWidth={1.5}
                      fill={star <= (hovered || score) ? "#C9A84C" : "transparent"}
                      className={star <= (hovered || score) ? "text-[#C9A84C]" : "text-[#4A4845]"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Share your experience (optional)..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all resize-none"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs transition-all active:scale-[0.97]"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={score === 0}
                  className="flex-[2] py-3 bg-[#C9A84C] text-[#0E0E12] font-medium rounded-[100px] text-xs transition-all active:scale-[0.97] disabled:opacity-40"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
