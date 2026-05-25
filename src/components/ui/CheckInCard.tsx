"use client";

import { LogIn, LogOut, AlertTriangle } from "lucide-react";
import { useVelvetStore } from "@/store/useVelvetStore";
import type { Booking } from "@/lib/mockData";

export function CheckInCard({ booking }: { booking: Booking }) {
  const checkInToBooking = useVelvetStore((state) => state.checkInToBooking);
  const checkOutOfBooking = useVelvetStore((state) => state.checkOutOfBooking);
  const triggerSafeWord = useVelvetStore((state) => state.triggerSafeWord);

  const isActive = booking.status === "active";
  const canCheckIn = booking.status === "approved";
  const isDistress = booking.status === "distress";

  return (
    <div className={`p-4 rounded-[18px] border ${
      isDistress ? "bg-rose-600/10 border-rose-500/30" :
      isActive ? "bg-emerald-600/10 border-emerald-500/30" :
      "bg-[#22222E] border-white/[0.07]"
    }`}>
      <h3 className="text-sm font-medium text-[#F0EDE6] mb-2 flex items-center gap-2">
        Safety Check-In
        {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        {isDistress && <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}
      </h3>

      {isDistress ? (
        <div className="flex items-center gap-2 text-rose-400 text-xs">
          <AlertTriangle size={14} strokeWidth={1.5} />
          Distress signal sent. Admin has been notified.
        </div>
      ) : isActive ? (
        <div className="flex gap-2">
          <button onClick={() => checkOutOfBooking(booking.id)}
            className="flex-1 py-2.5 bg-emerald-600 text-white rounded-[100px] text-xs font-medium transition-all active:scale-[0.97] flex items-center justify-center gap-1.5">
            <LogOut size={14} strokeWidth={1.5} />Check Out Safely
          </button>
          <button onClick={() => triggerSafeWord(booking.id)}
            className="min-w-[44px] py-2.5 border border-rose-500/30 text-rose-400 rounded-[100px] text-xs transition-all active:scale-[0.97] flex items-center justify-center"
            title="Trigger safe word (distress)">
            <AlertTriangle size={14} strokeWidth={1.5} />
          </button>
        </div>
      ) : canCheckIn ? (
        <button onClick={() => checkInToBooking(booking.id)}
          className="w-full py-2.5 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97] flex items-center justify-center gap-1.5">
          <LogIn size={14} strokeWidth={1.5} />Check In Now
        </button>
      ) : (
        <p className="text-xs text-[#7A7870]">Check-in available when booking starts.</p>
      )}
    </div>
  );
}
