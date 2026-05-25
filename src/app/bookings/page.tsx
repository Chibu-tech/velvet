"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    if (companionParamId) setSelectedCompId(companionParamId);
  }, [companionParamId]);

  const activeCompanion = companions.find(c => c.id === selectedCompId);
  const calculatedTotal = activeCompanion ? activeCompanion.pricingHourly * hours : 0;

  const handleNextStep = () => {
    if (step === 1 && selectedCompId) setStep(2);
    else if (step === 2 && date && time) setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompId || !date || !time) return;
    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
    requestBooking(selectedCompId, scheduledAt, hours, specialRequests);
    setSubmitSuccess(true);
    setSpecialRequests("");
    setStep(4);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20"><CheckCircle2 size={12} />Approved</span>;
      case "declined":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20"><XCircle size={12} />Declined</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-white/40 text-xs font-semibold border border-white/5">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-semibold border border-yellow-500/20"><AlertCircle size={12} />Pending</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-velvet-black min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto z-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Bookings</h1>
          <p className="text-xs text-white/40 mt-1">Schedule premium experiences with verified members.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <GlassCard className="p-6 border border-white/5 flex flex-col gap-5">
              <h2 className="text-lg font-bold font-display text-white">Request Booking</h2>

              <div className="flex gap-2 mb-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex-1 h-1 rounded-full transition-all ${step >= s ? "bg-velvet-gold" : "bg-white/10"}`} />
                ))}
              </div>

              {submitSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-semibold text-center">
                  Booking submitted! You'll be notified when confirmed.
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Select Member</label>
                    <select
                      value={selectedCompId}
                      onChange={(e) => setSelectedCompId(e.target.value)}
                      className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-velvet-gold/40 focus:outline-none"
                      required
                    >
                      <option value="" className="bg-velvet-black">Choose a member...</option>
                      {companions.map((c) => (
                        <option key={c.id} value={c.id} className="bg-velvet-black">{c.displayName} (${c.pricingHourly}/hr)</option>
                      ))}
                    </select>
                  </div>

                  {activeCompanion && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <img src={activeCompanion.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{activeCompanion.displayName}</p>
                        <p className="text-[10px] text-white/40">{activeCompanion.trustScore}% Trust Score • {activeCompanion.responseRate}% Response Rate</p>
                      </div>
                      {activeCompanion.isVerified && <ShieldCheck size={16} className="text-velvet-gold" />}
                    </div>
                  )}

                  <button onClick={handleNextStep} disabled={!selectedCompId} className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-white/10 transition-all">
                    <span>Continue</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-velvet-gold/40 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Time</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-velvet-gold/40 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Duration ({hours} hours)</label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                      <span>1 hr</span>
                      <span>12 hrs</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl border border-white/5 text-xs font-semibold transition-all">
                      Back
                    </button>
                    <button onClick={handleNextStep} className="flex-[2] py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-white/10 transition-all">
                      <span>Continue</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Notes & Preferences</label>
                    <textarea
                      rows={3}
                      placeholder="Share any preferences, dress code, or special arrangements..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-xs focus:border-velvet-gold/40 focus:outline-none resize-none"
                    />
                  </div>

                  {activeCompanion && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                      <div className="flex justify-between text-xs"><span className="text-white/40">Hourly Rate</span><span className="text-white">${activeCompanion.pricingHourly}/hr</span></div>
                      <div className="flex justify-between text-xs"><span className="text-white/40">Duration</span><span className="text-white">{hours} hours</span></div>
                      <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold"><span className="text-white/60">Total</span><span className="text-velvet-gold">${calculatedTotal} USD</span></div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-velvet-gold/[0.03] border border-velvet-gold/10 flex items-start gap-2">
                    <ShieldCheck size={14} className="text-velvet-gold shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/40 leading-relaxed">Your booking is protected by our verification & safety system.</p>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl border border-white/5 text-xs font-semibold">Back</button>
                    <button type="submit" className="flex-[2] py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm border border-white/10 transition-all">Confirm Booking</button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="text-center py-6 flex flex-col items-center gap-4">
                  <CheckCircle2 size={48} className="text-velvet-gold" />
                  <h3 className="text-lg font-bold text-white">Booking Request Sent</h3>
                  <p className="text-xs text-white/40">You'll receive a notification once confirmed.</p>
                  <button onClick={() => { setStep(1); setSubmitSuccess(false); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 text-xs font-semibold">
                    New Booking
                  </button>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-lg font-bold font-display text-white">Booking History</h2>

            {bookings.length === 0 ? (
              <GlassCard className="p-8 border border-white/5 text-center">
                <CalendarIcon size={32} className="text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/40">No bookings yet.</p>
              </GlassCard>
            ) : (
              bookings.map((booking) => {
                const companion = companions.find(c => c.id === booking.companionId);
                if (!companion) return null;
                return (
                  <GlassCard key={booking.id} className="p-5 border border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img src={companion.avatarUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1">
                          {companion.displayName}
                          {companion.isVerified && <CheckCircle2 size={13} className="text-velvet-gold" />}
                        </h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/40 mt-0.5">
                          <span className="flex items-center gap-1"><CalendarIcon size={11} />{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({booking.durationHours}h)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-xs font-bold text-white flex items-center"><DollarSign size={13} />{booking.totalPrice} USD</div>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        {booking.status === "pending" && (
                          <button onClick={() => updateBookingStatus(booking.id, "cancelled")} className="p-1 bg-white/5 hover:bg-rose-500/10 text-white/40 hover:text-rose-400 rounded-md border border-white/5 text-[10px] font-semibold">
                            Cancel
                          </button>
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
