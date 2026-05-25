"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Map,
  Grid,
  SlidersHorizontal,
  Heart,
  X,
  Sparkles,
  CheckCircle,
  MessageSquare,
  Star,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSwipe } from "@/hooks/useSwipe";

export default function Discover() {
  const companions = useVelvetStore((state) => state.companions);
  const createConversation = useVelvetStore((state) => state.createConversation);

  const [viewMode, setViewMode] = useState<"swipe" | "grid" | "map">("swipe");
  const [showFilters, setShowFilters] = useState(false);
  const [radius, setRadius] = useState(25);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [swipeIndex, setSwipeIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<typeof companions[0] | null>(null);

  const activeHost = companions[swipeIndex];

  const filteredCompanions = companions.filter((comp) => {
    if (onlineOnly && !comp.onlineStatus) return false;
    if (verifiedOnly && !comp.isVerified) return false;
    if (categoryFilter !== "All" && !comp.categories.includes(categoryFilter)) return false;
    return comp.distanceKm <= radius;
  });

  const handleSwipeLeft = () => {
    if (swipeIndex < companions.length - 1) {
      setSwipeIndex((prev) => prev + 1);
    } else {
      setSwipeIndex(0);
    }
  };

  const handleSwipeRight = () => {
    if (activeHost && (activeHost.isVerified || Math.random() > 0.3)) {
      setMatchUser(activeHost);
    }
    if (swipeIndex < companions.length - 1) {
      setSwipeIndex((prev) => prev + 1);
    } else {
      setSwipeIndex(0);
    }
  };

  const { x, y, rotate, opacity, swipeDirection, handleDrag, handleDragEnd } = useSwipe(
    handleSwipeLeft,
    handleSwipeRight
  );

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 bg-velvet-black min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 z-10">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            Discover
            <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 rounded-full font-semibold">
              {filteredCompanions.length} nearby
            </span>
          </h1>
          <p className="text-xs text-white/40 mt-1">Verified members for premium social experiences.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3.5 rounded-xl border transition-all ${
              showFilters ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-white/40 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>

          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl w-full sm:w-auto">
            {(["swipe", "grid", "map"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === mode
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {mode === "swipe" ? (
                  <><Compass size={13} /><span>Swipe</span></>
                ) : mode === "grid" ? (
                  <><Grid size={13} /><span>Grid</span></>
                ) : (
                  <><Map size={13} /><span>Map</span></>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full z-20 mb-6"
          >
            <GlassCard className="p-6 border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-white/40 uppercase tracking-wide">
                  <span>Distance</span>
                  <span className="text-velvet-gold">{radius} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="online-chk"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 cursor-pointer accent-velvet-gold"
                />
                <label htmlFor="online-chk" className="text-sm font-semibold text-white/60 cursor-pointer select-none">
                  Online Now
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="verified-chk"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 cursor-pointer accent-velvet-gold"
                />
                <label htmlFor="verified-chk" className="text-sm font-semibold text-white/60 cursor-pointer select-none">
                  Verified Only
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:border-velvet-gold/40 focus:outline-none"
                >
                  <option value="All" className="bg-velvet-black">All</option>
                  <option value="Nightlife Hosting" className="bg-velvet-black">Nightlife</option>
                  <option value="Social Meetups" className="bg-velvet-black">Social Meetups</option>
                  <option value="Creator Bookings" className="bg-velvet-black">Creator Bookings</option>
                  <option value="Corporate Networking" className="bg-velvet-black">Corporate</option>
                </select>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex justify-center items-center z-10">
        {viewMode === "swipe" && (
          <div className="swipe-card-container">
            <AnimatePresence mode="popLayout">
              {activeHost ? (
                <motion.div
                  key={activeHost.id}
                  style={{ x, y, rotate, opacity }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  className="absolute w-full h-[580px] bg-velvet-charcoal border border-white/10 rounded-[30px] overflow-hidden cursor-grab active:cursor-grabbing shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col group"
                >
                  <div className="relative w-full flex-1">
                    <img
                      src={activeHost.avatarUrl}
                      alt={activeHost.displayName}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-velvet-charcoal via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-5 left-5 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-semibold tracking-wider text-white/60 border border-white/10 flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{activeHost.distanceKm} km</span>
                      </span>
                      {activeHost.isVerified && (
                        <span className="px-2 py-1 rounded-full bg-velvet-gold/10 backdrop-blur-md text-[10px] font-semibold text-velvet-gold border border-velvet-gold/20 flex items-center gap-1">
                          <ShieldCheck size={10} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-5 right-5">
                      <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                        ${activeHost.pricingHourly}/hr
                      </span>
                    </div>

                    {swipeDirection === "right" && (
                      <div className="absolute top-1/2 left-10 -translate-y-1/2 border-4 border-white/30 text-white font-display font-black text-4xl uppercase px-4 py-2 rounded-xl rotate-[-15deg] tracking-widest bg-black/60">
                        CONNECT
                      </div>
                    )}
                    {swipeDirection === "left" && (
                      <div className="absolute top-1/2 right-10 -translate-y-1/2 border-4 border-white/10 text-white/40 font-display font-black text-4xl uppercase px-4 py-2 rounded-xl rotate-[15deg] tracking-widest bg-black/60">
                        SKIP
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                          {activeHost.displayName}
                          {activeHost.isVerified && <CheckCircle size={18} className="text-velvet-gold" />}
                        </h2>
                        <div className="flex gap-3 items-center mt-1">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-[11px] text-white/40 font-semibold">{activeHost.lastActive}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={11} className="text-velvet-gold" />
                            <span className="text-[11px] text-white/60 font-semibold">{activeHost.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        {activeHost.categories.slice(0, 2).map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-semibold text-white/40">{c}</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                      {activeHost.bio}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-white/30">
                      <span>{activeHost.trustScore}% Trust Score</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{activeHost.responseRate}% Response Rate</span>
                    </div>

                    <div className="flex justify-around items-center mt-3 border-t border-white/5 pt-4">
                      <button
                        onClick={handleSwipeLeft}
                        className="w-12 h-12 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center text-white/40 hover:text-white"
                      >
                        <X size={18} />
                      </button>

                      <Link
                        href={`/profile/${activeHost.id}`}
                        className="px-6 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-all"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={handleSwipeRight}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 text-white transition-all flex items-center justify-center hover:scale-105 border border-white/10"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center p-6">
                  <Compass size={48} className="text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">No More Profiles</h3>
                  <p className="text-sm text-white/40 mt-2">Adjust filters to discover more members.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {viewMode === "grid" && (
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 self-start">
            {filteredCompanions.map((host) => (
              <GlassCard key={host.id} className="overflow-hidden border border-white/5 flex flex-col group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={host.avatarUrl} alt={host.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-semibold text-white/60 border border-white/10">
                      {host.distanceKm} km
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white">
                      ${host.pricingHourly}/hr
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-1">
                      {host.displayName}
                      {host.isVerified && <CheckCircle size={13} className="text-velvet-gold" />}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{host.bio}</p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-velvet-gold" />
                      <span className="text-[10px] text-white/60">{host.rating}</span>
                    </div>
                    <span className="text-[10px] text-white/30">•</span>
                    <span className="text-[10px] text-white/30">{host.trustScore}% trust</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/profile/${host.id}`}
                      className="flex-1 py-2 text-center bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg text-[11px] font-semibold text-white/60"
                    >
                      View Profile
                    </Link>

                    <button
                      onClick={() => {
                        const cid = createConversation(host.id);
                        window.location.href = `/chat?conv=${cid}`;
                      }}
                      className="p-2 bg-white/10 hover:bg-white/15 rounded-lg text-white"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {viewMode === "map" && (
          <div className="w-full max-w-6xl h-[600px] border border-white/10 rounded-3xl overflow-hidden relative self-start glass-panel-glow">
            <div className="absolute inset-0 bg-velvet-black flex items-center justify-center">
              <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full" />
              <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full" />
              <div className="absolute w-[700px] h-[700px] border border-white/5 rounded-full" />

              <div className="text-center z-10 max-w-md p-6">
                <MapPin size={32} className="text-velvet-gold mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Geo Discovery</h3>
                <p className="text-xs text-white/40 mt-2 leading-relaxed">
                  Real-time locations of premium members within your area.
                </p>
              </div>

              {filteredCompanions.map((host, idx) => (
                <motion.div
                  key={host.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.15 }}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{ top: `${30 + idx * 15}%`, left: `${25 + idx * 18}%` }}
                >
                  <Link href={`/profile/${host.id}`} className="group relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-velvet-gold/40 overflow-hidden shadow-lg group-hover:scale-110 transition-all">
                      <img src={host.avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-6 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[9px] text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {host.displayName}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {matchUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-velvet-gold/[0.03] rounded-full blur-[140px]" />

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md p-8 glass-panel-glow border-velvet-gold/20 text-center flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-velvet-gold/10 border border-velvet-gold/20 rounded-full text-xs text-velvet-gold font-semibold mb-6">
                <Sparkles size={12} />
                <span>Connection Made!</span>
              </div>

              <h2 className="text-3xl font-display font-black text-white tracking-wide mb-6">You Connected</h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" alt="" className="w-full h-full object-cover" />
                </div>

                <div className="text-velvet-gold font-display font-black text-xl">✦</div>

                <div className="w-20 h-20 rounded-full border-2 border-velvet-gold/40 overflow-hidden">
                  <img src={matchUser.avatarUrl} alt={matchUser.displayName} className="w-full h-full object-cover" />
                </div>
              </div>

              <p className="text-sm text-white/60 mb-8 max-w-sm leading-relaxed">
                You and {matchUser.displayName} are both verified. Connect and arrange your experience.
              </p>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => {
                    const cid = createConversation(matchUser.id);
                    setMatchUser(null);
                    window.location.href = `/chat?conv=${cid}`;
                  }}
                  className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-white/10"
                >
                  <MessageSquare size={16} />
                  <span>Send Message</span>
                </button>

                <button
                  onClick={() => setMatchUser(null)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl border border-white/5 text-sm transition-all"
                >
                  Keep Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
