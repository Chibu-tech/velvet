"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon, Clock, DollarSign, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Bookings() {
  const searchParams = useSearchParams();
  const companionParamId = searchParams.get("companion");

  const companions = useVelvetStore((state) => state.companions);
  const bookings = useVelvetStore((state) => state.bookings);
  const requestBooking = useVelvetStore((state) => state.requestBooking);
  const updateBookingStatus = useVelvetStore((state) => state.updateBookingStatus);

  const [step, setStep] = useState(1);
  const [selectedCompId, setSelectedCompId] = useState(companionParamId || "");
  const [date, setDate] = useState("2026-05-23");
  const [time, setTime] = useState("19:00");
  const [hours, setHours] = useState(4);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => { if (companionParamId) setSelectedCompId(companionParamId); }, [companionParamId]);

  const activeCompanion = companions.find(c => c.id === selectedCompId);
  const calculatedTotal = activeCompanion ? activeCompanion.pricingHourly * hours : 0;

  const handleNextStep = () => {
    if (step === 1 && selectedCompId) setStep(2);
    else if (step === 2 && date && time) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompId || !date || !time) return;
    requestBooking(selectedCompId, new Date(`${date}T${time}:00`).toISOString(), hours, specialRequests);
    setSubmitSuccess(true); setSpecialRequests(""); setStep(4);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-green-400 border border-green-500/20"><CheckCircle2 size={12} strokeWidth={1.5} />Approved</span>;
      case "declined": return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-red-400 border border-red-500/20"><XCircle size={12} strokeWidth={1.5} />Declined</span>;
      case "cancelled": return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-[#7A7870] border border-white/[0.07]">Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#22222E] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium text-yellow-400 border border-yellow-500/20"><AlertCircle size={12} strokeWidth={1.5} />Pending</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E12] min-h-[calc(100vh-4rem)] p-5 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto z-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-display font-medium text-[#F0EDE6]">Bookings</h1>
          <p className="text-[10px] text-[#7A7870] mt-1 uppercase tracking-[0.12em]">Schedule premium experiences with verified members.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <GlassCard className="p-6 flex flex-col gap-5">
              <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Request Booking</h2>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex-1 h-1 rounded-full transition-all ${step >= s ? "bg-[#80465E]" : "bg-white/[0.07]"}`} />
                ))}
              </div>
              {submitSuccess && (
                <div className="p-3 rounded-[18px] bg-[#22222E] border border-green-500/20 text-green-400 text-xs font-medium text-center">Booking submitted!</div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Select Member</label>
                    <select value={selectedCompId} onChange={(e) => setSelectedCompId(e.target.value)}
                      className="bg-[#22222E] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] px-4 py-3 text-sm focus:border-[#80465E] focus:outline-none" required>
                      <option value="" className="bg-[#0E0E12]">Choose a member...</option>
                      {companions.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#0E0E12]">{c.displayName} (${c.pricingHourly}/hr)</option>
                      ))}
                    </select>
                  </div>
                  {activeCompanion && (
                    <div className="flex items-center gap-3 p-3 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                      <img src={activeCompanion.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#F0EDE6]">{activeCompanion.displayName}</p>
                        <p className="text-[10px] text-[#7A7870] uppercase tracking-[0.12em]">{activeCompanion.trustScore}% Trust • {activeCompanion.responseRate}% Response</p>
                      </div>
                      {activeCompanion.isVerified && <ShieldCheck size={16} strokeWidth={1.5} className="text-[#80465E]" />}
                    </div>
                  )}
                  <button onClick={handleNextStep} disabled={!selectedCompId}
                    className="w-full py-3.5 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97] disabled:opacity-40">
                    Continue <ChevronRight size={14} strokeWidth={1.5} className="inline" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Date</label>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className="bg-[#22222E] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] px-4 py-2.5 text-sm focus:border-[#80465E] focus:outline-none" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Time</label>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                        className="bg-[#22222E] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] px-4 py-2.5 text-sm focus:border-[#80465E] focus:outline-none" required />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Duration ({hours}h)</label>
                    <input type="range" min="1" max="12" value={hours} onChange={(e) => setHours(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/[0.07] rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">Back</button>
                    <button onClick={handleNextStep}
                      className="flex-[2] py-3.5 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">Continue <ChevronRight size={14} strokeWidth={1.5} className="inline" /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Notes & Preferences</label>
                    <textarea rows={3} placeholder="Share any preferences..." value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-xs placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none resize-none" />
                  </div>
                  {activeCompanion && (
                    <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07] flex flex-col gap-2">
                      <div className="flex justify-between text-xs"><span className="text-[#7A7870]">Rate</span><span className="text-[#F0EDE6]">${activeCompanion.pricingHourly}/hr</span></div>
                      <div className="flex justify-between text-xs"><span className="text-[#7A7870]">Duration</span><span className="text-[#F0EDE6]">{hours}h</span></div>
                      <div className="border-t border-white/[0.07] pt-2 flex justify-between text-sm font-medium"><span className="text-[#7A7870]">Total</span><span className="text-[#80465E]">${calculatedTotal} USD</span></div>
                    </div>
                  )}
                  <div className="p-3 rounded-[18px] bg-[#22222E] border border-[rgba(128,70,94,0.2)] flex items-start gap-2">
                    <ShieldCheck size={14} strokeWidth={1.5} className="text-[#80465E] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#7A7870] leading-relaxed">Your booking is protected by our verification & safety system.</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(2)}
                      className="flex-1 py-3 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">Back</button>
                    <button type="submit"
                      className="flex-[2] py-3.5 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">Confirm booking</button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="text-center py-6 flex flex-col items-center gap-4">
                  <CheckCircle2 size={48} strokeWidth={1.5} className="text-[#80465E]" />
                  <h3 className="text-lg font-display font-medium text-[#F0EDE6]">Booking Request Sent</h3>
                  <p className="text-xs text-[#7A7870]">You'll be notified when confirmed.</p>
                  <button onClick={() => { setStep(1); setSubmitSuccess(false); }}
                    className="px-6 py-3 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-xs tracking-[0.04em] transition-all active:scale-[0.97]">New Booking</button>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Booking History</h2>
            {bookings.length === 0 ? (
              <GlassCard className="p-8 text-center"><CalendarIcon size={32} strokeWidth={1.5} className="text-[#7A7870] mx-auto mb-2" /><p className="text-xs text-[#7A7870]">No bookings yet.</p></GlassCard>
            ) : (
              bookings.map((booking) => {
                const companion = companions.find(c => c.id === booking.companionId);
                if (!companion) return null;
                return (
                  <GlassCard key={booking.id} className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-white/[0.07] shrink-0">
                        <img src={companion.avatarUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#F0EDE6] flex items-center gap-1">{companion.displayName}{companion.isVerified && <CheckCircle2 size={13} strokeWidth={1.5} className="text-[#80465E]" />}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#7A7870] mt-0.5 uppercase tracking-[0.12em]">
                          <span className="flex items-center gap-1"><CalendarIcon size={11} strokeWidth={1.5} />{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock size={11} strokeWidth={1.5} />{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({booking.durationHours}h)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.07]">
                      <div className="text-xs font-medium text-[#F0EDE6] flex items-center"><DollarSign size={13} strokeWidth={1.5} />{booking.totalPrice} USD</div>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        {booking.status === "pending" && (
                          <button onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="min-w-[48px] px-3 py-1 border border-white/[0.2] text-[#7A7870] hover:text-rose-400 rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all">Cancel</button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
