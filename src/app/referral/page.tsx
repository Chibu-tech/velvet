"use client";

import { useState } from "react";
import {
  Gift, Copy, Share2, Users, Award, ChevronRight,
  CheckCircle, Sparkles, TrendingUp, Star,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Referral() {
  const currentUser = useVelvetStore((state) => state.currentUser);
  const [copied, setCopied] = useState(false);
  const referralCode = (currentUser?.username?.toUpperCase() || "PREMIUM") + "VIP";

  const referralStats = [
    { label: "Invites Sent", value: 3, icon: Users },
    { label: "Joined", value: 1, icon: CheckCircle },
    { label: "Rewards Earned", value: "50 credits", icon: Award },
  ];

  const tiers = [
    { invites: 1, reward: "50 Credits", icon: Star },
    { invites: 3, reward: "150 Credits", icon: Sparkles },
    { invites: 5, reward: "1 Month Gold", icon: Award },
    { invites: 10, reward: "1 Month Platinum", icon: TrendingUp },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E12] min-h-[calc(100vh-4rem)] p-5 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto z-10 flex flex-col gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-display font-medium tracking-tight text-[#F0EDE6] flex items-center gap-2 justify-center md:justify-start">
            Referral Program
            <span className="text-[10px] bg-[#22222E] text-[#C9A84C] border border-[rgba(201,168,76,0.3)] px-2 py-0.5 rounded-[100px] uppercase tracking-[0.12em] font-medium">Invite Only</span>
          </h1>
          <p className="text-[10px] text-[#7A7870] mt-1 text-center md:text-left uppercase tracking-[0.12em]">Invite trusted friends and earn rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {referralStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} className="p-5 flex items-center gap-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#22222E] border border-white/[0.07] flex items-center justify-center shrink-0">
                  <Icon size={18} strokeWidth={1.5} className="text-[#C9A84C]" />
                </div>
                <div>
                  <span className="text-lg font-display font-medium text-[#F0EDE6]">{stat.value}</span>
                  <span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">{stat.label}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="p-8 text-center flex flex-col items-center gap-6">
          <div className="w-[52px] h-[52px] rounded-full bg-[#22222E] border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
            <Gift size={32} strokeWidth={1.5} className="text-[#C9A84C]" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-medium text-[#F0EDE6]">Your Invite Code</h2>
            <p className="text-xs text-[#7A7870] mt-1 max-w-md mx-auto">Share your code. Friends get priority access, you earn rewards.</p>
          </div>
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 p-4 rounded-[12px] bg-[#22222E] border border-white/[0.07] text-center">
              <span className="text-xl font-display font-medium tracking-widest text-[#C9A84C]">{referralCode}</span>
            </div>
            <button onClick={handleCopy}
              className="min-w-[48px] min-h-[48px] bg-[#22222E] border border-white/[0.07] rounded-full transition-all flex items-center justify-center active:scale-[0.97] hover:bg-[#C9A84C] hover:text-[#0E0E12]">
              {copied ? <CheckCircle size={20} strokeWidth={1.5} className="text-green-400" /> : <Copy size={20} strokeWidth={1.5} className="text-[#C9A84C]" />}
            </button>
            <button className="min-w-[48px] min-h-[48px] bg-[#22222E] border border-white/[0.07] rounded-full transition-all flex items-center justify-center active:scale-[0.97] hover:bg-[#C9A84C] hover:text-[#0E0E12]">
              <Share2 size={20} strokeWidth={1.5} className="text-[#C9A84C]" />
            </button>
          </div>
          {copied && <p className="text-xs text-green-400">Copied to clipboard!</p>}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-display font-medium text-[#F0EDE6] mb-6">Reward Tiers</h2>
          <div className="flex flex-col gap-4">
            {tiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#1A1A22] flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={1.5} className="text-[#C9A84C]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#F0EDE6]">{tier.invites} {tier.invites === 1 ? "Invite" : "Invites"}</p>
                    <p className="text-xs text-[#7A7870]">Earn {tier.reward}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-[#7A7870]" />
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-display font-medium text-[#F0EDE6] mb-4">Invite History</h2>
          <div className="text-center py-8">
            <Users size={32} strokeWidth={1.5} className="text-[#7A7870] mx-auto mb-2" />
            <p className="text-xs text-[#7A7870]">Send your first invite to track it here.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
