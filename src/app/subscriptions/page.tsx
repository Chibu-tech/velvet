"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Check, 
  Zap, 
  Flame, 
  Award, 
  HelpCircle,
  Gem,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Subscriptions() {
  const currentUser = useVelvetStore((state) => state.currentUser);
  const upgradeSubscription = useVelvetStore((state) => state.upgradeSubscription);
  const buyCredits = useVelvetStore((state) => state.buyCredits);
  const boostProfile = useVelvetStore((state) => state.boostProfile);

  const [activeTab, setActiveTab] = useState<"plans" | "boosts" | "credits">("plans");
  const [boostActive, setBoostActive] = useState(false);

  const handleUpgrade = (tier: "gold" | "platinum") => {
    upgradeSubscription(tier);
  };

  const handleBoost = () => {
    if (!currentUser || currentUser.credits < 20) return;
    boostProfile();
    setBoostActive(true);
    setTimeout(() => {
      setBoostActive(false);
    }, 5000);
  };

  const plans = [
    {
      name: "Velvet Gold",
      price: "49.99",
      billing: "/ month",
      icon: Award,
      color: "from-purple-600 to-indigo-600",
      accent: "text-purple-400 border-purple-500/30",
      features: [
        "Infinite Swipe Feed cards",
        "Geographic filter up to 50 km radius",
        "Vetted badge visibility highlight",
        "Direct connection to up to 10 companions/month",
        "Standard platform booking insurance"
      ],
      tier: "gold" as const
    },
    {
      name: "Velvet Platinum",
      price: "149.99",
      billing: "/ month",
      icon: Gem,
      color: "from-yellow-600 to-amber-600",
      accent: "text-gold border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]",
      features: [
        "Priority Search Listings (300% boost)",
        "Pinpoint geographic PostGIS mapping views",
        "Direct booking pre-approvals routes",
        "Unlimited custom connection chats",
        "Private VIP customer support concierge",
        "Exclusive access to high-tier nightlife hosts"
      ],
      tier: "platinum" as const,
      popular: true
    }
  ];

  const creditPackages = [
    { amount: 50, price: 9.99, icon: Sparkles },
    { amount: 150, price: 24.99, icon: Zap, popular: true },
    { amount: 500, price: 74.99, icon: Flame }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#030206] min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-900/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto z-10 flex flex-col gap-8">
        <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-2">
              VELVET VIP CIRCLE
              <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full font-semibold">
                VIP
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Unlock premium nightlife networks, prioritized matching, and VIP profiles search.</p>
          </div>

          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl w-full md:w-auto">
            {(["plans", "boosts", "credits"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Current status display card */}
        <GlassCard className="p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
              <Award size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Your Membership</span>
              <span className="text-sm font-bold text-white uppercase tracking-wider mt-0.5 block">
                {currentUser?.tier === "free" ? "Standard Free Member" : `Velvet ${currentUser?.tier} VIP`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center sm:text-right">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Credits balance</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{currentUser?.credits} Credits</span>
            </div>
          </div>
        </GlassCard>

        {/* Main Paywall options grid */}
        {activeTab === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = currentUser?.tier === plan.tier;
              return (
                <GlassCard 
                  key={plan.name} 
                  glow={plan.popular}
                  className={`p-8 border flex flex-col gap-6 relative overflow-hidden ${
                    plan.popular ? plan.accent : "border-white/5"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                      <Icon size={18} className="text-purple-400" />
                      {plan.name}
                    </h3>
                    
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-black font-display text-white">${plan.price}</span>
                      <span className="text-xs text-gray-500 ml-1 font-semibold uppercase">{plan.billing}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 border-t border-white/5 pt-6">
                    <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Privileges included:</h4>
                    <ul className="flex flex-col gap-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                          <Check size={14} className="text-purple-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isCurrent}
                    className={`w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all mt-4 ${
                      isCurrent
                        ? "bg-purple-600/10 border border-purple-500/20 text-purple-400 cursor-not-allowed text-center"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:scale-[1.01]"
                    }`}
                  >
                    {isCurrent ? "Active Membership" : `Upgrade to ${plan.name}`}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Boost Profile Segment */}
        {activeTab === "boosts" && (
          <div className="max-w-2xl mx-auto w-full">
            <GlassCard className="p-8 border border-white/5 text-center flex flex-col items-center gap-6 relative">
              {boostActive && (
                <div className="absolute inset-0 bg-[#030206]/90 backdrop-blur-md z-20 flex flex-col justify-center items-center rounded-2xl animate-pulse">
                  <Flame size={48} className="text-yellow-500 animate-bounce mb-2" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">PROFILE BOOSTED LIVE</h3>
                  <p className="text-xs text-gray-400 mt-1">Your visibility is increased by 500% in your local {currentUser?.role === 'companion' ? '25' : '15'}km grid.</p>
                </div>
              )}

              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Flame size={32} />
              </div>

              <div>
                <h2 className="text-2xl font-bold font-display text-white uppercase tracking-wider">Instant Profile Boost</h2>
                <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  Pin your profile at the top of local discovery stacks for **2 hours** to multiply swipes and social booking requests.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex justify-between items-center text-xs w-full max-w-sm">
                <span className="text-gray-400 font-semibold uppercase tracking-wide">Instant Boost Cost</span>
                <span className="text-sm font-bold text-yellow-500 uppercase">20 Credits</span>
              </div>

              <button
                onClick={handleBoost}
                disabled={!currentUser || currentUser.credits < 20}
                className={`w-full max-w-sm py-3.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-semibold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all ${
                  (!currentUser || currentUser.credits < 20) ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.01]"
                }`}
              >
                {(!currentUser || currentUser.credits < 20) ? "Insufficient Credits" : "Activate 2H Profile Boost"}
              </button>
            </GlassCard>
          </div>
        )}

        {/* Buy Credits Options */}
        {activeTab === "credits" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {creditPackages.map((pack, idx) => {
              const Icon = pack.icon;
              return (
                <GlassCard 
                  key={idx} 
                  glow={pack.popular}
                  className={`p-6 border text-center flex flex-col items-center gap-4 ${
                    pack.popular ? "border-purple-500/30" : "border-white/5"
                  }`}
                >
                  {pack.popular && (
                    <div className="bg-purple-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      BEST VALUE
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-full bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-display text-white">{pack.amount} Credits</h3>
                    <p className="text-[10px] text-gray-500 uppercase mt-0.5">Velvet Tokens Pack</p>
                  </div>

                  <div className="text-lg font-bold text-white flex items-center font-display mt-2">
                    <DollarSign size={16} className="text-purple-400" />
                    <span>{pack.price} USD</span>
                  </div>

                  <button
                    onClick={() => buyCredits(pack.amount)}
                    className="w-full py-3 bg-white/5 hover:bg-purple-600 hover:text-white rounded-xl border border-white/5 text-xs font-semibold transition-all hover:scale-[1.01]"
                  >
                    Purchase Tokens
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
