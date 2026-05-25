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
  ChevronRight
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

  // Form States
  const [selectedCompId, setSelectedCompId] = useState(companionParamId || "");
  const [date, setDate] = useState("2026-05-23");
  const [time, setTime] = useState("19:00");
  const [hours, setHours] = useState(4);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (companionParamId) {
      setSelectedCompId(companionParamId);
    }
  }, [companionParamId]);

  const activeCompanion = companions.find(c => c.id === selectedCompId);
  const calculatedTotal = activeCompanion ? activeCompanion.pricingHourly * hours : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompId || !date || !time) return;

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
    requestBooking(selectedCompId, scheduledAt, hours, specialRequests);
    
    setSubmitSuccess(true);
    setSpecialRequests("");
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
            <CheckCircle2 size={12} />
            <span>Approved</span>
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
            <XCircle size={12} />
            <span>Declined</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs font-semibold border border-white/5">
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-semibold border border-yellow-500/20 animate-pulse">
            <AlertCircle size={12} />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#030206] min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-900/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto z-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Companionship Bookings</h1>
          <p className="text-xs text-gray-400 mt-1">Submit networking dates, view active schedules, and complete platform invoices.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Request Form */}
          <div className="lg:col-span-5">
            <GlassCard className="p-6 border border-white/5 flex flex-col gap-5 relative">
              <h2 className="text-lg font-bold font-display text-white">Book Social Companion</h2>

              {submitSuccess && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-semibold text-center animate-pulse">
                  Booking submitted! Companions verify parameters in real time. (Check Notifications!)
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Select Host */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Select Vetted Host</label>
                  <select
                    value={selectedCompId}
                    onChange={(e) => setSelectedCompId(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="" className="bg-[#08080c]">Choose a Companion...</option>
                    {companions.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#08080c]">
                        {c.displayName} (${c.pricingHourly}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Select Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Start Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Duration Hours */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Duration ({hours} hours)</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Special Requests Details */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Special Itinerary Details</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Meet at Cipriani Downtown. Black tie dress code requested. 4-course dinner followed by jazz concert..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Live Invoice Price Calculator */}
                {activeCompanion && (
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-semibold uppercase tracking-wide">Total Booking Fee</span>
                    <span className="text-lg font-black text-purple-400 font-display flex items-center">
                      <DollarSign size={16} />
                      {calculatedTotal} USD
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all hover:scale-[1.01]"
                >
                  <CalendarIcon size={14} />
                  <span>Request Booking</span>
                </button>
              </form>
            </GlassCard>
          </div>

          {/* Bookings History Listing */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-lg font-bold font-display text-white">Active Itineraries</h2>

            {bookings.length === 0 ? (
              <GlassCard className="p-8 border border-white/5 text-center">
                <CalendarIcon size={32} className="text-purple-400 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-gray-400">No booking requests submitted yet.</p>
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
                          {companion.isVerified && <CheckCircle2 size={13} className="text-purple-400" />}
                        </h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={11} />
                            {new Date(booking.scheduledAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({booking.durationHours} hrs)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-xs font-bold text-white flex items-center">
                        <DollarSign size={13} />
                        <span>{booking.totalPrice} USD</span>
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        
                        {booking.status === "pending" && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="p-1 bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 rounded-md border border-white/5 text-[10px] font-semibold"
                          >
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
