"use client";

import { useState } from "react";
import {
  Sparkles,
  Check,
  Zap,
  Award,
  Gem,
  DollarSign,
  Star,
  ShieldCheck,
  TrendingUp,
  Gift,
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

  const handleUpgrade = (tier: "gold" | "platinum") => {
    upgradeSubscription(tier);
  };

  const handleBoost = () => {
    if (!currentUser || currentUser.credits < 20) return;
    boostProfile();
    setBoostActive(true);
    setTimeout(() => setBoostActive(false), 5000);
  };

  const tiers = [
    { name: "Gold", price: "49.99", icon: Award, accent: "text-velvet-gold border-velvet-gold/30", features: ["Unlimited swipes", "50 km radius filter", "Profile badge", "10 connections/month", "Standard support"], tier: "gold" as const },
    { name: "Platinum", price: "149.99", icon: Gem, accent: "text-velvet-gold border-velvet-gold/30 shadow-[0_0_20px_rgba(201,169,78,0.1)]", features: ["Priority listings (+300%)", "Unlimited connections", "VIP support concierge", "Pre-booking approvals", "Exclusive event access", "Profile verification priority"], tier: "platinum" as const, popular: true },
  ];

  const creditPackages = [
    { amount: 50, price: 9.99, icon: Sparkles },
    { amount: 150, price: 24.99, icon: Zap, popular: true },
    { amount: 500, price: 74.99, icon: Gem },
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "platinum": return { label: "Platinum Elite", color: "text-velvet-gold border-velvet-gold/20 bg-velvet-gold/10" };
      case "gold": return { label: "Gold Member", color: "text-white/60 border-white/10 bg-white/5" };
      default: return { label: "Free Member", color: "text-white/40 border-white/5 bg-white/[0.02]" };
    }
  };

  const tierInfo = getTierBadge(currentUser?.tier || "free");

  return (
    <div className="flex-1 flex flex-col bg-velvet-black min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto z-10 flex flex-col gap-8">
        <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-2">
              Membership
              <span className="text-xs bg-velvet-gold/10 text-velvet-gold border border-velvet-gold/20 px-2 py-0.5 rounded-full font-semibold">Elite</span>
            </h1>
            <p className="text-xs text-white/40 mt-1">Unlock premium features and elevate your experience.</p>
          </div>

          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl w-full md:w-auto">
            {(["membership", "boosts", "credits"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <GlassCard className="p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${tierInfo.color}`}>
              <Award size={20} className={tierInfo.color.split(" ")[0]} />
            </div>
            <div>
              <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">Your Status</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{tierInfo.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center sm:text-right">
              <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">Credits</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{currentUser?.credits || 0}</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">Level</span>
              <span className="text-sm font-bold text-velvet-gold mt-0.5 block">Level {Math.floor((currentUser?.credits || 0) / 50) + 1}</span>
            </div>
          </div>
        </GlassCard>

        {activeTab === "membership" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {tiers.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = currentUser?.tier === plan.tier;
              return (
                <GlassCard key={plan.name} glow={plan.popular}
                  className={`p-8 border flex flex-col gap-6 relative overflow-hidden ${plan.popular ? plan.accent : "border-white/5"}`}>
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-velvet-gold/20 text-velvet-gold text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-velvet-gold/30">
                      MOST POPULAR
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                      <Icon size={18} className="text-velvet-gold" />
                      Velvet {plan.name}
                    </h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-black font-display text-white">${plan.price}</span>
                      <span className="text-xs text-white/40 ml-1 font-semibold uppercase">/ month</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3.5 border-t border-white/5 pt-6">
                    <h4 className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Included:</h4>
                    <ul className="flex flex-col gap-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-white/60 leading-relaxed">
                          <Check size={14} className="text-velvet-gold shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isCurrent}
                    className={`w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all mt-4 ${
                      isCurrent ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed text-center" : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    }`}>
                    {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        )}

        {activeTab === "boosts" && (
          <div className="max-w-2xl mx-auto w-full">
            <GlassCard className="p-8 border border-white/5 text-center flex flex-col items-center gap-6 relative">
              {boostActive && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col justify-center items-center rounded-2xl">
                  <Zap size={48} className="text-velvet-gold animate-bounce mb-2" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">PROFILE BOOSTED</h3>
                  <p className="text-xs text-white/40 mt-1">Your visibility is increased for 2 hours.</p>
                </div>
              )}
              <div className="w-16 h-16 rounded-full bg-velvet-gold/10 border border-velvet-gold/20 flex items-center justify-center text-velvet-gold">
                <Zap size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wider">Profile Boost</h2>
                <p className="text-xs text-white/40 mt-2 max-w-sm mx-auto leading-relaxed">
                  Pin your profile at the top of discovery for 2 hours.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-velvet-gold/5 border border-velvet-gold/10 flex justify-between items-center text-xs w-full max-w-sm">
                <span className="text-white/40 font-semibold uppercase tracking-wide">Cost</span>
                <span className="text-sm font-bold text-velvet-gold uppercase">20 Credits</span>
              </div>
              <button
                onClick={handleBoost}
                disabled={!currentUser || currentUser.credits < 20}
                className={`w-full max-w-sm py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs uppercase tracking-wider border border-white/10 transition-all ${(!currentUser || currentUser.credits < 20) ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.01]"}`}>
                {(!currentUser || currentUser.credits < 20) ? "Insufficient Credits" : "Activate 2H Boost"}
              </button>
            </GlassCard>
          </div>
        )}

        {activeTab === "credits" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {creditPackages.map((pack, idx) => {
              const Icon = pack.icon;
              return (
                <GlassCard key={idx} glow={pack.popular}
                  className={`p-6 border text-center flex flex-col items-center gap-4 ${pack.popular ? "border-velvet-gold/30" : "border-white/5"}`}>
                  {pack.popular && <div className="bg-velvet-gold/20 text-velvet-gold text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-velvet-gold/30">BEST VALUE</div>}
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-velvet-gold">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">{pack.amount} Credits</h3>
                    <p className="text-[10px] text-white/40 uppercase mt-0.5">Velvet Tokens</p>
                  </div>
                  <div className="text-lg font-bold text-white flex items-center font-display mt-2">
                    <DollarSign size={16} className="text-velvet-gold" />
                    <span>{pack.price} USD</span>
                  </div>
                  <button
                    onClick={() => buyCredits(pack.amount)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/5 text-xs font-semibold transition-all">
                    Purchase
                  </button>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
