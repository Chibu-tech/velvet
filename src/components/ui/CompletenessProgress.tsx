"use client";

import { CheckCircle, Circle } from "lucide-react";
import { useVelvetStore } from "@/store/useVelvetStore";

export function CompletenessProgress() {
  const getCompletenessScore = useVelvetStore((state) => state.getCompletenessScore);
  const currentUser = useVelvetStore((state) => state.currentUser);
  const emergencyContacts = useVelvetStore((state) => state.emergencyContacts);

  const score = getCompletenessScore();
  const companion = useVelvetStore((state) => state.companions.find(c => c.id === currentUser?.id));

  const items = [
    { label: "Identity Verified", done: currentUser?.verificationStatus === "verified", weight: 20 },
    { label: "Bio (50+ characters)", done: (companion?.bio?.length || 0) >= 50, weight: 10 },
    { label: "3+ Photos", done: (companion?.images?.length || 0) >= 3, weight: 10 },
    { label: "Interests Added", done: (companion?.interests?.length || 0) >= 1, weight: 5 },
    { label: "Safe Word Set", done: !!currentUser?.safeWord, weight: 10 },
    { label: "Emergency Contacts", done: emergencyContacts.length > 0, weight: 10 },
    { label: "Pricing Set", done: !!companion?.pricingHourly && companion.pricingHourly > 0, weight: 10 },
    { label: "Availability Set", done: !!companion?.availabilityStatus, weight: 5 },
    { label: "Onboarding Complete", done: !!currentUser?.onboarded, weight: 10 },
    { label: "Display Name Set", done: (currentUser?.displayName?.length || 0) > 2, weight: 5 },
  ];

  const doneItems = items.filter(i => i.done);
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28" fill="none" stroke="#C9A84C" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / totalWeight)}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#C9A84C]">
            {Math.round((score / totalWeight) * 100)}%
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-[#F0EDE6]">Profile Completeness</p>
          <p className="text-xs text-[#7A7870]">{doneItems.length}/{items.length} completed</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {item.done
                ? <CheckCircle size={12} strokeWidth={1.5} className="text-emerald-400" />
                : <Circle size={12} strokeWidth={1.5} className="text-[#4A4845]" />
              }
              <span className={item.done ? "text-[#7A7870]" : "text-[#4A4845]"}>{item.label}</span>
            </div>
            <span className="text-[9px] text-[#4A4845]">+{item.weight}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
