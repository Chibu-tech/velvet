"use client";

import { useState } from "react";
import {
  Sparkles, Check, Zap, Award, Gem, DollarSign, Star, ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Subscriptions() {
  const currentUser = useVelvetStore((state) => state.currentUser);
  const upgradeSubscription = useVelvetStore((state) => state.upgradeSubscription);
  const buyCredits = useVelvetStore((state) => state.buyCredits);
  const boostProfile = useVelvetStore((state) => state.boostProfile);

  const [activeTab, setActiveTab] = useState<"membership" | "boosts" | "credits">("membership");
  const [boostActive, setBoostActive] = useState(false);

  const handleUpgrade = (tier: "gold" | "platinum") => upgradeSubscription(tier);
  const handleBoost = () => {
    if (!currentUser || currentUser.credits < 20) return;
    boostProfile(); setBoostActive(true);
    setTimeout(() => setBoostActive(false), 5000);
  };

  const tiers = [
    { name: "Gold", price: "49.99", icon: Award, features: ["Unlimited swipes", "50 km radius", "Profile badge", "10 connections/mo", "Standard support"], tier: "gold" as const },
    { name: "Platinum", price: "149.99", icon: Gem, features: ["Priority listings", "Unlimited connections", "VIP concierge", "Pre-booking approvals", "Exclusive events", "Verification priority"], tier: "platinum" as const, popular: true },
  ];

  const creditPackages = [
    { amount: 50, price: 9.99, icon: Sparkles },
    { amount: 150, price: 24.99, icon: Zap, popular: true },
    { amount: 500, price: 74.99, icon: Gem },
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "platinum": return { label: "Platinum Elite", color: "text-[#80465E] border-[rgba(128,70,94,0.3)] bg-[#22222E]" };
      case "gold": return { label: "Gold Member", color: "text-[#7A7870] border-white/[0.07] bg-[#22222E]" };
      default: return { label: "Free Member", color: "text-[#7A7870] border-white/[0.07] bg-transparent" };
    }
  };
  const tierInfo = getTierBadge(currentUser?.tier || "free");

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E12] min-h-[calc(100vh-4rem)] p-5 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto z-10 flex flex-col gap-8">
        <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium tracking-tight text-[#F0EDE6] flex items-center gap-2">
              Membership<span className="text-[10px] bg-[#22222E] text-[#80465E] border border-[rgba(128,70,94,0.3)] px-2 py-0.5 rounded-[100px] uppercase tracking-[0.12em] font-medium">Elite</span>
            </h1>
            <p className="text-[10px] text-[#7A7870] mt-1 uppercase tracking-[0.12em]">Unlock premium features and elevate your experience.</p>
          </div>
          <div className="flex bg-[#1A1A22] border border-white/[0.07] p-1 rounded-[100px] w-full md:w-auto">
            {(["membership", "boosts", "credits"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all ${
                  activeTab === tab ? "bg-[#80465E] text-[#0E0E12]" : "text-[#7A7870] hover:text-[#F0EDE6]"
                }`}>{tab}</button>
            ))}
          </div>
        </div>

        <GlassCard className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center border ${tierInfo.color}`}>
              <Award size={20} strokeWidth={1.5} className={tierInfo.color.split(" ")[0]} />
            </div>
            <div><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">Your Status</span><span className="text-sm font-medium text-[#F0EDE6] mt-0.5 block">{tierInfo.label}</span></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center sm:text-right"><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">Credits</span><span className="text-sm font-medium text-[#F0EDE6] mt-0.5 block">{currentUser?.credits || 0}</span></div>
            <div className="text-center sm:text-right"><span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">Level</span><span className="text-sm font-medium text-[#80465E] mt-0.5 block">Level {Math.floor((currentUser?.credits || 0) / 50) + 1}</span></div>
          </div>
        </GlassCard>

        {activeTab === "membership" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {tiers.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = currentUser?.tier === plan.tier;
              return (
                <GlassCard key={plan.name} glow={plan.popular}
                  className={`p-8 flex flex-col gap-6 relative overflow-hidden ${plan.popular ? "border-[rgba(128,70,94,0.2)]" : "border-white/[0.07]"}`}>
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-[#22222E] text-[#80465E] text-[9px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[100px] border border-[rgba(128,70,94,0.3)]">Most Popular</div>
                  )}
                  <div>
                    <h3 className="text-lg font-display font-medium text-[#F0EDE6] flex items-center gap-2">
                      <Icon size={18} strokeWidth={1.5} className="text-[#80465E]" />Premium {plan.name}
                    </h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-display font-medium text-[#F0EDE6]">${plan.price}</span>
                      <span className="text-xs text-[#7A7870] ml-1 uppercase tracking-[0.12em]">/ month</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3.5 border-t border-white/[0.07] pt-6">
                    <h4 className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em]">Included:</h4>
                    <ul className="flex flex-col gap-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#7A7870] leading-relaxed">
                          <Check size={14} strokeWidth={1.5} className="text-[#80465E] shrink-0 mt-0.5" />{feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => handleUpgrade(plan.tier)} disabled={isCurrent}
                    className={`w-full py-3.5 rounded-[100px] font-medium text-xs uppercase tracking-[0.04em] transition-all mt-4 active:scale-[0.97] ${
                      isCurrent ? "bg-[#22222E] border border-white/[0.07] text-[#7A7870] cursor-not-allowed" : "bg-[#80465E] text-[#0E0E12]"
                    }`}>{isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}</button>
                </GlassCard>
              );
            })}
          </div>
        )}

        {activeTab === "boosts" && (
          <div className="max-w-2xl mx-auto w-full">
            <GlassCard className="p-8 text-center flex flex-col items-center gap-6 relative">
              {boostActive && (
                <div className="absolute inset-0 bg-[rgba(14,14,18,0.95)] backdrop-blur-md z-20 flex flex-col justify-center items-center rounded-[18px]">
                  <Zap size={48} strokeWidth={1.5} className="text-[#80465E] animate-bounce mb-2" />
                  <h3 className="text-lg font-display font-medium text-[#F0EDE6] uppercase tracking-[0.12em]">Profile Boosted</h3>
                  <p className="text-xs text-[#7A7870] mt-1">Your visibility is increased for 2 hours.</p>
                </div>
              )}
              <div className="w-[52px] h-[52px] rounded-full bg-[#22222E] border border-[rgba(128,70,94,0.3)] flex items-center justify-center">
                <Zap size={32} strokeWidth={1.5} className="text-[#80465E]" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-medium text-[#F0EDE6] uppercase tracking-[0.12em]">Profile Boost</h2>
                <p className="text-xs text-[#7A7870] mt-2 max-w-sm mx-auto">Pin your profile at the top of discovery for 2 hours.</p>
              </div>
              <div className="p-4 rounded-[18px] bg-[#22222E] border border-[rgba(128,70,94,0.2)] flex justify-between items-center text-xs w-full max-w-sm">
                <span className="text-[#7A7870] uppercase tracking-[0.12em]">Cost</span>
                <span className="text-sm font-medium text-[#80465E] uppercase">20 Credits</span>
              </div>
              <button onClick={handleBoost} disabled={!currentUser || currentUser.credits < 20}
                className={`w-full max-w-sm py-3.5 rounded-[100px] font-medium text-xs uppercase tracking-[0.04em] transition-all active:scale-[0.97] ${
                  (!currentUser || currentUser.credits < 20) ? "bg-[#22222E] border border-white/[0.07] text-[#7A7870] cursor-not-allowed" : "bg-[#80465E] text-[#0E0E12]"
                }`}>{(!currentUser || currentUser.credits < 20) ? "Insufficient Credits" : "Activate 2H Boost"}</button>
            </GlassCard>
          </div>
        )}

        {activeTab === "credits" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {creditPackages.map((pack, idx) => {
              const Icon = pack.icon;
              return (
                <GlassCard key={idx} glow={pack.popular}
                  className={`p-6 text-center flex flex-col items-center gap-4 ${pack.popular ? "border-[rgba(128,70,94,0.2)]" : "border-white/[0.07]"}`}>
                  {pack.popular && <div className="bg-[#22222E] text-[#80465E] text-[8px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-[100px] border border-[rgba(128,70,94,0.3)]">Best Value</div>}
                  <div className="w-[52px] h-[52px] rounded-full bg-[#22222E] border border-white/[0.07] flex items-center justify-center">
                    <Icon size={22} strokeWidth={1.5} className="text-[#80465E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-medium text-[#F0EDE6]">{pack.amount} Credits</h3>
                    <p className="text-[10px] text-[#7A7870] uppercase tracking-[0.12em] mt-0.5">Premium Tokens</p>
                  </div>
                  <div className="text-lg font-medium text-[#F0EDE6] flex items-center mt-2">
                    <DollarSign size={16} strokeWidth={1.5} className="text-[#80465E]" />{pack.price} USD
                  </div>
                  <button onClick={() => buyCredits(pack.amount)}
                    className="w-full py-3 bg-[#22222E] hover:bg-[#80465E] hover:text-[#0E0E12] rounded-[100px] border border-white/[0.07] text-xs font-medium uppercase tracking-[0.04em] transition-all active:scale-[0.97]">Purchase</button>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
