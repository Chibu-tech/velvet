"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle, MapPin, Clock, Star, ShieldAlert, ArrowLeft,
  MessageSquare, Calendar, Sparkles, Flag, Ban, Award, ShieldCheck, Globe, Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ProfileDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const companions = useVelvetStore((state) => state.companions);
  const createConversation = useVelvetStore((state) => state.createConversation);
  const reportUser = useVelvetStore((state) => state.reportUser);
  const blockUser = useVelvetStore((state) => state.blockUser);

  const [safetyAction, setSafetyAction] = useState<"report" | "block" | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [actionDone, setActionDone] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const companion = companions.find((c) => c.id === id);

  if (!companion) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-[#0E0E12]">
        <h2 className="text-xl font-display font-medium text-[#F0EDE6]">Profile Not Found</h2>
        <p className="text-sm text-[#7A7870] mt-2">This profile does not exist.</p>
        <Link href="/discover" className="mt-4 px-6 py-3 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">Back to Discover</Link>
      </div>
    );
  }

  const handleSafetySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (safetyAction === "report") reportUser(id, reportReason);
    else if (safetyAction === "block") blockUser(id);
    setActionDone(true);
    setTimeout(() => { setSafetyAction(null); setActionDone(false); setReportReason(""); }, 2000);
  };

  const allImages = [companion.avatarUrl, ...companion.images];

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E12] min-h-[calc(100vh-4rem)] p-5 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10">
        <Link href="/discover"
          className="flex items-center gap-2 p-2.5 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] transition-all text-xs font-medium hover:bg-white/[0.04] active:scale-[0.97]">
          <ArrowLeft size={14} strokeWidth={1.5} />Back
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setSafetyAction("report")}
            className="min-w-[48px] min-h-[48px] rounded-full border border-white/[0.2] text-[#7A7870] hover:text-rose-400 transition-all flex items-center justify-center" title="Report">
            <Flag size={14} strokeWidth={1.5} />
          </button>
          <button onClick={() => setSafetyAction("block")}
            className="min-w-[48px] min-h-[48px] rounded-full border border-white/[0.2] text-[#7A7870] hover:text-rose-400 transition-all flex items-center justify-center" title="Block">
            <Ban size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 z-10 items-start">
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] rounded-[18px] overflow-hidden border border-white/[0.07] relative">
            <img src={allImages[selectedImage]} alt={companion.displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,18,0.7)] to-transparent pointer-events-none" />
            <div className="absolute top-5 left-5 flex gap-2">
              {companion.isVerified && (
                <span className="px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)] flex items-center gap-1">
                  <ShieldCheck size={12} strokeWidth={1.5} />Verified
                </span>
              )}
              {companion.trustScore >= 95 && (
                <span className="px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)] flex items-center gap-1">
                  <Award size={12} strokeWidth={1.5} />Elite
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-[12px] overflow-hidden border shrink-0 transition-all ${selectedImage === idx ? "border-[#80465E]" : "border-white/[0.07] hover:border-white/20"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-6 flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-display font-medium text-[#F0EDE6] flex items-center gap-2">
                  {companion.displayName}
                  {companion.isVerified && <CheckCircle size={22} strokeWidth={1.5} className="text-[#80465E]" />}
                </h1>
                <div className="flex items-center gap-1.5 bg-[#22222E] px-3 py-1 rounded-[100px] text-[#80465E] font-medium text-[10px] uppercase tracking-[0.12em] border border-[rgba(128,70,94,0.3)]">
                  <Star size={13} strokeWidth={1.5} fill="currentColor" />{companion.rating.toFixed(1)}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-[10px] font-medium tracking-[0.12em] uppercase text-[#7A7870]">
                <span className="flex items-center gap-1.5"><MapPin size={13} strokeWidth={1.5} className="text-[#80465E]" />{companion.distanceKm} km</span>
                <span className="flex items-center gap-1.5"><Clock size={13} strokeWidth={1.5} className="text-[#80465E]" />{companion.lastActive}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/[0.07] text-center">
              <div><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">Trust</span><span className="text-lg font-display font-medium text-[#F0EDE6] mt-1 block">{companion.trustScore}%</span></div>
              <div><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">Response</span><span className="text-lg font-display font-medium text-[#F0EDE6] mt-1 block">{companion.responseRate}%</span></div>
              <div><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">Status</span>
                <span className={`text-[10px] uppercase tracking-[0.12em] font-medium mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[100px] ${
                  companion.availabilityStatus === "available" ? "bg-[#22222E] text-[#80465E] border border-[rgba(128,70,94,0.3)]" : "bg-[#22222E] text-[#7A7870] border border-white/[0.07]"
                }`}>{companion.availabilityStatus}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">About</h3>
              <p className="text-sm text-[#7A7870] leading-relaxed">{companion.bio}</p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {companion.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]">{interest}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {companion.languages.map((lang, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]">
                    <Globe size={10} strokeWidth={1.5} />{lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-[18px] bg-[#22222E] border border-white/[0.07] flex justify-between items-center">
              <div><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em]">Hourly</span><span className="text-2xl font-display font-medium text-[#F0EDE6] mt-1 block">${companion.pricingHourly}</span></div>
              <div className="text-right"><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em]">Daily</span><span className="text-lg font-display font-medium text-[#80465E] mt-1 block">${companion.pricingDaily}</span></div>
            </div>
            <div className="flex gap-4">
              <button onClick={async () => { const cid = await createConversation(companion.id); router.push(`/chat?conv=${cid}`); }}
                className="flex-1 py-4 border border-white/[0.2] text-[#F0EDE6] font-medium rounded-[100px] text-sm tracking-[0.04em] flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
                <MessageSquare size={16} strokeWidth={1.5} className="text-[#80465E]" />Message
              </button>
              <Link href={`/bookings?companion=${companion.id}`}
                className="flex-1 py-4 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
                <Calendar size={16} strokeWidth={1.5} />Request introduction
              </Link>
              <button className="min-w-[48px] min-h-[48px] border border-white/[0.2] text-[#7A7870] hover:text-[#80465E] rounded-[100px] transition-all flex items-center justify-center active:scale-[0.97]">
                <Heart size={16} strokeWidth={1.5} />
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-display font-medium text-[#F0EDE6] mb-4 flex items-center gap-2"><Award size={16} strokeWidth={1.5} className="text-[#80465E]" />Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {companion.trustScore >= 95 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]"><Award size={12} strokeWidth={1.5} />Elite Member</span>
              )}
              {companion.responseRate === 100 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]"><Sparkles size={12} strokeWidth={1.5} />Quick Responder</span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]"><Star size={12} strokeWidth={1.5} />{companion.reviewsCount} Reviews</span>
            </div>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {safetyAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-md p-6 bg-[#1A1A22] rounded-[24px] border border-white/[0.07]">
              <div className="flex items-center gap-3 text-rose-400 font-medium text-lg mb-4">
                <ShieldAlert size={20} strokeWidth={1.5} /><span>{safetyAction === "report" ? "Report Profile" : "Block Member"}</span>
              </div>
              {actionDone ? (
                <div className="text-center py-6 flex flex-col items-center">
                  <CheckCircle size={40} strokeWidth={1.5} className="text-green-400 mb-2" />
                  <p className="text-sm font-medium text-[#F0EDE6]">Action Completed</p>
                  <p className="text-xs text-[#7A7870] mt-1">Our team will review this within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSafetySubmit} className="flex flex-col gap-4">
                  {safetyAction === "report" ? (
                    <>
                      <p className="text-xs text-[#7A7870] leading-relaxed">Tell us what happened. All reports are confidential.</p>
                      <textarea rows={3} required placeholder="Describe the issue..." value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full px-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-rose-500 focus:outline-none transition-all resize-none" />
                    </>
                  ) : (
                    <p className="text-xs text-[#7A7870] leading-relaxed">Are you sure you want to block {companion.displayName}?</p>
                  )}
                  <div className="flex gap-3 justify-end mt-2">
                    <button type="button" onClick={() => setSafetyAction(null)}
                      className="px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs transition-all active:scale-[0.97]">Cancel</button>
                    <button type="submit"
                      className="px-5 py-2 bg-rose-600 text-white font-medium rounded-[100px] text-xs transition-all active:scale-[0.97]">Confirm</button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
