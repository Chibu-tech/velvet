"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Camera, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Onboarding() {
  const router = useRouter();
  const currentUser = useVelvetStore((state) => state.currentUser);
  const updateUserOnboarding = useVelvetStore((state) => state.updateUserOnboarding);

  const isCompanion = currentUser?.role === "companion";
  const [step, setStep] = useState(1);
  const totalSteps = isCompanion ? 3 : 2;

  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [bio, setBio] = useState("");
  const [hourlyPrice, setHourlyPrice] = useState("150");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [requestVerification, setRequestVerification] = useState(false);
  const [avatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300");

  const interestsPool = [
    "Fine Dining", "Yachting", "Modern Art", "Jazz Clubs",
    "Wine Tasting", "Private Events", "Cocktail Bars",
    "VIP Access", "Polo", "Fashion", "Travel"
  ];
  const languagesPool = ["English", "Spanish", "French", "German", "Mandarin", "Italian"];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };
  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };
  const handleNext = () => {
    if (step < totalSteps) setStep(prev => prev + 1);
    else { updateUserOnboarding({ displayName, onboarded: true }); router.push("/discover"); }
  };
  const handlePrev = () => { if (step > 1) setStep(prev => prev - 1); };

  return (
    <div className="flex-1 flex items-center justify-center p-5 bg-[#0E0E12] min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-2xl z-10">
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-8 border-b border-white/[0.07] pb-4">
            <div>
              <h1 className="text-2xl font-display font-medium text-[#F0EDE6]">Complete Your Profile</h1>
              <p className="text-[10px] text-[#7A7870] mt-1 uppercase tracking-[0.12em]">Step {step} of {totalSteps}</p>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${step > idx ? "w-8 bg-[#80465E]" : "w-4 bg-white/[0.07]"}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col gap-5">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <div className="w-[104px] h-[104px] rounded-full border-2 border-white/[0.1] overflow-hidden">
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-[#22222E] text-[#80465E] rounded-full border border-white/[0.07] transition-all hover:scale-105">
                      <Camera size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                  <span className="text-[10px] text-[#7A7870] uppercase tracking-[0.12em]">Upload profile photo</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Display Name</label>
                  <input type="text" placeholder="Your display name" value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Bio</label>
                  <textarea rows={3} placeholder="Tell us about yourself..." value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none transition-all resize-none" />
                </div>
                {isCompanion && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em]">Hourly Rate (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870] text-sm">$</span>
                      <input type="number" placeholder="150" value={hourlyPrice}
                        onChange={(e) => setHourlyPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none transition-all" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col gap-5">
                <div>
                  <h3 className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em] mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {interestsPool.map((interest) => {
                      const selected = selectedInterests.includes(interest);
                      return (
                        <button key={interest} type="button" onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-1.5 rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium border transition-all ${
                            selected ? "bg-[#22222E] text-[#80465E] border-[rgba(128,70,94,0.3)]" : "border-white/[0.07] bg-[#1A1A22] text-[#7A7870] hover:text-[#F0EDE6]"
                          }`}>{interest}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium text-[#7A7870] uppercase tracking-[0.12em] mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {languagesPool.map((lang) => {
                      const selected = selectedLanguages.includes(lang);
                      return (
                        <button key={lang} type="button" onClick={() => handleLanguageToggle(lang)}
                          className={`px-3 py-1.5 rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium border transition-all ${
                            selected ? "bg-[#22222E] text-[#80465E] border-[rgba(128,70,94,0.3)]" : "border-white/[0.07] bg-[#1A1A22] text-[#7A7870] hover:text-[#F0EDE6]"
                          }`}>{lang}</button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && isCompanion && (
              <motion.div key="step-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col gap-5">
                <GlassCard className="p-5 border border-[rgba(128,70,94,0.2)]">
                  <div className="flex items-start gap-4">
                    <input type="checkbox" id="vetting-check" checked={requestVerification}
                      onChange={(e) => setRequestVerification(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/[0.1] bg-[#22222E] cursor-pointer accent-[#80465E]" />
                    <div>
                      <label htmlFor="vetting-check" className="text-sm font-medium text-[#F0EDE6] cursor-pointer select-none flex items-center gap-1.5">
                        Request verification
                        <CheckCircle size={14} strokeWidth={1.5} className="text-[#80465E]" />
                      </label>
                      <p className="text-xs text-[#7A7870] mt-1 leading-relaxed">
                        Submit for review to earn the Verified badge. Verified profiles receive priority placement.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 border-t border-white/[0.07] pt-6 gap-4">
            <button onClick={handlePrev} disabled={step === 1}
              className={`px-6 py-3 border border-white/[0.2] text-[#F0EDE6] font-medium rounded-[100px] text-sm flex items-center gap-1.5 transition-all active:scale-[0.97] ${
                step === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/[0.04]"
              }`}>
              <ArrowLeft size={14} strokeWidth={1.5} />Back
            </button>
            <button onClick={handleNext}
              className="px-6 py-3 bg-[#80465E] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] flex items-center gap-1.5 transition-all active:scale-[0.97]">
              {step === totalSteps ? "Complete" : "Continue"}<ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
