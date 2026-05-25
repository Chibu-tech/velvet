"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  Clock,
  Star,
  ShieldAlert,
  ArrowLeft,
  MessageSquare,
  Calendar,
  Sparkles,
  Flag,
  Ban,
  Award,
  ShieldCheck,
  Globe,
  Heart,
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
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-velvet-black">
        <h2 className="text-xl font-bold text-white">Profile Not Found</h2>
        <p className="text-sm text-white/40 mt-2">This profile does not exist.</p>
        <Link href="/discover" className="mt-4 px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10">
          Back to Discover
        </Link>
      </div>
    );
  }

  const handleSafetySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (safetyAction === "report") {
      reportUser(id, reportReason);
    } else if (safetyAction === "block") {
      blockUser(id);
    }
    setActionDone(true);
    setTimeout(() => {
      setSafetyAction(null);
      setActionDone(false);
      setReportReason("");
    }, 2000);
  };

  const allImages = [companion.avatarUrl, ...companion.images];

  return (
    <div className="flex-1 flex flex-col bg-velvet-black min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-6 z-10">
        <Link
          href="/discover"
          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </Link>

        <div className="flex gap-2">
          <button
            onClick={() => setSafetyAction("report")}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-rose-400 transition-all"
            title="Report"
          >
            <Flag size={14} />
          </button>
          <button
            onClick={() => setSafetyAction("block")}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-rose-400 transition-all"
            title="Block"
          >
            <Ban size={14} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 z-10 items-start">
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
          <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 relative">
            <img src={allImages[selectedImage]} alt={companion.displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-5 left-5 flex gap-2">
              {companion.isVerified && (
                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold tracking-wider text-velvet-gold border border-velvet-gold/20 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>VERIFIED</span>
                </span>
              )}
              {companion.trustScore >= 95 && (
                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold tracking-wider text-white/80 border border-white/10 flex items-center gap-1">
                  <Award size={12} />
                  <span>ELITE</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border shrink-0 transition-all ${
                  selectedImage === idx ? "border-velvet-gold/40 ring-1 ring-velvet-gold/20" : "border-white/5 hover:border-white/20"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-6 flex flex-col gap-6">
          <GlassCard className="p-8 border border-white/5 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                  {companion.displayName}
                  {companion.isVerified && <CheckCircle size={22} className="text-velvet-gold" />}
                </h1>

                <div className="flex items-center gap-1.5 bg-velvet-gold/10 px-3 py-1 rounded-full text-velvet-gold font-semibold text-xs border border-velvet-gold/20">
                  <Star size={13} fill="currentColor" />
                  <span>{companion.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-velvet-gold" />
                  {companion.distanceKm} km away
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-velvet-gold" />
                  {companion.lastActive}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 text-center">
              <div>
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">Trust</span>
                <span className="text-lg font-bold font-display text-white mt-1 block">{companion.trustScore}%</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">Response</span>
                <span className="text-lg font-bold font-display text-white mt-1 block">{companion.responseRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">Status</span>
                <span className={`text-xs font-bold uppercase tracking-wider mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${
                  companion.availabilityStatus === "available" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/5 text-white/30 border border-white/10"
                }`}>
                  {companion.availabilityStatus}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">About</h3>
              <p className="text-sm text-white/60 leading-relaxed">{companion.bio}</p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {companion.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/50 font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {companion.languages.map((lang, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/50">
                    <Globe size={10} />
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Hourly Rate</span>
                <span className="text-2xl font-black text-white font-display mt-1 block">${companion.pricingHourly} <span className="text-xs text-white/40 font-semibold">USD</span></span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Daily Rate</span>
                <span className="text-lg font-bold text-velvet-gold font-display mt-1 block">${companion.pricingDaily} <span className="text-[10px] text-white/40">USD</span></span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const cid = createConversation(companion.id);
                  router.push(`/chat?conv=${cid}`);
                }}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/5 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <MessageSquare size={16} className="text-velvet-gold" />
                <span>Message</span>
              </button>

              <Link
                href={`/bookings?companion=${companion.id}`}
                className="flex-1 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-all hover:scale-[1.02]"
              >
                <Calendar size={16} />
                <span>Book</span>
              </Link>

              <button className="p-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-velvet-gold rounded-2xl border border-white/5 transition-all">
                <Heart size={16} />
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Award size={16} className="text-velvet-gold" />
              Achievements
            </h3>
            <div className="flex flex-wrap gap-3">
              {companion.trustScore >= 95 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-velvet-gold/10 border border-velvet-gold/20 text-xs text-velvet-gold">
                  <Award size={12} /> Elite Member
                </span>
              )}
              {companion.responseRate === 100 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                  <Sparkles size={12} /> Quick Responder
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                <Star size={12} /> {companion.reviewsCount} Reviews
              </span>
            </div>
          </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {safetyAction && (
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
              className="w-full max-w-md p-6 glass-panel-glow border-white/10"
            >
              <div className="flex items-center gap-3 text-rose-400 font-bold text-lg mb-4">
                <ShieldAlert size={20} />
                <span>{safetyAction === "report" ? "Report Profile" : "Block Member"}</span>
              </div>

              {actionDone ? (
                <div className="text-center py-6 flex flex-col items-center">
                  <CheckCircle size={40} className="text-green-400 mb-2" />
                  <p className="text-sm font-semibold text-white">Action Completed</p>
                  <p className="text-xs text-white/40 mt-1">Our team will review this within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSafetySubmit} className="flex flex-col gap-4">
                  {safetyAction === "report" ? (
                    <>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Tell us what happened. All reports are confidential.
                      </p>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe the issue..."
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-rose-500 focus:outline-none transition-all resize-none"
                      />
                    </>
                  ) : (
                    <p className="text-xs text-white/60 leading-relaxed">
                      Are you sure you want to block {companion.displayName}? You will no longer see them in your feed.
                    </p>
                  )}

                  <div className="flex gap-3 justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setSafetyAction(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/40 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs"
                    >
                      Confirm
                    </button>
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
