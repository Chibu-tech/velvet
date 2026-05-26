"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass, Map, Grid, SlidersHorizontal, Heart, X, Sparkles,
  CheckCircle, MessageSquare, Star, MapPin, ShieldCheck,
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
    setSwipeIndex(prev => prev < companions.length - 1 ? prev + 1 : 0);
  };
  const handleSwipeRight = () => {
    if (activeHost && (activeHost.isVerified || Math.random() > 0.3)) setMatchUser(activeHost);
    setSwipeIndex(prev => prev < companions.length - 1 ? prev + 1 : 0);
  };

  const { x, y, rotate, swipeDirection, handleDrag, handleDragEnd } = useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div className="flex-1 flex flex-col p-5 md:p-8 bg-[#0E0E12] min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 z-10">
        <div>
          <h1 className="text-2xl font-display font-medium text-[#F0EDE6]">Discover</h1>
          <p className="text-[10px] text-[#7A7870] mt-1 uppercase tracking-[0.12em]">{filteredCompanions.length} members nearby</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`p-3.5 rounded-[100px] border transition-all ${showFilters ? "bg-[#22222E] border-[#80465E] text-[#80465E]" : "border-white/[0.07] bg-transparent text-[#7A7870] hover:text-[#F0EDE6]"}`}>
            <SlidersHorizontal size={16} strokeWidth={1.5} />
          </button>
          <div className="flex bg-[#1A1A22] border border-white/[0.07] p-1 rounded-[100px] w-full sm:w-auto">
            {(["swipe", "grid", "map"] as const).map((mode) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === mode ? "bg-[#80465E] text-[#0E0E12]" : "text-[#7A7870] hover:text-[#F0EDE6]"
                }`}>
                {mode === "swipe" ? <><Compass size={13} strokeWidth={1.5} /><span>Swipe</span></>
                  : mode === "grid" ? <><Grid size={13} strokeWidth={1.5} /><span>Grid</span></>
                  : <><Map size={13} strokeWidth={1.5} /><span>Map</span></>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="w-full z-20 mb-8">
            <GlassCard className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">
                  <span>Distance</span><span className="text-[#80465E]">{radius} km</span>
                </div>
                <input type="range" min="5" max="100" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/[0.07] rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="online-chk" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-white/[0.1] bg-[#22222E] cursor-pointer accent-[#80465E]" />
                <label htmlFor="online-chk" className="text-sm text-[#7A7870] cursor-pointer select-none">Online Now</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="verified-chk" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-white/[0.1] bg-[#22222E] cursor-pointer accent-[#80465E]" />
                <label htmlFor="verified-chk" className="text-sm text-[#7A7870] cursor-pointer select-none">Verified Only</label>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#22222E] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] px-3 py-2 text-sm focus:border-[#80465E] focus:outline-none">
                  <option value="All" className="bg-[#0E0E12]">All</option>
                  <option value="Nightlife Hosting" className="bg-[#0E0E12]">Nightlife</option>
                  <option value="Social Meetups" className="bg-[#0E0E12]">Social Meetups</option>
                  <option value="Creator Bookings" className="bg-[#0E0E12]">Creator Bookings</option>
                  <option value="Corporate Networking" className="bg-[#0E0E12]">Corporate</option>
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
                <motion.div key={activeHost.id} style={{ x, y, rotate }}
                  drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  onDrag={handleDrag} onDragEnd={handleDragEnd}
                  className="absolute w-full h-[580px] bg-[#1A1A22] border border-white/[0.07] rounded-[18px] overflow-hidden cursor-grab active:cursor-grabbing flex flex-col group">
                  <div className="relative w-full flex-1">
                    <img src={activeHost.avatarUrl} alt={activeHost.displayName} className="w-full h-full object-cover pointer-events-none select-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,18,0.7)] to-transparent pointer-events-none" />
                    <div className="absolute top-5 left-5 flex gap-2">
                      <span className="px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] font-medium tracking-[0.12em] uppercase text-[#7A7870] border border-[rgba(128,70,94,0.3)] flex items-center gap-1">
                        <MapPin size={10} strokeWidth={1.5} />{activeHost.distanceKm} km
                      </span>
                      {activeHost.isVerified && (
                        <span className="px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] font-medium tracking-[0.12em] uppercase text-[#80465E] border border-[rgba(128,70,94,0.3)] flex items-center gap-1">
                          <ShieldCheck size={10} strokeWidth={1.5} />Verified
                        </span>
                      )}
                    </div>
                    <div className="absolute top-5 right-5">
                      <span className="px-3.5 py-1.5 bg-[#1A1A22] rounded-[100px] text-xs font-medium text-[#F0EDE6] border border-white/[0.07]">
                        ${activeHost.pricingHourly}/hr
                      </span>
                    </div>
                    {swipeDirection === "right" && (
                      <div className="absolute top-1/2 left-10 -translate-y-1/2 border-2 border-[#80465E] text-[#80465E] font-display font-medium text-4xl uppercase px-4 py-2 rounded-[18px] rotate-[-15deg] tracking-widest bg-[#0E0E12]/80">
                        Connect
                      </div>
                    )}
                    {swipeDirection === "left" && (
                      <div className="absolute top-1/2 right-10 -translate-y-1/2 border-2 border-white/10 text-white/40 font-display font-medium text-4xl uppercase px-4 py-2 rounded-[18px] rotate-[15deg] tracking-widest bg-[#0E0E12]/80">
                        Skip
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-display font-medium text-[#F0EDE6] flex items-center gap-2">
                          {activeHost.displayName}
                          {activeHost.isVerified && <CheckCircle size={18} strokeWidth={1.5} className="text-[#80465E]" />}
                        </h2>
                        <div className="flex gap-3 items-center mt-1">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-[10px] text-[#7A7870] uppercase tracking-[0.12em]">{activeHost.lastActive}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={11} strokeWidth={1.5} className="text-[#80465E]" />
                            <span className="text-[10px] text-[#7A7870]">{activeHost.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {activeHost.categories.slice(0, 2).map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]">{c}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#7A7870] leading-relaxed line-clamp-2">{activeHost.bio}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#7A7870] uppercase tracking-[0.12em]">
                      <span>{activeHost.trustScore}% Trust</span>
                      <span className="w-1 h-1 rounded-full bg-white/[0.07]" />
                      <span>{activeHost.responseRate}% Response</span>
                    </div>
                    <div className="flex justify-around items-center mt-2 border-t border-white/[0.07] pt-4">
                      <button onClick={handleSwipeLeft}
                        className="min-w-[48px] min-h-[48px] rounded-full border border-white/[0.2] hover:border-white/30 transition-all flex items-center justify-center text-[#7A7870] hover:text-[#F0EDE6]">
                        <X size={18} strokeWidth={1.5} />
                      </button>
                      <Link href={`/profile/${activeHost.id}`}
                        className="px-6 py-2.5 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium hover:bg-white/[0.04] transition-all">
                        View profile
                      </Link>
                      <button onClick={handleSwipeRight}
                        className="min-w-[48px] min-h-[48px] rounded-full bg-[#80465E] text-[#0E0E12] transition-all flex items-center justify-center active:scale-[0.97]">
                        <Heart size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center p-6">
                  <Compass size={48} strokeWidth={1.5} className="text-[#7A7870] mx-auto mb-4" />
                  <h3 className="text-xl font-display font-medium text-[#F0EDE6]">No More Profiles</h3>
                  <p className="text-xs text-[#7A7870] mt-2">Adjust filters to discover more members.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {viewMode === "grid" && (
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 self-start">
            {filteredCompanions.map((host) => (
              <GlassCard key={host.id} className="overflow-hidden flex flex-col group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={host.avatarUrl} alt={host.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,18,0.7)] to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#80465E] border border-[rgba(128,70,94,0.3)]">{host.distanceKm} km</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-[#1A1A22] rounded-[100px] text-[10px] font-medium text-[#F0EDE6] border border-white/[0.07]">${host.pricingHourly}/hr</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-base font-display font-medium text-[#F0EDE6] flex items-center gap-1">{host.displayName}{host.isVerified && <CheckCircle size={13} strokeWidth={1.5} className="text-[#80465E]" />}</h3>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-[11px] text-[#7A7870] leading-relaxed line-clamp-2">{host.bio}</p>
                  <div className="flex items-center gap-2">
                    <Star size={10} strokeWidth={1.5} className="text-[#80465E]" />
                    <span className="text-[10px] text-[#7A7870]">{host.rating}</span>
                    <span className="text-[10px] text-[#7A7870]">•</span>
                    <span className="text-[10px] text-[#7A7870]">{host.trustScore}% trust</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/profile/${host.id}`} className="flex-1 py-2 text-center border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium hover:bg-white/[0.04] transition-all">View profile</Link>
                    <button onClick={async () => { const cid = await createConversation(host.id); window.location.href = `/chat?conv=${cid}`; }}
                      className="min-w-[48px] min-h-[48px] bg-[#80465E] text-[#0E0E12] rounded-[100px] flex items-center justify-center transition-all active:scale-[0.97]">
                      <MessageSquare size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {viewMode === "map" && (
          <div className="w-full max-w-6xl h-[600px] border border-white/[0.07] rounded-[18px] overflow-hidden relative self-start flex items-center justify-center bg-[#0E0E12]">
            <div className="absolute w-[500px] h-[500px] border border-white/[0.07] rounded-full" />
            <div className="absolute w-[300px] h-[300px] border border-white/[0.07] rounded-full" />
            <div className="text-center z-10 max-w-md p-6">
              <MapPin size={32} strokeWidth={1.5} className="text-[#80465E] mx-auto mb-3" />
              <h3 className="text-lg font-display font-medium text-[#F0EDE6]">Geo Discovery</h3>
              <p className="text-xs text-[#7A7870] mt-2">Real-time locations of premium members near you.</p>
            </div>
            {filteredCompanions.map((host, idx) => (
              <motion.div key={host.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06, duration: 0.36, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute pointer-events-auto cursor-pointer"
                style={{ top: `${30 + idx * 15}%`, left: `${25 + idx * 18}%` }}>
                <Link href={`/profile/${host.id}`} className="group relative flex flex-col items-center">
                  <div className="w-[52px] h-[52px] rounded-full border-2 border-[#80465E] overflow-hidden group-hover:scale-110 transition-all">
                    <img src={host.avatarUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-6 bg-[#1A1A22] border border-white/[0.07] px-2 py-0.5 rounded-[12px] text-[9px] text-[#F0EDE6] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {host.displayName}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {matchUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[rgba(14,14,18,0.95)] backdrop-blur-lg">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.36, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-md p-8 bg-[#1A1A22] rounded-[24px] border border-[rgba(128,70,94,0.2)] text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] text-[#80465E] border border-[rgba(128,70,94,0.3)] font-medium mb-6">
                <Sparkles size={12} strokeWidth={1.5} />Connection Made
              </div>
              <h2 className="text-3xl font-display font-medium text-[#F0EDE6] mb-6">You Connected</h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-[52px] h-[52px] rounded-full border-2 border-white/[0.2] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-[#80465E] font-display text-xl">✦</div>
                <div className="w-[52px] h-[52px] rounded-full border-2 border-[#80465E] overflow-hidden">
                  <img src={matchUser.avatarUrl} alt={matchUser.displayName} className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-sm text-[#7A7870] mb-8 max-w-sm leading-relaxed">You and {matchUser.displayName} are both verified. Connect and arrange your experience.</p>
              <div className="w-full flex flex-col gap-3">
                <button onClick={() => { const cid = createConversation(matchUser.id); setMatchUser(null); window.location.href = `/chat?conv=${cid}`; }}
                  className="w-full py-3.5 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">
                  <MessageSquare size={16} strokeWidth={1.5} className="inline mr-2" />Send message
                </button>
                <button onClick={() => setMatchUser(null)}
                  className="w-full py-3 border border-white/[0.2] text-[#7A7870] hover:text-[#F0EDE6] rounded-[100px] text-sm transition-all active:scale-[0.97]">
                  Keep browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
