"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Camera,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
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
  const [locationName, setLocationName] = useState("Manhattan, NY");
  const [radius, setRadius] = useState(15);
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300");
  const [requestVerification, setRequestVerification] = useState(false);

  const interestsPool = [
    "Fine Dining", "Yachting", "Modern Art", "Jazz Clubs",
    "Wine Tasting", "Private Events", "Cocktail Bars",
    "VIP Access", "Polo", "Fashion", "Travel"
  ];

  const languagesPool = ["English", "Spanish", "French", "German", "Mandarin", "Italian"];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      updateUserOnboarding({ displayName, onboarded: true });
      router.push("/discover");
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-velvet-black min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <GlassCard className="p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Complete Your Profile</h1>
              <p className="text-xs text-white/40 mt-1">Step {step} of {totalSteps}</p>
            </div>

            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step > idx ? "w-8 bg-velvet-gold" : "w-4 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden">
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white/10 hover:bg-white/15 text-white rounded-full border border-velvet-black transition-all hover:scale-105">
                      <Camera size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-white/40">Upload profile photo</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">Display Name</label>
                  <input
                    type="text"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your interests, lifestyle, and what you're looking for..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all resize-none"
                  />
                </div>

                {isCompanion && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">Hourly Rate (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="150"
                        value={hourlyPrice}
                        onChange={(e) => setHourlyPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {interestsPool.map((interest) => {
                      const selected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selected
                              ? "bg-white/10 border-white/20 text-white"
                              : "border-white/5 bg-white/5 text-white/40 hover:text-white/70"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {languagesPool.map((lang) => {
                      const selected = selectedLanguages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selected
                              ? "bg-white/10 border-white/20 text-white"
                              : "border-white/5 bg-white/5 text-white/40 hover:text-white/70"
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && isCompanion && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wide">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="e.g. Manhattan, NY"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold text-white/40 uppercase tracking-wide">
                    <span>Visibility Radius</span>
                    <span className="text-velvet-gold">{radius} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <GlassCard className="p-5 border border-velvet-gold/20 bg-velvet-gold/[0.03]">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="vetting-check"
                      checked={requestVerification}
                      onChange={(e) => setRequestVerification(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 cursor-pointer accent-velvet-gold"
                    />
                    <div>
                      <label htmlFor="vetting-check" className="text-sm font-bold text-white cursor-pointer select-none flex items-center gap-1.5">
                        Request Verification
                        <CheckCircle size={14} className="text-velvet-gold" />
                      </label>
                      <p className="text-xs text-white/40 mt-1 leading-relaxed">
                        Submit for review to earn the Verified badge. Verified profiles receive priority placement.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 border-t border-white/5 pt-6 gap-4">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-5 py-3 rounded-xl border border-white/5 text-sm font-semibold flex items-center gap-1.5 transition-all ${
                step === 1 ? "opacity-30 cursor-not-allowed" : "text-white/40 hover:text-white bg-white/5"
              }`}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] border border-white/5"
            >
              <span>{step === totalSteps ? "Complete" : "Continue"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
