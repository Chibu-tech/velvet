"use client";

import { useState } from "react";
import {
  Gift,
  Copy,
  Share2,
  Users,
  Award,
  ChevronRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Referral() {
  const currentUser = useVelvetStore((state) => state.currentUser);
  const [copied, setCopied] = useState(false);
  const referralCode = currentUser?.username?.toUpperCase() + "VIP" || "VELVETVIP";

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
    <div className="flex-1 flex flex-col bg-velvet-black min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10 flex flex-col gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-2 justify-center md:justify-start">
            Referral Program
            <span className="text-xs bg-velvet-gold/10 text-velvet-gold border border-velvet-gold/20 px-2 py-0.5 rounded-full font-semibold">
              Invite Only
            </span>
          </h1>
          <p className="text-xs text-white/40 mt-1 text-center md:text-left">Invite trusted friends and earn rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {referralStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} className="p-5 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-velvet-gold shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <span className="text-lg font-bold font-display text-white">{stat.value}</span>
                  <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">{stat.label}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="p-8 border border-white/5 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-velvet-gold/10 border border-velvet-gold/20 flex items-center justify-center text-velvet-gold">
            <Gift size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display text-white">Your Invite Code</h2>
            <p className="text-xs text-white/40 mt-1 max-w-md mx-auto">
              Share your personal code with friends. They get priority access, you earn rewards.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-xl font-bold font-display tracking-widest text-velvet-gold">{referralCode}</span>
            </div>

            <button
              onClick={handleCopy}
              className="p-4 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all hover:scale-105"
            >
              {copied ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>

            <button className="p-4 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all hover:scale-105">
              <Share2 size={20} />
            </button>
          </div>

          {copied && <p className="text-xs text-green-400">Copied to clipboard!</p>}
        </GlassCard>

        <GlassCard className="p-6 border border-white/5">
          <h2 className="text-lg font-bold text-white mb-6">Reward Tiers</h2>
          <div className="flex flex-col gap-4">
            {tiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-velvet-gold/10 flex items-center justify-center text-velvet-gold shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{tier.invites} {tier.invites === 1 ? "Invite" : "Invites"}</p>
                    <p className="text-xs text-white/40">Earn {tier.reward}</p>
                  </div>
                  <ChevronRight size={16} className="text-white/20" />
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">Invite History</h2>
          <div className="text-center py-8">
            <Users size={32} className="text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/40">Send your first invite to track it here.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
