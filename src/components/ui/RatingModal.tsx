"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { Booking } from "@/lib/mockData";

interface Props {
  booking: Booking;
  companionName: string;
  onClose: () => void;
}

export function RatingModal({ booking, companionName, onClose }: Props) {
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
          <div className="text-center py-6 flex flex-col items-center gap-3">
            <Star size={48} strokeWidth={1.5} className="text-[#80465E]" fill="currentColor" />
            <p className="text-sm font-medium text-[#F0EDE6]">Rating Submitted</p>
            <p className="text-xs text-[#7A7870]">Thank you for your feedback.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h3 className="text-lg font-display font-medium text-[#F0EDE6] text-center">
              Rate your experience with {companionName}
            </h3>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-1 transition-all active:scale-90"
                >
                  <Star
                    size={32}
                    strokeWidth={1.5}
                    className={`transition-colors ${
                      star <= (hovered || score)
                        ? "text-[#80465E] fill-[#80465E]"
                        : "text-[#4A4845]"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Share your experience (optional)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-xs placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none transition-all resize-none"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={score === 0}
                className="flex-1 py-3 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-xs tracking-[0.04em] transition-all active:scale-[0.97] disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
